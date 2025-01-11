from ingredient_parser import parse_multiple_ingredients
from ingredient_parser.dataclasses import (
    CompositeIngredientAmount,
    IngredientAmount,
    ParsedIngredient,
)

from lib import NumberConverter
from lib.Inflect import Inflect
import models.Response as Response
from models.Annotations import (
    Annotation,
    IngredientAnnotation,
    QuantityAnnotation,
)
from typing import Union, List

from lib.SentenceAnnotator import QuantityInput, SentenceAnnotator


class IngredientParser:
    def __init__(self):
        self.inflect = Inflect()
        self.numbers = NumberConverter()

    def __get_amount_annotations(
        self,
        parsing: List[Union[IngredientAmount, CompositeIngredientAmount]],
        pos_cache: SentenceAnnotator,
    ) -> List[Union[Response.IngredientAmount, Response.CompositeIngredientAmount]]:
        amount_annotations = []
        for parsed_amount in parsing.amount:
            if isinstance(parsed_amount, CompositeIngredientAmount):
                text_pos = pos_cache.get_ingredient_position(
                    parsed_amount.starting_index, parsed_amount.text
                )
                sub_amounts = []
                for sub_amount in parsed_amount.amounts:
                    sub_amounts.append(self.__parse_ingredient_amount(sub_amount))

                amount_annotations.append(
                    Response.CompositeIngredientAmount(
                        quantities=sub_amounts,
                        amount_text=Annotation(
                            text=text_pos.text, start=text_pos.start, end=text_pos.end
                        ),
                    )
                )
            elif isinstance(parsed_amount, IngredientAmount):
                amount_annotations.append(
                    self.__parse_ingredient_amount(parsed_amount, pos_cache)
                )

        return amount_annotations

    def __parse_ingredient_amount(
        self, amount: IngredientAmount, pos_cache: SentenceAnnotator
    ) -> Response.IngredientAmount:
        quantities = QuantityInput(
            quantity=amount.quantity,
            maxQuantity=None
            if amount.quantity == amount.quantity_max
            else amount.quantity_max,
        )

        pos = pos_cache.get_amount_position(
            amount.starting_index, amount.text, amount.unit, quantities=quantities
        )
        # Convert to response object
        return Response.IngredientAmount(
            quantity=QuantityAnnotation(
                value=quantities.quantity,
                text=pos.quantity.text,
                start=pos.quantity.start,
                end=pos.quantity.end,
            ),
            max_quantity=None
            if quantities.maxQuantity is None
            else QuantityAnnotation(
                value=quantities.maxQuantity,
                text=pos.maxQuantity.text,
                start=pos.maxQuantity.start,
                end=pos.maxQuantity.end,
            ),
            amount_text=Annotation(
                text=pos.amount.text, start=pos.amount.start, end=pos.amount.end
            ),
            unit=None
            if pos.unit is None
            else Annotation(text=pos.unit.text, start=pos.unit.start, end=pos.unit.end),
        )

    def __get_ingredient_annotation(
        self, result: ParsedIngredient, annotations: SentenceAnnotator
    ) -> IngredientAnnotation:
        if not (hasattr(result.name, "text")) or result.name.text == "":
            return None

        # Only expect to find one match
        pos = annotations.get_ingredient_position(
            result.name.starting_index, result.name.text
        )

        return IngredientAnnotation(
            text=pos.text,
            start=pos.start,
            end=pos.end,
            singular_ingredient=self.inflect.depluralize(result.name.text),
        )

    def parse(
        self, ingredient_lines: List[str]
    ) -> List[Response.ParsedIngredientResult]:
        parsed_ingredients = []
        try:
            results = parse_multiple_ingredients(ingredient_lines, string_units=True)
            for line_parsing in results:
                annotations = SentenceAnnotator(
                    line_parsing.sentence, self.inflect, self.numbers
                )
                cleaned_sentence = annotations.sentence
                ingredient_name = self.__get_ingredient_annotation(
                    line_parsing, annotations
                )
                amounts = self.__get_amount_annotations(line_parsing, annotations)

                parsed_ingredients.append(
                    Response.ParsedIngredientResult(
                        ingredient=ingredient_name,
                        amounts=amounts,
                        sentence=cleaned_sentence,
                    )
                )
            return parsed_ingredients
        except Exception as e:
            print(e)
        return parsed_ingredients
