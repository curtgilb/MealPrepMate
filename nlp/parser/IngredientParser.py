from ingredient_parser import inspect_parser
from logger.logger import logger
import re
from ingredient_parser.dataclasses import (
    CompositeIngredientAmount,
    IngredientAmount,
    ParsedIngredient,
)

from lib.AmountMatcher import AmountPosition
from lib.NumberUtils import NumberUtils
from lib.Inflect import Inflect
from dto.IngredientResponse import ParsedIngredient, ParsedIngredientResponse, IngredientAmount as ParsedIngredientAmount
from dto.Annotations import (
    Annotation,
    IngredientAnnotation,
    QuantityAnnotation,
)
from typing import Union, List

from lib.TokenMapping import TokenMapping
from lib.SentenceDenormalizer import SentenceDenormalizer


class IngredientParser:
    def __init__(self):
        self.inflect = Inflect()
        self.numbers = NumberUtils()

    def __get_amount_annotations(
        self,
        parsing: List[Union[IngredientAmount, CompositeIngredientAmount]],
        mapping: TokenMapping,
    ) -> List[Union[IngredientAmount, CompositeIngredientAmount]]:

        amount_annotations = []

        for parsed_amount in parsing.amount:
            # Composite Ingredients, has a sub-component list
            if isinstance(parsed_amount, CompositeIngredientAmount):
                amount_position = mapping.get_position(
                    parsed_amount.starting_index, parsed_amount.text
                )

                amount_parts = []
                for sub_amount in parsed_amount.amounts:
                    amount_parts.append(
                        self.__get_quantity_annotation(sub_amount, mapping))

                amount_annotations.append(
                    CompositeIngredientAmount(
                        quantities=amount_parts,
                        amount_text=Annotation(
                            text=amount_position.substring, start=amount_position.start, end=amount_position.end
                        ),
                    )
                )
            # Regular ingredient amount
            elif isinstance(parsed_amount, IngredientAmount):
                amount_annotations.append(
                    self.__get_quantity_annotation(parsed_amount, mapping)
                )

        return amount_annotations

    def __get_quantity_annotation(
        self, amount: IngredientAmount, mapping: TokenMapping
    ) -> IngredientAmount:
        amount_position = mapping.get_position(
            amount.starting_index, amount.text)
        max_qty = amount.quantity_max if amount.quantity_max != amount.quantity else None

        annotations = AmountPosition(
            amount_position.substring, amount_position.start)
        qty_pos, max_qty_pos = annotations.get_quantity_position(
            amount.quantity, max_qty)
        unit_pos = annotations.get_unit_position(amount.unit)

        # Convert to response object
        return ParsedIngredientAmount(
            quantity=QuantityAnnotation(
                value=amount.quantity,
                text=qty_pos.substring,
                start=qty_pos.start,
                end=qty_pos.end,
            ),
            max_quantity=None
            if max_qty_pos is None
            else QuantityAnnotation(
                value=amount.quantity_max,
                text=max_qty_pos.substring,
                start=max_qty_pos.start,
                end=max_qty_pos.end,
            ),
            amount_text=Annotation(
                text=amount_position.substring, start=amount_position.start, end=amount_position.end
            ),
            unit=None
            if unit_pos is None
            else Annotation(text=unit_pos.substring, start=unit_pos.start, end=unit_pos.end),
        )

    def __get_ingredient_annotation(
        self, parsing: ParsedIngredient, mapping: TokenMapping
    ) -> IngredientAnnotation:
        if not (hasattr(parsing.name, "text")) or parsing.name.text == "":
            return None

        # Only expect to find one match
        pos = mapping.get_position(
            parsing.name.starting_index, parsing.name.text
        )

        return IngredientAnnotation(
            text=pos.substring,
            start=pos.start,
            end=pos.end,
            singular_ingredient=self.inflect.depluralize(pos.substring),
        )

    def clean_text(self, text):
        patterns = [
            r'^\s*[-•●■◆○●∙⦿⭐★☆▢]\s+',  # Bullet points
            # Checkboxes with various check marks
            r'^\s*[\[\(]?[xX✓✔️☑️]\s*[\]\)]?\s*',
            r'^\s*[\[\(]?\s*[\]\)]?\s*',  # Empty checkboxes
            r'^\s*[-_=]{2,}\s*$'   # Horizontal lines
        ]

        # Combine all patterns
        combined_pattern = '|'.join(patterns)

        # Process text line by line
        cleaned_lines = []
        for line in text.split('\n'):
            # Remove markers from start of line
            cleaned_line = re.sub(combined_pattern, '',
                                  line, flags=re.MULTILINE)
            cleaned_lines.append(cleaned_line.strip())

        # Rejoin lines and remove extra whitespace
        cleaned_text = '\n'.join(cleaned_lines)
        cleaned_text = re.sub(r'\n\s*\n', '\n\n', cleaned_text)

        return cleaned_text.strip()

    def parse(
        self, ingredient_lines: List[str]
    ) -> List[ParsedIngredientResponse]:
        parsed_ingredients = []
        for line_parsing in ingredient_lines:
            result = None
            try:
                cleaned_sentence = self.clean_text(line_parsing)
                if cleaned_sentence:
                    # Parse/tag the ingredient line
                    parsing = inspect_parser(
                        cleaned_sentence, string_units=True)

                    parsed_ingredient = parsing.PostProcessor.parsed

                    # Undo sentence normalizations
                    ingredient_line_sentence = SentenceDenormalizer.undo_normalisation(
                        parsing)

                    mapping = TokenMapping(
                        ingredient_line_sentence.sentence,
                        ingredient_line_sentence.tokens
                    )

                    # Get all the parts of the parsing
                    sentence = mapping.sentence

                    ingredient_name = self.__get_ingredient_annotation(
                        parsed_ingredient, mapping
                    )

                    amounts = self.__get_amount_annotations(
                        parsed_ingredient, mapping)

                    result = ParsedIngredient(
                        ingredient=ingredient_name, amounts=amounts, sentence=sentence)

            except Exception as e:
                logger.warning(f"{line_parsing} could not be parsed: {e}")
            finally:
                # Add Ingredient line to list
                parsed_ingredients.append(
                    ParsedIngredientResponse(
                        parsed_ingredient=result,
                        original_sentence=line_parsing
                    )
                )
                result = None

        return parsed_ingredients
