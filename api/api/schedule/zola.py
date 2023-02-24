import fastapi

from .. import utils
from . import schemas


class ZolaClient(utils.zola.ZolaClientBase):
    async def get_schedule(self) -> list[schemas.Event]:
        response = await self._client.get(
            "https://www.zola.com/web-api/v2/publicwedding/rsvp/guest/uuid/61f6f3f8-ce84-4714-9152-9b7c5be0ec5a/wedding_account/id/2438167"
        )
        if response.status_code != fastapi.status.HTTP_200_OK:
            raise Exception("Error while fetching from Zola: " + await response.text)
        return [
            schemas.Event.from_zola_api(event) for event in response.json()["events"]
        ]
