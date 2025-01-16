import pytest
from fastapi.testclient import TestClient

from main import app


# null and empty string
# 1 bay leaf
# 2/3 cup rolled oats
# ¼ teaspoon freshly ground black pepper
# 1 small head cauliflower
# 3 tablespoons finely chopped fresh parsley
# 2 - 3 tbsp fresh lemon or lime juice
# 2 eggs, plus 1 yolk
# 1.5 lb / 750 g chicken thigh fillets ((or breast), cut into 1"/2.5cm pieces)
# 1 Tbsp. plus ½ tsp. honey

# test_sentences = [
#     "2 tablespoons cumin",
#     "1 to 2 tablespoons cumin",
#     "0.5 tablespoon cumin",
#     "\u00bd tablespoon cumin",
#     "1 1/2 tablespoon cumin",
#     "1\u00bd tablespoon cumin",
#     "1.5 tablespoon cumin",
# ]


@pytest.fixture(scope="class")
def client():
    return TestClient(app)


class TestIngredientParser:
    def test_parse_null_or_empty_string(self, client):
        response = client.post(
            "/parse", json={"ingredients": ["1 cup sugar", "2 eggs"]}
        )
        assert response.status_code == 200
        assert (
            response.json() == []
        ), "Null and empty string should not be included in parsing result"

    def test_parse_unitless_amount(self, client):
        response = client.post(
            "/parse", json={"ingredients": ["1 bay leaf", "1 small head cauliflower"]}
        )
        expected_result = [
            {
                "ingredient": {
                    "text": "bay leaf",
                    "start": 2,
                    "end": 9,
                    "singular_ingredient": "bay leaf",
                },
                "amounts": [
                    {
                        "quantity": {"text": "1", "value": 1.0, "start": 0, "end": 0},
                        "max_quantity": None,
                        "amount_text": {
                            "text": "1",
                            "start": 0,
                            "end": 0,
                        },
                        "unit": None,
                    }
                ],
                "sentence": "1 bay leaf",
            },
            {
                "ingredient": {
                    "text": "cauliflower",
                    "start": 13,
                    "end": 23,
                    "singular_ingredient": "cauliflower",
                },
                "amounts": [
                    {
                        "quantity": {"text": "1", "value": 1.0, "start": 0, "end": 0},
                        "max_quantity": None,
                        "amount_text": {
                            "text": "1 small head",
                            "start": 0,
                            "end": 11,
                        },
                        "unit": None,
                    }
                ],
                "sentence": "1 small head cauliflower",
            },
        ]
        result = response.json()

        assert response.json() == expected_result


# [
#     {
#         "quantity": {...},
#         "max_quantity": None,
#         "amount_text": {...},
#         "unit": {"text": "small head", "start": 2, "end": 11},
#     }
# ]
