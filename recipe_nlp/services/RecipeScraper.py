from recipe_scrapers import scrape_html


class RecipeScraper:
    def scrape(self, url):
        scraper = scrape_html(html=None, org_url=url, online=True)
        return scraper.to_json()
