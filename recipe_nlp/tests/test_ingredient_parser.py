from IngredientParser import IngredientParser

input_tests = [
    "1 tbsp plus 1 tsp arrowroot powder (or flour of choice)",
    "2 large chicken breasts (about 1 \u00bd pounds)",
    "Marinade",
    "\u00bd teaspoon kosher salt",
    "2 tablespoons extra virgin olive oil",
    "2 tablespoons unsalted butter",
    "2 garlic cloves (minced)",
    "3 tablespoons lemon juice (from 1 lemon)",
    "\u00bc cup low-sodium chicken broth",
    "1 teaspoon lemon zest",
    "optional: garnish with freshly chopped parsley and lemon slices",
]


# base_ingredient: result.name.text, get det depluralized version
# {
#   "name": "chicken breast",
#   "text": "large",
#   "startIndex": 2,
#   "endIndex": "3",
# }
# base_quantity: the first number in the sentence {
#  "quantity": 2,
#  "maxQuantity": 4,
#  "startIndex": "3",
#  "endIndex": "4",
# }
# base_unit: the first unit in the sentence
# {
#     "unit": "tbsp",
#     "startIndex": 2,
#     "endIndex": 3,
# }
# original_sentence: result.sentence
# additional: {
#     unit: {
#        "unit": "tbsp",
#        "startIndex": 2,
#        "endIndex": 3,}
#     quantity: {
#       "quantity": 2,
#       "maxQuantity": 4,
#       "startIndex": "3",
#       "endIndex": "4",
# }
# }


def test_ingredient_parser():
    parser = IngredientParser()
    result = parser.parse(input_tests)
    assert "hello" + " world" == "hello world"
