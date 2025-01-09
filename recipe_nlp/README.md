Creating a virtual environment
pip(3) install virtualenv
python(3) -m venv env

Activate
source env/bin/activate (Mac)
env/Scripts/Activate.ps1 (Windows)

pip freeze --local > requirements.txt

pip install ingredient_parser_nlp
pip install "fastapi[standard]"
pip install recipe-scrapers
pip install inflect 
pip install pytest

pip install -r ./requirements.txt

<!-- pip install uvicorn -->

UPDATE
pip install --upgrade "uvicorn[standard]"
pip install --upgrade fastapi
pip install --upgrade recipe_scrapers
pip install --upgrade ingredient_parser_nlp
pip freeze --local > requirements.txt

uvicorn main:app --reload




IngredientAmount(
    quantity=2.0, 
    quantity_max=2.0, 
    unit='', 
    text='2', 
    confidence=0.999944, 
    starting_index=0, 
    APPROXIMATE=False, 
    SINGULAR=False, 
    RANGE=False, 
    MULTIPLIER=False, 
    PREPARED_INGREDIENT=False
     )

CompositeIngredientAmount(
    amounts=[
        IngredientAmount(
            quantity=1.0, 
            quantity_max=1.0, 
            unit='tbsp', 
            text='1 tbsp', 
            confidence=0.997932, 
            starting_index=0, 
            APPROXIMATE=False, 
            SINGULAR=False, 
            RANGE=False, 
            MULTIPLIER=False, 
            PREPARED_INGREDIENT=False),
         IngredientAmount(
            quantity=1.0, 
            quantity_max=1.0, 
            unit='tsp', 
            text='1 tsp', 
            confidence=0.989237, 
            starting_index=3, 
            APPROXIMATE=False, 
            SINGULAR=False, 
            RANGE=False, 
            MULTIPLIER=False, 
            PREPARED_INGREDIENT=False
            )
        ], 
        join=' plus ', 
        subtractive=False, 
        text='1 tbsp plus 1 tsp', 
        confidence=0.9935845000000001, 
        starting_index=0
        )