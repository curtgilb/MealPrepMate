from ingredient_parser import parse_ingredient
from recipe_scrapers import scrape_me

def convertToFloat(string):
    try:
        return float(string)
    except ValueError:
        return string

parsed_ingredients = []
for ingredient in ["1-2 tbsp of milk"]:
    result = parse_ingredient(ingredient)
    transformedOutput = {}
    transformedOutput["sentence"] = "hello",
    transformedOutput["name"] = result.name.text
    transformedOutput["comment"] = result.comment
    transformedOutput["other"] = result.other
    transformedOutput["preparation"] = result.preparation
    transformedOutput["quantity"] = convertToFloat(result.amount[0].quantity)
    transformedOutput["unit"] = result.amount[0].unit
    parsed_ingredients.append(transformedOutput)
print(parsed_ingredients)
