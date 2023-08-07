from fastapi import FastAPI
from ingredient_parser import parse_ingredient
from pydantic import BaseModel

app = FastAPI()

class MultipleIngredients(BaseModel):
    ingredients: list[str]
    confidence: bool = False


@app.get("/parse")
def parse(ingredient:str, results:bool = False):
    parsed_ingredient = parse_ingredient(ingredient, confidence=results)
    return parsed_ingredient

@app.post("/parse")
async def parse_batch(requestBody: MultipleIngredients):
    parsed_ingredients = []
    for ingredient in requestBody.ingredients:
        parsed_ingredients.append(parse_ingredient(ingredient, confidence=requestBody.confidence))
    return parsed_ingredients