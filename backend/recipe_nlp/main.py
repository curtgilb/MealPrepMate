from fastapi import FastAPI
from ingredient_parser import parse_ingredient
from pydantic import BaseModel
from recipe_scrapers import scrape_me


app = FastAPI()

class MultipleIngredients(BaseModel):
    ingredients: list[str]
    confidence: bool = False

def convertToFloat(string):
    try:
        return float(string)
    except ValueError:
        return string


@app.post("/parse")
async def parse_batch(requestBody: MultipleIngredients):
    parsed_ingredients = []
    for ingredient in requestBody.ingredients:
        print(ingredient)
        result = parse_ingredient(ingredient)
        transformedOutput = {}
        transformedOutput["sentence"] = ingredient
        transformedOutput["name"] = None if not hasattr(result.name, "text") else result.name.text
        transformedOutput["comment"] = None if not hasattr(result.comment, "text") else result.comment.text
        transformedOutput["other"] = result.other
        transformedOutput["preparation"] = result.preparation
        transformedOutput["quantity"] = convertToFloat(result.amount[0].quantity)
        transformedOutput["unit"] = result.amount[0].unit
        parsed_ingredients.append(transformedOutput)
    return parsed_ingredients
