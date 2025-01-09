from abc import ABC
from typing import Optional


from pydantic import BaseModel


class Annotation(BaseModel, ABC):
    text: Optional[str]
    start: Optional[int]
    end: Optional[int]


class IngredientAnnotation(Annotation):
    name: Optional[str]


class QuantityAnnotation(Annotation):
    quantity: float
    max_quantity: Optional[float]


class UnitAnnotation(Annotation):
    unit: Optional[str]
