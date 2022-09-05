import decimal
from . import schemas
import bs4
import aiohttp


class ZolaParser:
    registry_url = "https://widget.zola.com/v1/widget/registry/maddyandkodey/html"

    async def fetch_and_parse_registry(self) -> schemas.Registry:
        soup = await self._fetch_registry_page()

        return self._parse_registry(soup)

    async def _fetch_registry_page(self) -> bs4.BeautifulSoup:
        async with aiohttp.ClientSession() as session:
            async with session.get(self.registry_url) as response:
                if not response.ok:
                    raise Exception(
                        "Error while fetching from Zola: " + await response.text()
                    )
                html = await response.text()
                return bs4.BeautifulSoup(html, "html.parser")

    def _parse_registry(self, soup: bs4.BeautifulSoup) -> schemas.Registry:
        return schemas.Registry(
            full_link=soup.select_one(".zola-logo").attrs["href"],
            items=self._parse_items(soup),
        )

    def _parse_items(self, soup: bs4.BeautifulSoup) -> list[schemas.RegistryItem]:
        return [
            self._parse_item(item_soup) for item_soup in soup.select(".product-tile")
        ]

    def _parse_item(self, soup: bs4.BeautifulSoup) -> schemas.RegistryItem:
        return schemas.RegistryItem(
            id=soup.select_one("a").attrs["href"].split("/")[-1],
            title=soup.select_one("h4").text,
            brand=soup.select_one("h6").text if soup.select_one("h6") else "",
            price=decimal.Decimal(
                soup.select_one(".product-price").text.replace("$", "")
            )
            if soup.select_one(".product-price")
            else None,
            image_link=soup.select_one("img")
            .attrs["src"]
            .replace("https:", "")
            .replace("//", "https://"),
        )
