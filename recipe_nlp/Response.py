from annotations import IngredientAnnotation, QuantityAnnotation, UnitAnnotation
from typing import List

from pydantic import BaseModel


class IngredientAmount(BaseModel):
    quantity: QuantityAnnotation
    unit: UnitAnnotation


class ParsedIngredientResult(BaseModel):
    ingredient: IngredientAnnotation
    amount: IngredientAmount
    original_sentence: str
    additional: List[IngredientAmount]
