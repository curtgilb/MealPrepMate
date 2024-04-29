from ingredient_parser import parse_ingredient

def convertToFloat(string):
    try:
        return float(string)
    except ValueError:
        return string

result = parse_ingredient("1 - 2 pounds asparagus (woody ends trimmed)", string_units=True)
transformedOutput = {}
transformedOutput["name"] = None if not hasattr(result.name, "text") else result.name.text
transformedOutput["sentence"] = result.sentence
transformedOutput["comment"] = None if not hasattr(result.comment, "text") else result.comment.text
transformedOutput["preparation"] = None if not hasattr(result.preparation, "text") else result.preparation.text
transformedOutput["quantity"] = None if len(result.amount) == 0 else convertToFloat(result.amount[0].quantity)
transformedOutput["quantityMax"] = None if len(result.amount) == 0 else convertToFloat(result.amount[0].quantity_max)
transformedOutput["unit"] = None if len(result.amount) == 0 else result.amount[0].unit
print(result)