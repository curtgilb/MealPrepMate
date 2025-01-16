import unittest
from lib.NumberConverter import NumberConverter


class TestNumberConverter(unittest.TestCase):
    def setUp(self):
        self.converter = NumberConverter()

    def test_replace_fractions_with_decimals(self):
        self.assertEqual(
            self.converter.replace_fractions_with_decimals("1/2 cup"), "0.5 cup"
        )
        self.assertEqual(
            self.converter.replace_fractions_with_decimals("1 1/2 cups"), "1.5 cups"
        )
        self.assertEqual(
            self.converter.replace_fractions_with_decimals("3/4 teaspoon"),
            "0.75 teaspoon",
        )

    def test_replace_tokenized_fractions(self):
        self.assertEqual(
            self.converter.replace_tokenized_fractions("1#1$2 cup"), "1.5 cup"
        )
        self.assertEqual(
            self.converter.replace_tokenized_fractions("2#3$4 cups"), "2.75 cups"
        )

    def test_numbers_are_equal(self):
        self.assertTrue(self.converter.numbers_are_equal(1.0, 1.0))
        self.assertTrue(self.converter.numbers_are_equal(1.0, 1.015))
        self.assertFalse(self.converter.numbers_are_equal(1.0, 1.02))
        self.assertFalse(self.converter.numbers_are_equal(0, 1.0))

    def test_cast_to_float(self):
        self.assertEqual(self.converter.cast_to_float("1 1/2"), 1.5)
        self.assertEqual(self.converter.cast_to_float("3/4"), 0.75)
        self.assertEqual(self.converter.cast_to_float("2.5"), 2.5)
        self.assertEqual(self.converter.cast_to_float("  2.5  "), 2.5)
