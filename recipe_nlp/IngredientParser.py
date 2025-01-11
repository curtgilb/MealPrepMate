from ingredient_parser import parse_multiple_ingredients
from ingredient_parser.dataclasses import (
    CompositeIngredientAmount,
    IngredientAmount,
    ParsedIngredient,
)

from Inflect import Inflect
import Response
from annotations import IngredientAnnotation, QuantityAnnotation, UnitAnnotation
from typing import Union, List

from sentence_annotator import SentenceAnnotator


class IngredientParser:
    def __init__(self):
        self.inflect = Inflect()

    def __get_amount_annotations(
        self,
        parsed_amounts: List[Union[IngredientAmount, CompositeIngredientAmount]],
        pos_cache: SentenceAnnotator,
    ) -> List[Union[Response.IngredientAmount, Response.CompositeIngredientAmount]]:
        ammount_annotations = []
        for parsed_amount in parsed_amounts:
            pass

    def __get_ingredient_annotation(
        self, result: ParsedIngredient, pos_cache: SentenceAnnotator
    ) -> IngredientAnnotation:
        if not (hasattr(result.name, "text")) or result.name.text == "":
            return None

        # Only expect to find one match
        pos = pos_cache.get_ingredient_position(
            result.name.starting_index, result.name.text
        )

        return IngredientAnnotation(
            text=pos.text,
            start=pos.start,
            end=pos.end,
            singular_ingredient=self.inflect.depluralize(result.name.text),
        )

    def parse(self, ingredient_lines: List[str]) -> dict:
        parsed_ingredients = []
        try:
            results = parse_multiple_ingredients(ingredient_lines, string_units=True)
            for line_parsing in results:
                position_cache = SentenceAnnotator(line_parsing.sentence, self.inflect)
                cleaned_sentence = position_cache.sentence
                ingredient_name = self.__get_ingredient_annotation(
                    line_parsing, position_cache
                )
                amounts = self.__get_amount_annotations(line_parsing, position_cache)

        except Exception as e:
            print(e)
        return parsed_ingredients


parser = IngredientParser()
parser.parse(["3 tablespoons lemon juice (from 1 lemon)"])
