import pytest
import json
from lib.SentenceDenormalizer import SentenceDenormalizer, DenormalizedSentence
from ingredient_parser import inspect_parser


@pytest.mark.parametrize("sentence, expected", [
    ("  This  is   a test  ", "This is a test"),
    ("  Another   test   case ", "Another test case")
])
def test_remove_whitespace(sentence, expected):
    result = SentenceDenormalizer._SentenceDenormalizer__remove_whitespace(
        sentence)
    assert result == expected


@pytest.mark.parametrize("sentence, expected", [
    ("3 tbsps honey", DenormalizedSentence(
        sentence="3 tbsps honey", tokens=['3', 'tbsps', 'honey'])),
    ("2 - 3 tbsp fresh lemon or lime juice", DenormalizedSentence(
        sentence='2-3 tbsp fresh lemon or lime juice', tokens=['2-3', 'tbsp', 'fresh', 'lemon', 'or', 'lime', 'juice'])),
    ("1 Tbsp. plus ½ tsp. honey", DenormalizedSentence(
        sentence='1 Tbsp plus 0.5 tsp honey', tokens=['1', 'Tbsp', 'plus', '0.5', 'tsp', 'honey'])),
    ("2/3 cup rolled oats", DenormalizedSentence(
        sentence='0.667 cup rolled oats', tokens=['0.667', 'cup', 'rolled', 'oats'])),
    ("1.5 lb / 750 g chicken thigh fillets ((or breast), cut into 1\"/2.5cm pieces)", DenormalizedSentence(
        sentence='1.5 lb / 750 g chicken thigh fillets ((or breast), cut into 1"/2.5 cm pieces)', tokens=['1.5', 'lb', '/', '750', 'g', 'chicken', 'thigh', 'fillets', '(', '(', 'or', 'breast', ')', ',', 'cut', 'into', '1"', '/', '2.5', 'cm', 'pieces', ')'])),
    ("2 eggs, plus 1 yolk", DenormalizedSentence(
        sentence='2 eggs, plus 1 yolk', tokens=['2', 'eggs', ',', 'plus', '1', 'yolk'])),
])
def test_undo_normalisation(sentence, expected):
    parsing = inspect_parser(sentence)
    result = SentenceDenormalizer.undo_normalisation(parsing)
    assert result == expected
