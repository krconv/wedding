import fastapi

from . import schemas
from .. import utils


class ZolaClient(utils.zola.ZolaClientBase):
    async def get_schedule(self) -> list[schemas.Event]:
        response = await self._client.get(
            "https://www.zola.com/web-api/v2/publicwedding/rsvp/guest/uuid/03c1b2cf-fc13-4e23-85f6-bf6dccdc44da/wedding_account/id/2438167"
        )
        if response.status_code != fastapi.status.HTTP_200_OK:
            raise Exception("Error while fetching from Zola: " + await response.text())
        return [
            schemas.Event.from_zola_api(event) for event in response.json()["events"]
        ]
