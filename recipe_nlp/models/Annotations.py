from typing import Optional


from pydantic import BaseModel


class Annotation(BaseModel):
    text: Optional[str]
    start: Optional[int]
    end: Optional[int]


class IngredientAnnotation(Annotation):
    singular_ingredient: Optional[str]


class QuantityAnnotation(Annotation):
    value: float
