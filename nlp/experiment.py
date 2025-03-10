from ingredient_parser import inspect_parser
from lib.SentenceDenormalizer import SentenceDenormalizer
from lib.TokenMapping import TokenMapping
from parser.IngredientParser import IngredientParser

parser = IngredientParser()

result = parser.parse(["½ cup tapioca flour"])

print(result)
