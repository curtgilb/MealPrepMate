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

<!-- pip install uvicorn -->

UPDATE
pip install --upgrade "uvicorn[standard]"
pip install --upgrade fastapi
pip install --upgrade recipe_scrapers
pip install --upgrade ingredient_parser_nlp
pip freeze --local > requirements.txt

uvicorn main:app --reload
