# Initialize project
poetry init

# Installing dependnecies
poetry add ...
poetry add --dev ...

# Exporting requirements
Prod
poetry export --without-hashes --format=requirements.txt > requirements.txt
Dev
poetry export -f requirements.txt --output requirements-dev.txt --dev --without-hashes

# Virtual env
poetry env list

# Starting the server
fastapi dev main.py
fastapi run main.py
