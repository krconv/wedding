import decimal
import typing

import fastapi
import httpx

from .. import utils
from . import schemas


class DropeventClient:
    def __init__(self, client: httpx.AsyncClient | None = None):
        self._client = client or httpx.AsyncClient()

    async def fetch_photos(self) -> schemas.PhotoAlbum:
        data = await self._fetch_event_data()

        return self._map_event_data(data)

    async def _fetch_event_data(self) -> dict[str, typing.Any]:
        response = await self._client.get(
            "https://dropevent.com/api/dropevent/maddyandkodey",
        )
        if response.status_code != fastapi.status.HTTP_200_OK:
            raise Exception("Error while fetching from Dropevent: " + response.text)
        return response.json()

    def _map_event_data(self, data: dict) -> schemas.PhotoAlbum:
        return schemas.PhotoAlbum(
            photos=self._map_photos(data),
        )

    def _map_photos(self, data: list[dict]) -> list[schemas.Photo]:
        return [
            self._map_photo(photo_data)
            for folder_data in data["folders"]
            for photo_data in folder_data["photos"]
            if not photo_data["isVideo"]
        ]

    def _map_photo(self, data: dict) -> schemas.Photo:
        return schemas.Photo(
            id=data["id"],
            thumbnail_src=data["mediumSquare"],
            original_src=data["originalURL"],
            uploaded_at=data["uploaded"],
            uploader=data["email"],
            taken_at=data["taken"],
            caption=data["caption"],
        )

    async def close(self):
        await self._client.aclose()
