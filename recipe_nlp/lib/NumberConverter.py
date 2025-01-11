import re
from fractions import Fraction


class NumberConverter:
    def __init__(self):
        self.any_number_pattern = re.compile(r"\d+\s+\d+/\d+|\d+/\d+|\d*\.?\d+")
        self.fraction_pattern = re.compile(r"\d+\s+\d+/\d+|\d+/\d+")
        self.tokeized_fraction_pattern = re.compile(r"\d*#\d+\$\d+")

    def replace_fractions_with_decimals(self, text: str):
        return self.fraction_pattern.sub(
            lambda m: str(self.cast_to_float(m.group(0))),
            text,
        )

    def replace_tokenized_fractions(self, text: str):
        return self.tokeized_fraction_pattern.sub(
            lambda m: str(
                self.cast_to_float(m.group(0).replace("#", " ").replace("$", "/"))
            ),
            text,
        )

    def numbers_are_equal(self, from_text: float, from_nlp: float):
        percent_tolerance = 1.5

        if from_text == from_nlp:  # Handle exact equality including both being zero
            return True

        if from_text == 0 or from_nlp == 0:  # Handle when one value is zero
            return False  # Can't calculate percentage difference with zero

        # Calculate percentage difference relative to the larger value
        larger = max(abs(from_text), abs(from_nlp))
        diff_percentage = abs(from_text - from_nlp) / larger * 100

        return diff_percentage <= percent_tolerance

    def cast_to_float(self, number_str: str):
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
