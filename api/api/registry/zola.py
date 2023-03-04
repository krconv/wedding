import decimal
import typing

import fastapi
import httpx

from .. import utils
from . import schemas


class ZolaClient(utils.zola.ZolaClientBase):
    async def fetch_registry(self) -> schemas.Registry:
        data = await self._fetch_registry_data()

        return self._map_registry_data(data)

    async def _fetch_registry_data(self) -> dict[str, typing.Any]:
        response = await self._client.post(
            "https://www.zola.com/web-registry-api/v1/registryCollection/search",
            json={"registry_key": "maddyandkodey", "flattened_view": True},
        )
        if response.status_code != fastapi.status.HTTP_200_OK:
            raise Exception("Error while fetching from Zola: " + response.text)
        return response.json()

    def _map_registry_data(self, data: dict) -> schemas.Registry:
        return schemas.Registry(
            full_link="https://www.zola.com/registry/maddyandkodey",
            items=self._map_items(data["default_collection"]),
        )

    def _map_items(self, data: list[dict]) -> list[schemas.RegistryItem]:
        return [self._map_item(item_data) for item_data in data]

    def _map_item(self, data: dict) -> schemas.RegistryItem:
        return schemas.RegistryItem(
            id=data["object_id"],
            title=data["name"],
            brand=data["brand"]["name"] if "brand" in data else None,
            price=decimal.Decimal(data["price"])
            if not data["contributions"]["hide_contributions"]
            else None,
            image_link=data["images"][0]["medium"],
        )
