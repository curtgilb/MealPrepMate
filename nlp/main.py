from fastapi import FastAPI
from pydantic import BaseModel


from parser.IngredientParser import IngredientParser
from services.RecipeScraper import RecipeScraper
from dto.IngredientResponse import ParsedIngredientsResponse
from dto.RecipeResponse import ScrapedRecipeResponse


app = FastAPI()

parser = IngredientParser()
scraper = RecipeScraper()


class MultipleIngredients(BaseModel):
    ingredients: list[str]


class RecipeScraperBody(BaseModel):
    url: str


@app.post("/scrape", response_model=ScrapedRecipeResponse)
async def scrape_recipe(requestBody: RecipeScraperBody):
    return ScrapedRecipeResponse(scraped_recipe=scraper.scrape(requestBody.url))


@app.post("/parse", response_model=ParsedIngredientsResponse)
async def parse_ingredient(requestBody: MultipleIngredients):
    return ParsedIngredientsResponse(ingredients=parser.parse(requestBody.ingredients))
