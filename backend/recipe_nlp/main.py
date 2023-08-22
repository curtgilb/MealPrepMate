from fastapi import FastAPI
from ingredient_parser import parse_ingredient
from pydantic import BaseModel

app = FastAPI()

class MultipleIngredients(BaseModel):
    ingredients: list[str]
    confidence: bool = False

def convertToFloat(string):
    try:
        return float(string)
    except ValueError:
        return string

@app.get("/parse")
def parse(ingredient:str, results:bool = False):
    parsed_ingredient = parse_ingredient(ingredient, confidence=results)
    parsed_ingredient["quantity"] = convertToFloat(parsed_ingredient["quantity"])
    return parsed_ingredient

@app.post("/parse")
async def parse_batch(requestBody: MultipleIngredients):
    parsed_ingredients = []
    for ingredient in requestBody.ingredients:
        result = parse_ingredient(ingredient, confidence=requestBody.confidence)
        result["quantity"] = convertToFloat(result["quantity"])
        parsed_ingredients.append(result)
    return parsed_ingredients