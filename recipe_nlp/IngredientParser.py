from ingredient_parser import parse_multiple_ingredients
import inflect
from Response import IngredientAmount
from annotations import IngredientAnnotation, QuantityAnnotation, UnitAnnotation


class IngredientParser:
    def __init__(self):
        self.p = inflect.engine()

    def __convert_to_float(self, string):
        try:
            return float(string)
        except ValueError:
            return string

    def find_all(self, sentence, substring):
        positions = []
        pos = sentence.find(substring)
        while pos != -1:
            positions.append(pos)
            pos = sentence.find(substring, pos + 1)
        return positions

    def __get_qty(self, parsed_amount):
        if parsed_amount.__class__.__name__ == "IngredientAmount":
            return {
                "qty": self.__convert_to_float(parsed_amount.quantity),
                "maxQty": self.__convert_to_float(parsed_amount.quantity_max),
                "unit": parsed_amount.unit,
            }
        elif parsed_amount.__class__.__name__ == "CompositeIngredientAmount":
            return {
                "qty": self.__convert_to_float(parsed_amount.amounts[0].quantity),
                "maxQty": self.__convert_to_float(
                    parsed_amount.amounts[0].quantity_max
                ),
                "unit": parsed_amount.amounts[0].unit,
            }

        return None

    def __get_amount(self, parsed_amount):
        if parsed_amount.__class__.__name__ == "IngredientAmount":
            return {
                "qty": self.__convert_to_float(parsed_amount.quantity),
                "maxQty": self.__convert_to_float(parsed_amount.quantity_max),
                "unit": parsed_amount.unit,
            }
        elif parsed_amount.__class__.__name__ == "CompositeIngredientAmount":
            return {
                "qty": self.__convert_to_float(parsed_amount.amounts[0].quantity),
                "maxQty": self.__convert_to_float(
                    parsed_amount.amounts[0].quantity_max
                ),
                "unit": parsed_amount.amounts[0].unit,
            }

        return None

    def __get_ingredient_annotation(self, result) -> IngredientAnnotation:
        if not (hasattr(result.name, "text")):
            return None

        self.find_all(result.name.text)

        text = result.name.text
        text_len = len(text) if text else 0

        return IngredientAnnotation(
            text=text,
            start=result.name.starting_index,
            end=result.name.starting_index + text_len,
            name=self.p.singular_noun(result.name.text),
        )

    def __get_ingredient_amount_annotations(self, result) -> IngredientAmount:
        annotations = []
        for amount in result.amount:
            pass

        return IngredientAmount(
            quantity=QuantityAnnotation(
                text=result.quantity.text,
                start=result.quantity.startIndex,
                end=result.quantity.startIndex + len(result.quantity.text),
                quantity=self.__convert_to_float(result.quantity.text),
                max_quantity=self.__convert_to_float(result.quantity.text),
            ),
            unit=UnitAnnotation(
                text=result.unit.text,
                start=result.unit.startIndex,
                end=result.unit.startIndex + len(result.unit.text),
                unit=result.unit.text,
            ),
        )

    def parse(self, ingredient_lines: str) -> dict:
        parsed_ingredients = []
        try:
            results = parse_multiple_ingredients(ingredient_lines, string_units=True)
            for result in results:
                ingredient = self.__get_ingredient_annotation(result)

                amounts = self.__get_ingredient_amount_annotations(result)

                # transformedOutput = {}
                # transformedOutput["name"] = (
                #     None if not hasattr(result.name, "text") else result.name.text
                # )
                # transformedOutput["sentence"] = result.sentence
                # transformedOutput["comment"] = (
                #     None if not hasattr(result.comment, "text") else result.comment.text
                # )
                # transformedOutput["preparation"] = (
                #     None
                #     if not hasattr(result.preparation, "text")
                #     else result.preparation.text
                # )
                # transformedOutput["quantity"] = amount["qty"] if amount else None
                # transformedOutput["quantityMax"] = amount["maxQty"] if amount else None
                # transformedOutput["unit"] = amount["unit"] if amount else None
                # parsed_ingredients.append(transformedOutput)
        except Exception as e:
            print(e)
        return parsed_ingredients
