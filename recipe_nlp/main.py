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

def extractQty(output):

    if len(output.amount) > 0:
        qty = output.amount[0]


        if (qty.__class__.__name__ == "IngredientAmount"):
            return {
                "qty":  convertToFloat(qty.quantity),
                "maxQty": convertToFloat(qty.quantity_max),
                "unit": qty.unit
            }
        elif (qty.__class__.__name__ == "CompositeIngredientAmount"):
            return {
                "qty": convertToFloat(qty.amounts[0].quantity),
                "maxQty": convertToFloat(qty.amounts[0].quantity_max),
                "unit": qty.amounts[0].unit
            }

    return None


@app.post("/scrape")
async def scrape_recipe(requestBody: RecipeScraperBody):
    scraper = scrape_html(html=None, org_url=requestBody.url, online=True)
    return scraper.to_json()

@app.post("/parse")
async def parse_batch(requestBody: MultipleIngredients):
    parsed_ingredients = []
    try:
        for ingredient in requestBody.ingredients:
            result = parse_ingredient(ingredient, string_units=True)
            amount = extractQty(result)

            transformedOutput = {}
            transformedOutput["name"] = None if not hasattr(result.name, "text") else result.name.text
            transformedOutput["sentence"] = result.sentence
            transformedOutput["comment"] = None if not hasattr(result.comment, "text") else result.comment.text
            transformedOutput["preparation"] = None if not hasattr(result.preparation, "text") else result.preparation.text
            transformedOutput["quantity"] = amount['qty'] if amount else None
            transformedOutput["quantityMax"] = amount['maxQty'] if amount else None
            transformedOutput["unit"] = amount["unit"] if amount else None
            parsed_ingredients.append(transformedOutput)
    except Exception as e:
        print(ingredient)
        print(result)
        print(e) 
    return parsed_ingredients
