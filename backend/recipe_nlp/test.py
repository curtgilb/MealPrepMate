from recipe_scrapers import scrape_me    
scraper = scrape_me('https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/')

# Q: What if the recipe site I want to extract information from is not listed below?
# A: You can give it a try with the wild_mode option! If there is Schema/Recipe available it will work just fine.
# scraper = scrape_me('https://www.feastingathome.com/tomato-risotto/', wild_mode=True)

# print(scraper.host())
# print(scraper.title())
# print(scraper.total_time())
# print(scraper.image())
# print(scraper.ingredients())
# print(scraper.ingredient_groups())
# print(scraper.instructions())
# print(scraper.instructions_list())
# print(scraper.yields())
print(scraper.to_json())
# print(scraper.links())
# print(scraper.nutrients())