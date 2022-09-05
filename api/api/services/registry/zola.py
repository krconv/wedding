import decimal
from . import schemas
import aiohttp


class ZolaClient:
    async def fetch_registry(self) -> schemas.Registry:
        data = await self._fetch_registry_data()

        return self._map_registry_data(data)

    async def _fetch_registry_data(self) -> dict:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://www.zola.com/web-registry-api/v1/registryCollection/search",
                json={"registry_key": "maddyandkodey", "flattened_view": True},
            ) as response:
                if not response.ok:
                    raise Exception(
                        "Error while fetching from Zola: " + await response.text()
                    )
                return await response.json()

    def _map_registry_data(self, data: dict) -> schemas.Registry:
        return schemas.Registry(
            full_link="https://www.zola.com/registry/maddyandkodey",
            items=self._map_items(data["default_collection"]),
        )

    def _map_items(self, data: list[dict]) -> list[schemas.RegistryItem]:
        return [self._map_item(item_data) for item_data in data]

    def _map_item(self, data: dict) -> schemas.RegistryItem:
        print(data)
        return schemas.RegistryItem(
            id=data["object_id"],
            title=data["name"],
            brand=data["brand"]["name"] if "brand" in data else None,
            price=decimal.Decimal(data["price"]),
            image_link=data["images"][0]["medium"],
        )
