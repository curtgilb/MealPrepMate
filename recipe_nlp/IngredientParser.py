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

    def __extract_qty(self, output):
        if len(output.amount) > 0:
            qty = output.amount[0]

            if qty.__class__.__name__ == "IngredientAmount":
                return {
                    "qty": self.__convert_to_float(qty.quantity),
                    "maxQty": self.__convert_to_float(qty.quantity_max),
                    "unit": qty.unit,
                }
            elif qty.__class__.__name__ == "CompositeIngredientAmount":
                return {
                    "qty": self.__convert_to_float(qty.amounts[0].quantity),
                    "maxQty": self.__convert_to_float(qty.amounts[0].quantity_max),
                    "unit": qty.amounts[0].unit,
                }

        return None

    def __get_ingredient_annotation(self, result) -> IngredientAnnotation:
        text = None if not hasattr(result.name, "text") else result.name.text
        text_len = len(text) if text else 0

        return IngredientAnnotation(
            text=text,
            start=None if not text else result.name.startIndex,
            end=None if not text else result.name.startIndex + text_len,
            name=None if not text else self.p.singular_noun(result.name.text),
        )

    def __get_ingredient_amount_annotations(self, result) -> IngredientAmount:
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
            print(ingredient)
            print(result)
            print(e)
        return parsed_ingredients
