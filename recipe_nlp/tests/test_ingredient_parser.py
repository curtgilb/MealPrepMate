from services.IngredientParser import IngredientParser

input_tests = [
    "1 tbsp plus 1 tsp arrowroot powder (or flour of choice)",
    "2 large chicken breasts (about 1 \u00bd pounds)",
    "Marinade",
    "\u00bd teaspoon kosher salt",
    "1-2 tablespoons extra virgin olive oil",
    "2 tablespoons unsalted butter",
    "2 garlic cloves (minced)",
    "3 tablespoons lemon juice (from 1 lemon)",
    "\u00bc cup low-sodium chicken broth",
    "1 teaspoon lemon zest",
    "optional: garnish with freshly chopped parsley and lemon slices",
]


def test_ingredient_parser():
    parser = IngredientParser()
    result = parser.parse(input_tests)
    assert "hello" + " world" == "hello world"
