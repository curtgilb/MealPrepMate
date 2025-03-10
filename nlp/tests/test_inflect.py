import pytest
from lib.Inflect import Inflect


@pytest.fixture(scope="class")
def inflect():
    return Inflect()


class TestInflict:

    @pytest.mark.parametrize("input_string,expected", [
        ("fillets", "fillets"),
        ("honey", "honeys"),
        ("chicken piece", "chicken pieces"),
    ])
    def test_pluralize(self, inflect, input_string, expected):
        assert inflect.pluralize(input_string) == expected

    @pytest.mark.parametrize("input_string,expected", [
        ("cats", "cat"),
        ("dog", "dog"),
        ("children", "child"),
    ])
    def test_depluralize(self, inflect, input_string, expected):
        assert inflect.depluralize(input_string) == expected
