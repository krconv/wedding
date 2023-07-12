import datetime
import typing

import fastapi
import httpx

from . import schemas

_PUBLIC_GALLERY_URL = "https://kelseyconverse.pic-time.com/-maddykodeywedding/gallery?locker=AAAAADgAAAA0_LBqCr3lAbzeNxuX"
_GALLERY_BASE_URL = (
    "https://pictime7eus1public-m.azureedge.net/pictures/31/329/31329644/atv3kvs9p5ki"
)


class PictimeClient:
    def __init__(self, client: httpx.AsyncClient | None = None):
        self._client = client or httpx.AsyncClient()

    async def fetch_photos(self) -> tuple[str, list[schemas.PictimePhoto]]:
        data = await self._fetch_gallery_data()

        return self._map_gallery_data(data)

    async def _fetch_gallery_data(self) -> dict[str, typing.Any]:
        ts = self._generate_timestamp()
        response = await self._client.get(
            f"{_GALLERY_BASE_URL}/job_gallery_623284263.json.txt?ts={ts}"
        )

        if response.status_code != fastapi.status.HTTP_200_OK:
            raise Exception("Error while fetching from Pictime: " + response.text)
        return response.json()

    def _map_gallery_data(self, data: dict) -> tuple[str, list[schemas.PictimePhoto]]:
        return (
            _PUBLIC_GALLERY_URL,
            self._map_photos(data),
        )

    def _map_photos(self, data: list[dict]) -> list[schemas.PictimePhoto]:
        return [
            self._build_photo(photo_id + data["minId"]) for photo_id in data["photoIds"]
        ]

    def _build_photo(self, photo_id: int) -> schemas.PictimePhoto:
        return schemas.PictimePhoto(
            id=photo_id,
            thumbnail_src=f"{_GALLERY_BASE_URL}/lowres/{photo_id}.jpg",
            external_link=_PUBLIC_GALLERY_URL,
        )

    def _generate_timestamp(self) -> int:
        # pictime uses a ticks format instead of epoch timestamp
        time_since_1601 = datetime.datetime.utcnow() - datetime.datetime(1601, 1, 1)
        ticks = int(time_since_1601.total_seconds() * 10**7)
        return ticks

    async def close(self):
        await self._client.aclose()
