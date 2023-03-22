import asyncio

import fastapi

from .. import utils
from . import schemas


class ZolaClient(utils.zola.ZolaClientBase):
    async def search_for_guest_group(
        self, *, q: str
    ) -> list[schemas.GuestGroupSearchResult]:
        async def search_(q_: str) -> list[schemas.GuestGroupSearchResult]:
            response = await self._client.post(
                "https://www.zola.com/web-api/v1/publicwedding/rsvp/guest/wedding_account/uuid/b12b1508-074a-4564-92ec-decc6ddbeb00/search_groups",
                json={"guest_name": q_},
            )
            if response.status_code != fastapi.status.HTTP_200_OK:
                raise Exception("Error while fetching from Zola: " + response.text)
            return [
                schemas.GuestGroupSearchResult.from_zola_api(group)
                for group in response.json()
            ]

        all_results = [
            result
            for results in (
                await asyncio.gather(*[search_(q_) for q_ in [q, *q.split()]])
            )
            for result in results
        ]
        result_uuids = set()
        deduped_results = []
        for result in all_results:
            if result.uuid not in result_uuids:
                result_uuids.add(result.uuid)
                deduped_results.append(result)
        return deduped_results

    async def get_guest_group(self, uuid: str) -> schemas.GuestGroup | None:
        response = await self._client.get(
            f"https://www.zola.com/web-api/v2/publicwedding/rsvp/guest/uuid/{uuid}/wedding_account/id/2438167"
        )
        if response.status_code != fastapi.status.HTTP_200_OK:
            raise Exception("Error while fetching from Zola: " + response.text)
        return schemas.GuestGroup.from_zola_api(response.json())

    async def update_guest_group(self, group_in: schemas.GuestGroupUpdate) -> None:
        response = await self._client.post(
            "https://www.zola.com/web-api/v2/publicwedding/rsvp/wedding_account/id/2438167",
            json=group_in.to_zola_api(),
        )
        if response.status_code != fastapi.status.HTTP_200_OK:
            raise Exception("Error while fetching from Zola: " + response.text)
