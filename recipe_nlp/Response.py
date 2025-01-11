from annotations import Annotation, IngredientAnnotation, QuantityAnnotation
from typing import List, Union

from pydantic import BaseModel


class IngredientAmount(BaseModel):
    quantity: QuantityAnnotation
    maxQuantity: QuantityAnnotation
    amount_text: Annotation
    unit: Annotation


class CompositeIngredientAmount(BaseModel):
    quantities: QuantityAnnotation
    amount_text: Annotation


class ParsedIngredientResult(BaseModel):
    ingredient: IngredientAnnotation
    amounts: List[Union[IngredientAmount, CompositeIngredientAmount]]
    sentence: str
