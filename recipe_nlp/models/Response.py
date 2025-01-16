from models.Annotations import Annotation, IngredientAnnotation, QuantityAnnotation
from typing import List, Optional, Union

from pydantic import BaseModel


class IngredientAmount(BaseModel):
    quantity: QuantityAnnotation
    max_quantity: Optional[QuantityAnnotation]
    amount_text: Annotation
    unit: Optional[Annotation]


class CompositeIngredientAmount(BaseModel):
    quantities: List[IngredientAmount]
    amount_text: Annotation


class ParsedIngredientResult(BaseModel):
    ingredient: IngredientAnnotation
    amounts: List[Union[IngredientAmount, CompositeIngredientAmount]]
    sentence: str
