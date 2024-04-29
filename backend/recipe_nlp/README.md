Creating a virtual environment
pip(3) install virtualenv
python(3) -m venv env

Activate
source env/bin/activate (Mac)
env/Scripts/Activate.ps1 (Windows)

pip freeze > requirements.txt
To Update
pip freeze --local | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 pip install -U

python -m pip install ingredient_parser_nlp
pip install fastapi
pip install recipe-scrapers
$ pip install uvicorn

UPDATE
pip install --upgrade "uvicorn[standard]"
pip install --upgrade fastapi
pip install --upgrade recipe_scrapers
pip install --upgrade ingredient_parser_nlp
pip freeze > requirements.txt

uvicorn main:app --reload
