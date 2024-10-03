from fastapi import FastAPI
from ingredient_parser import parse_ingredient
from pydantic import BaseModel
from recipe_scrapers import scrape_html


app = FastAPI()

class MultipleIngredients(BaseModel):
    ingredients: list[str]
    confidence: bool = False

class RecipeScraperBody(BaseModel):
    url: str

def convertToFloat(string):
    try:
        return float(string)
    except ValueError:
        return string

@app.post("/scrape")
async def scrape_recipe(requestBody: RecipeScraperBody):
    scraper = scrape_html(html=None, org_url=requestBody.url, online=True)
    return scraper.to_json()

@app.post("/parse")
async def parse_batch(requestBody: MultipleIngredients):
    parsed_ingredients = []
    for ingredient in requestBody.ingredients:
        result = parse_ingredient(ingredient, string_units=True)
        transformedOutput = {}
        transformedOutput["name"] = None if not hasattr(result.name, "text") else result.name.text
        transformedOutput["sentence"] = result.sentence
        transformedOutput["comment"] = None if not hasattr(result.comment, "text") else result.comment.text
        transformedOutput["preparation"] = None if not hasattr(result.preparation, "text") else result.preparation.text
        transformedOutput["quantity"] = None if len(result.amount) == 0 else convertToFloat(result.amount[0].quantity)
        transformedOutput["quantityMax"] = None if len(result.amount) == 0 else convertToFloat(result.amount[0].quantity_max)
        transformedOutput["unit"] = None if len(result.amount) == 0 else result.amount[0].unit
        parsed_ingredients.append(transformedOutput)
    return parsed_ingredients
