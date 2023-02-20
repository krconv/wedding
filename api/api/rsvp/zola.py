import fastapi

from . import schemas
from .. import utils


class ZolaClient(utils.zola.ZolaClientBase):
    async def search_for_guest_group(
        self, *, q: str
    ) -> list[schemas.GuestGroupSearchResult]:
        response = await self._client.post(
            "https://www.zola.com/web-api/v1/publicwedding/rsvp/guest/wedding_account/uuid/b12b1508-074a-4564-92ec-decc6ddbeb00/search_groups",
            json={"guest_name": q},
        )
        if response.status_code != fastapi.status.HTTP_200_OK:
            raise Exception("Error while fetching from Zola: " + await response.text())
        results = [
            schemas.GuestGroupSearchResult.from_zola_api(group)
            for group in response.json()
        ]
        if len(results) > 4:
            # hide overly broad results
            return []
        return results

    async def get_guest_group(self, uuid: str) -> schemas.GuestGroup | None:
        response = await self._client.get(
            f"https://www.zola.com/web-api/v2/publicwedding/rsvp/guest/uuid/{uuid}/wedding_account/id/2438167"
        )
        if response.status_code != fastapi.status.HTTP_200_OK:
            raise Exception("Error while fetching from Zola: " + await response.text())
        return schemas.GuestGroup.from_zola_api(response.json())

    async def update_guest_group(self, group_in: schemas.GuestGroupUpdate) -> None:
        response = await self._client.post(
            "https://www.zola.com/web-api/v2/publicwedding/rsvp/wedding_account/id/2438167",
            json=group_in.to_zola_api(),
        )
        if response.status_code != fastapi.status.HTTP_200_OK:
            raise Exception("Error while fetching from Zola: " + await response.text())
