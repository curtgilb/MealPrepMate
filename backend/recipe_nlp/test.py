from ingredient_parser import parse_ingredient
from recipe_scrapers import scrape_me

def convertToFloat(string):
    try:
        return float(string)
    except ValueError:
        return string

parsed_ingredients = []
for ingredient in ["fresh lemon for garnish"]:
    result = parse_ingredient(ingredient)
    transformedOutput = {}
    transformedOutput["sentence"] = "hello",
    transformedOutput["name"] = result.name.text
    transformedOutput["comment"] = result.comment
    transformedOutput["other"] = result.other
    transformedOutput["preparation"] = result.preparation
    transformedOutput["quantity"] = None if len(result.amount) == 0 else convertToFloat(result.amount[0].quantity)
    transformedOutput["unit"] = None if len(result.amount) == 0 else result.amount[0].unit
    parsed_ingredients.append(transformedOutput)
print(parsed_ingredients)
