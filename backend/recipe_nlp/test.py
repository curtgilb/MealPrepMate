from recipe_scrapers import scrape_me
import json

scraper = scrape_me('https://downshiftology.com/recipes/lemon-pepper-chicken/')
result = scraper.to_json()

with open('data.json', 'w') as f:
    json.dump(result, f)
