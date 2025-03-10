import pytest
import json
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


@pytest.fixture(scope="class")
def mixed_fractions_data():
    with open('./tests/test_cases/mixed_fractions.json', 'r') as file:
        return json.load(file)


@pytest.fixture(scope="class")
def client():
    return TestClient(app)


class TestIngredientParser:
    def test_parse_null_or_empty_string(self, client):
        response = client.post(
            "/parse", json={"ingredients": [""]}
        )
        assert response.status_code == 200
        assert (
            response.json() == {"ingredients": []}
        ), "Null and empty string should not be included in parsing result"

    def test_mixed_fractions_and_decimals(self, client, mixed_fractions_data):
        for test in mixed_fractions_data["tests"]:
            response = client.post(
                "/parse", json={"ingredients": [test]}
            )
            assert response.status_code == 200
            assert (response.json() ==
                    mixed_fractions_data["output"]), f"Failed: ${test}"

    def test_composite_amounts(self, client):

        response = client.post(
            "/parse", json={"ingredients": ["1 Tbsp. plus ½ tsp. honey"]}
        )
        assert response.status_code == 200
        result = response.json()
        print(result)
