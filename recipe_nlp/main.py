from fastapi import FastAPI
from pydantic import BaseModel


from services.IngredientParser import IngredientParser
from services.RecipeScraper import RecipeScraper


app = FastAPI()

parser = IngredientParser()
scraper = RecipeScraper()


class MultipleIngredients(BaseModel):
    ingredients: list[str]


class RecipeScraperBody(BaseModel):
    url: str


@app.post("/scrape")
async def scrape_recipe(requestBody: RecipeScraperBody):
    return scraper.scrape(requestBody.url)


@app.post("/parse")
async def parse_batch(requestBody: MultipleIngredients):
    return parser.parse(requestBody.ingredients)
