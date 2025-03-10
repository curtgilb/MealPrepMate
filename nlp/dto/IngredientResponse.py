from dto.Annotations import Annotation, IngredientAnnotation, QuantityAnnotation
from typing import Union, List, Optional

from pydantic import BaseModel


class IngredientAmount(BaseModel):
    quantity: QuantityAnnotation
    max_quantity: Optional[QuantityAnnotation]
    amount_text: Annotation
    unit: Optional[Annotation]


class CompositeIngredientAmount(BaseModel):
    quantities: List[IngredientAmount]
    amount_text: Annotation


class ParsedIngredient(BaseModel):
    ingredient: IngredientAnnotation
    amounts: List[Union[IngredientAmount, CompositeIngredientAmount]]
    sentence: str


class ParsedIngredientResponse(BaseModel):
    parsed_ingredient: Optional[ParsedIngredient]
    original_sentence: Optional[str]


class ParsedIngredientsResponse(BaseModel):
    ingredients: List[ParsedIngredientResponse]
