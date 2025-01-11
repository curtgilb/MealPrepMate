from ingredient_parser.en.preprocess import PreProcessor
from dataclasses import dataclass
from typing import Optional
import re

from fractions import Fraction

from Inflect import Inflect


@dataclass
class Position:
    text: str
    start: int
    end: int


@dataclass
class QuantityInput:
    quantity: float
    maxQuantity: float


@dataclass
class AmountPosition:
    quantity: Optional[Position]
    maxQuantity: Optional[Position]
    unit: Optional[Position]
    amount: Position


number_pattern = re.compile(r"""(?x)                
    (?:
        # Mixed fractions (e.g., 1 2/3)
        \d+\s+\d+/\d+|
        
        # Simple fractions (e.g., 1/2)
        \d+/\d+|
        
        # Decimal numbers (e.g., 123.456)
        \d*\.?\d+
    )
    """)

fraction_pattern = re.compile(r"""(?x)                
    (?:
        # Mixed fractions (e.g., 1 2/3)
        \d+\s+\d+/\d+|
        
        # Simple fractions (e.g., 1/2)
        \d+/\d+
    )
    """)

tokeized_fraction_pattern = re.compile(r"\d*#\d+\$\d+")


class SentenceAnnotator:
    def __init__(self, sentence: str, inflect: Inflect):
        processed = PreProcessor(sentence)
        self.sentence = self.__replace_tokenized_fractions(processed.sentence)
        self.tokens = processed.tokenized_sentence
        self.positions = None
        self.inflect = inflect

    def __replace_tokenized_fractions(self, text: str):
        return tokeized_fraction_pattern.sub(
            lambda m: str(
                self.__cast_to_float(m.group(0).replace("#", " ").replace("$", "/"))
            ),
            text,
        )

    def __replace_fractions(self, text: str):
        return fraction_pattern.sub(
            lambda m: str(self.__cast_to_float(m.group(0))),
            text,
        )

    def __try_token_variations(
        self, sentence_remainder: str, token: str
    ) -> Optional[str]:
        # 3. Try plural form
        plural_version = self.inflect.pluralize(token)
        if sentence_remainder.startswith(plural_version):
            return plural_version

        # 1. Try exact match
        if sentence_remainder.startswith(token):
            return token

        # 2. Try with fractions replaced
        cleaned_token = self.__replace_tokenized_fractions(token)
        if sentence_remainder.startswith(cleaned_token):
            return cleaned_token

        return None

    def __map_token_to_pos(self):
        if self.positions is None:
            self.positions = []
            current_pos = 0

            for token in self.tokens:
                # Skip any whitespace
                while (
                    current_pos < len(self.sentence)
                    and self.sentence[current_pos].isspace()
                ):
                    current_pos += 1

                # Find the token
                sentence_remainder = self.sentence[current_pos:]
                matching_token = self.__try_token_variations(sentence_remainder, token)
                if not matching_token:
                    raise ValueError(f"Could not match token {token}")

                self.positions.append(current_pos)
                current_pos = current_pos + len(matching_token)

    def __cast_to_float(self, number_str: str):
        # Strip any whitespace
        number_str = number_str.strip()

        # Check if it's a mixed fraction (e.g., "1 2/3")
        mixed_fraction_match = re.match(r"(\d+)\s+(\d+/\d+)", number_str)
        if mixed_fraction_match:
            whole = int(mixed_fraction_match.group(1))
            fraction = Fraction(mixed_fraction_match.group(2))
            return round(float(whole + fraction), 3)

        # Check if it's a simple fraction (e.g., "1/2")
        if "/" in number_str:
            return round(float(Fraction(number_str)), 3)

        # Must be a regular number or decimal
        return round(float(number_str), 3)

    def __numbers_are_equal(self, from_text: float, from_nlp: float):
        percent_tolerance = 1.5

        if from_text == from_nlp:  # Handle exact equality including both being zero
            return True

        if from_text == 0 or from_nlp == 0:  # Handle when one value is zero
            return False  # Can't calculate percentage difference with zero

        # Calculate percentage difference relative to the larger value
        larger = max(abs(from_text), abs(from_nlp))
        diff_percentage = abs(from_text - from_nlp) / larger * 100

        return diff_percentage <= percent_tolerance

    def __extract_numbers(
        self, sub_string: str, token_start_pos: int, quantities: QuantityInput
    ):
        results = [None, None]

        for match in number_pattern.finditer(sub_string):
            matching_text = match.group()
            value = self.__cast_to_float(matching_text)
            start_pos = match.start() + token_start_pos
            end_pos = (match.end() - 1) + token_start_pos
            if quantities.quantity and self.__numbers_are_equal(
                value, quantities.quantity
            ):
                results[0] = (matching_text, start_pos, end_pos)
            elif quantities.maxQuantity and self.__numbers_are_equal(
                value, quantities.maxQuantity
            ):
                results[1] = (matching_text, start_pos, end_pos)

        return results

    def __extract_unit(self, sub_string: str, token_start_pos: int, unit: str):
        match_index = sub_string.find(unit)
        if match_index != -1:
            start = match_index + token_start_pos
            end = start + len(unit)
            word_end = self.__get_full_word(end)
            return Position(
                start=start, end=end, text=self.sentence[start : word_end + 1]
            )
        return None

    def __get_token_position(self, token_index: int, text: str):
        self.__map_token_to_pos()
        text_no_fractions = self.__replace_fractions(text)
        start = self.positions[token_index]
        end = start + len(text_no_fractions) - 1
        word_end = self.__get_full_word(end)
        return Position(
            start=start, end=word_end, text=self.sentence[start : word_end + 1]
        )

    def __get_full_word(self, tentative_end: int):
        current_pos = tentative_end + 1
        while (
            current_pos < len(self.sentence)
            and not self.sentence[current_pos].isspace()
        ):
            current_pos += 1
        return current_pos - 1

    def get_ingredient_position(self, token_index: int, text: str):
        return self.__get_token_position(token_index=token_index, text=text)

    def get_amount_position(
        self, token_index: int, text: str, unit: str, quantities: QuantityInput
    ):
        pos = self.__get_token_position(token_index, text)
        # Python splicing is exclusive on the last index, need to add one
        amount_substring = self.sentence[pos.start : pos.end + 1]
        matching_numbers = self.__extract_numbers(
            amount_substring, pos.start, quantities
        )
        unit_pos = self.__extract_unit(amount_substring, pos.start, unit)

        return AmountPosition(
            quantity=matching_numbers[0],
            maxQuantity=matching_numbers[1],
            unit=unit_pos,
            amount=pos,
        )


# test_sentences = [
#     "2 tablespoons cumin",
#     "1 to 2 tablespoons cumin",
#     "0.5 tablespoon cumin",
#     "\u00bd tablespoon cumin",
#     "1 1/2 tablespoon cumin",
#     "1\u00bd tablespoon cumin",
#     "1.5 tablespoon cumin",
# ]


# for sentence in test_sentences:
#     parsed = parse_ingredient(sentence, string_units=True)
#     processed = PreProcessor(sentence)

#     print(
#         f"Parsed sentence: {parsed.sentence}\n Processed sentence {processed.sentence}\n Tokens: {processed.tokenized_sentence}"
#     )


# parsed = parse_ingredient("1 to 2 tablespoons cumin", string_units=True)
# cache = PositionCache(parsed.sentence)
# # Get ingredient Position
# ingredient = cache.get_token_position(parsed.name.starting_index, parsed.name.text)
# # Get amount(both quantity and unit) Positions
# parsed_amount = parsed.amount[0]
# quantities = Quantities(
#     quantity=parsed_amount.quantity,
#     maxQuantity=None
#     if parsed_amount.quantity == parsed_amount.quantity_max
#     else parsed_amount.quantity_max,
# )
# amount = cache.get_amount_position(
#     parsed_amount.starting_index, parsed_amount.text, parsed_amount.unit, quantities
# )
# sentence = cache.sentence
# print("finished")


# quantity is off by one at end
# Full amount is good
# unit is off by one at the end
