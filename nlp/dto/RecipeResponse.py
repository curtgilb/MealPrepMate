from typing import Union, List, Optional

from pydantic import BaseModel


class IngredientGroup(BaseModel):
    ingredients: List[str] = None
    purpose: Optional[str] = None


class Nutrients(BaseModel):
    calories: Optional[str] = None
    carbohydrateContent: Optional[str] = None
    proteinContent: Optional[str] = None
    fatContent: Optional[str] = None
    saturatedFatContent: Optional[str] = None
    transFatContent: Optional[str] = None
    cholesterolContent: Optional[str] = None
    sodiumContent: Optional[str] = None
    fiberContent: Optional[str] = None
    sugarContent: Optional[str] = None
    unsaturatedFatContent: Optional[str] = None
    servingSize: Optional[str] = None


class ScrapedRecipe(BaseModel):
    author: str = None
    canonical_url: str = None
    category: str = None
    equipment: Optional[List[str]] = None
    host: str = None
    image: str = None
    ingredient_groups: Optional[List[IngredientGroup]] = None
    ingredients: List[str] = None
    instructions: Optional[str] = None
    instructions_list: list[str] = None
    language: str = None
    nutrients: Nutrients = None
    ratings: float = None
    site_name: str = None
    title: str = None
    total_time: float = None
    yields: str = None


class ScrapedRecipeResponse(BaseModel):
    scraped_recipe: Optional[ScrapedRecipe]
