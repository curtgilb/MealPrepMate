from recipe_scrapers import scrape_html
from recipe_scrapers._exceptions import WebsiteNotImplementedError


class RecipeScraper:
    def scrape(self, url):
        try:
            scraper = scrape_html(html=None, org_url=url, online=True)
            return scraper.to_json()
        except WebsiteNotImplementedError:
            print(f"{url} does not have a scraper.")
        return None
