from annotations import IngredientAnnotation, QuantityAnnotation, UnitAnnotation
from typing import List, Union

from pydantic import BaseModel


class IngredientAmount(BaseModel):
    quantity: QuantityAnnotation
    unit: UnitAnnotation


class ParsedIngredientResult(BaseModel):
    ingredient: IngredientAnnotation
    amount: Union[IngredientAmount, List[IngredientAmount]]
    original_sentence: str
    additional: List[Union[IngredientAmount, List[IngredientAmount]]]
