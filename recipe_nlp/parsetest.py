from ingredient_parser import parse_ingredient


def extractQty(output):

    if len(result.amount) > 0:
        qty = result.amount[0]


        if (qty.__class__.__name__ == "IngredientAmount"):
            return {
                "qty":  convertToFloat(qty.quantity),
                "maxQty": convertToFloat(qty.quantity_max),
                "unit": qty.unit
            }
        elif (qty.__class__.__name__ == "CompositeIngredientAmount"):
            return {
                "qty": convertToFloat(qty.amounts[0].quantity),
                "maxQty": convertToFloat(qty.amounts[0].quantity_max),
                "unit": qty.amounts[0].unit
            }

    return None



def convertToFloat(string):
    try:
        return float(string)
    except ValueError:
        return string

result = parse_ingredient("1/3 cup plus 2 tablespoons extra-virgin olive oil", string_units=True)
transformedOutput = {}
amount = extractQty(result)

transformedOutput["name"] = None if not hasattr(result.name, "text") else result.name.text
transformedOutput["sentence"] = result.sentence
transformedOutput["comment"] = None if not hasattr(result.comment, "text") else result.comment.text
transformedOutput["preparation"] = None if not hasattr(result.preparation, "text") else result.preparation.text
transformedOutput["quantity"] = amount['qty'] if amount else None
transformedOutput["quantityMax"] = amount['maxQty'] if amount else None
transformedOutput["unit"] = amount["unit"] if amount else None
print(result)


# result.amount (array of objects) amounts (array) has quantity and quanity max