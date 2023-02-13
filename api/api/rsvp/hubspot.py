import decimal
import asyncio
import fastapi
import typing
import httpx
from .. import config
from . import schemas

_FAMILY_OBJECT_TYPE_ID = "2-11448475"
_RSVP_OBJECT_TYPE_ID = "2-11448531"
_LODGING_OBJECT_TYPE_ID = "2-11448682"

_RSVP_TO_FAMILY_ASSOCIATION_ID = 96
_RSVP_TO_CONTACT_ASSOCIATION_ID = 85


class HubSpotClient:
    def __init__(self, client: httpx.AsyncClient | None = None):
        self._client = client or httpx.AsyncClient()
        self._client.auth = _HubSpotAuth()

    async def search_for_person(self, *, q: str) -> list[schemas.PersonSearchResult]:
        response = await self._client.post(
            "https://api.hubapi.com/crm/v3/objects/contacts/search",
            json={
                "query": q,
                "filterGroups": [
                    {
                        "filters": [
                            {
                                "propertyName": "invited_to_wedding",
                                "operator": "EQ",
                                "value": "yes",
                            }
                        ]
                    }
                ],
                "properties": ["firstname", "lastname", "email", "phone"],
            },
        )
        response.raise_for_status()
        results = response.json()["results"]
        if len(results) > 5:  # hide results if query is too broad
            return []

        return [
            schemas.PersonSearchResult(
                id=str(result["id"]),
                first_name=result["properties"]["firstname"],
                last_name=result["properties"]["lastname"],
            )
            for result in results
        ]

    async def get_person(
        self, *, person_id: str, exclude_associations: bool = False
    ) -> schemas.Person | None:
        response = await self._client.get(
            f"https://api.hubapi.com/crm/v3/objects/contacts/{person_id}",
            params={
                "properties": "firstname,lastname,email,phone",
                **(
                    {"associations": f"{_FAMILY_OBJECT_TYPE_ID},{_RSVP_OBJECT_TYPE_ID}"}
                    if not exclude_associations
                    else {}
                ),
            },
        )
        response.raise_for_status()
        result = response.json()
        if not result:
            return None
        return await self._map_person(result)

    async def _map_person(self, data: dict[str, typing.Any]) -> schemas.Person:
        rsvp_ids = self._associations(data, "rsvps")
        family_ids = self._associations(data, "families")
        return schemas.Person(
            id=str(data["id"]),
            first_name=self._property(data, "firstname"),
            last_name=self._property(data, "lastname"),
            email=self._property(data, "email"),
            phone_number=self._property(data, "phone"),
            rsvp=await self.get_rsvp(rsvp_id=rsvp_ids[0]) if rsvp_ids else None,
            family_id=family_ids[0] if family_ids else None,
        )

    async def get_rsvp(self, *, rsvp_id: str) -> schemas.Rsvp | None:
        response = await self._client.get(
            f"https://api.hubapi.com/crm/v3/objects/{_RSVP_OBJECT_TYPE_ID}/{rsvp_id}",
            params={"properties": "is_attending,food_choice,song_suggestions,notes"},
        )
        if response.status_code == fastapi.status.HTTP_404_NOT_FOUND:
            return None

        response.raise_for_status()
        result = response.json()
        return schemas.Rsvp(
            id=str(result["id"]),
            is_attending=self._property(result, "is_attending") == "yes",
            food_choice=self._property(result, "food_choice"),
            song_suggestions=self._property(result, "song_suggestions"),
            notes=self._property(result, "notes"),
        )

    async def create_rsvp(self, *, rsvp_in: schemas.RsvpCreate) -> schemas.Rsvp:
        response = await self._client.post(
            f"https://api.hubapi.com/crm/v3/objects/{_RSVP_OBJECT_TYPE_ID}",
            json={
                "properties": {
                    "description": await self._build_rsvp_description(rsvp_in),
                    "is_attending": "yes" if rsvp_in.is_attending else "no",
                    "food_choice": rsvp_in.food_choice,
                    "song_suggestions": rsvp_in.song_suggestions,
                    "notes": rsvp_in.notes,
                },
            },
        )
        response.raise_for_status()
        rsvp = response.json()

        try:
            response = await self._client.put(
                f"https://api.hubapi.com/crm/v4/objects/{_RSVP_OBJECT_TYPE_ID}/{rsvp['id']}/associations/{_FAMILY_OBJECT_TYPE_ID if rsvp_in.family_id else 'contact'}/{rsvp_in.family_id or rsvp_in.person_id}",
                json=[
                    {
                        "associationCategory": "USER_DEFINED",
                        "associationTypeId": _RSVP_TO_FAMILY_ASSOCIATION_ID
                        if rsvp_in.family_id
                        else _RSVP_TO_CONTACT_ASSOCIATION_ID,
                    }
                ],
            )
        except:
            self.delete_rsvp(rsvp_id=str(rsvp["id"]))
            raise

        return schemas.Rsvp(
            id=str(rsvp["id"]),
            is_attending=self._property(rsvp, "is_attending") == "yes",
            food_choice=self._property(rsvp, "food_choice"),
            song_suggestions=self._property(rsvp, "song_suggestions"),
            notes=self._property(rsvp, "notes"),
        )

    async def _build_rsvp_description(self, rsvp_in: schemas.RsvpCreate) -> str:
        if rsvp_in.person_id:
            person = await self.get_person(
                person_id=rsvp_in.person_id, exclude_associations=True
            )
            assert person is not None, "Person for RSVP not found"
            description = f"{person.first_name} {person.last_name}"
        else:
            family = await self.get_family(
                family_id=rsvp_in.family_id, exclude_associations=True
            )
            assert family is not None, "Family for RSVP not found"
            description = f"{family.name} Plus One"
        return description

    async def update_rsvp(
        self, *, rsvp_id: str, rsvp_in: schemas.RsvpUpdate
    ) -> schemas.Rsvp:
        raw_update = rsvp_in.dict(exclude_unset=True)
        response = await self._client.patch(
            f"https://api.hubapi.com/crm/v3/objects/{_RSVP_OBJECT_TYPE_ID}/{rsvp_id}",
            json={
                "properties": {
                    **(
                        {
                            "is_attending": (
                                "yes"
                                if rsvp_in.is_attending is True
                                else ("no" if rsvp_in.is_attending is False else "")
                            )
                        }
                        if "is_attending" in raw_update
                        else {}
                    ),
                    **(
                        {"food_choice": rsvp_in.food_choice or ""}
                        if "food_choice" in raw_update
                        else {}
                    ),
                    **(
                        {"song_suggestions": rsvp_in.song_suggestions or ""}
                        if "song_suggestions" in raw_update
                        else {}
                    ),
                    **({"notes": rsvp_in.notes or ""} if "notes" in raw_update else {}),
                },
            },
        )
        response.raise_for_status()

    async def delete_rsvp(self, *, rsvp_id: str) -> None:
        response = await self._client.delete(
            f"https://api.hubapi.com/crm/v3/objects/{_RSVP_OBJECT_TYPE_ID}/{rsvp_id}",
        )
        response.raise_for_status()
        return

    async def get_family(
        self, *, family_id: str, exclude_associations: bool = False
    ) -> schemas.Family | None:
        response = await self._client.get(
            f"https://api.hubapi.com/crm/v3/objects/{_FAMILY_OBJECT_TYPE_ID}/{family_id}",
            params={
                "properties": "name,total_guests",
                **(
                    {
                        "associations": f"contacts,{_LODGING_OBJECT_TYPE_ID},{_RSVP_OBJECT_TYPE_ID}"
                    }
                    if not exclude_associations
                    else {}
                ),
            },
        )
        response.raise_for_status()
        result = response.json()

        return await self._map_family(result)

    async def _map_family(self, data: dict[str, typing.Any]) -> schemas.Family:
        member_ids = self._associations(data, "contacts")
        rsvp_ids = self._associations(data, "rsvps")
        lodging_ids = self._associations(data, "lodging")
        members, plus_ones, lodging = await asyncio.gather(
            asyncio.gather(
                *[self.get_person(person_id=member_id) for member_id in member_ids]
            ),
            asyncio.gather(*[self.get_rsvp(rsvp_id=rsvp_id) for rsvp_id in rsvp_ids]),
            asyncio.gather(
                *([self.get_lodging(lodging_id=lodging_ids[0])] if lodging_ids else [])
            ),
        )
        return schemas.Family(
            id=str(data["id"]),
            name=self._property(data, "name"),
            total_guests=self._property(data, "total_guests"),
            members=members,
            plus_ones=plus_ones,
            lodging=lodging[0] if lodging else None,
        )

    async def get_lodging(self, *, lodging_id: str) -> schemas.Lodging | None:
        response = await self._client.get(
            f"https://api.hubapi.com/crm/v3/objects/{_LODGING_OBJECT_TYPE_ID}/{lodging_id}",
            params={"properties": "name,cost"},
        )
        response.raise_for_status()
        result = response.json()
        return schemas.Lodging(
            id=str(result["id"]),
            name=self._property(result, "name"),
            cost=decimal.Decimal(self._property(result, "cost"))
            if self._property(result, "cost")
            else None,
        )

    def _property(
        self, object: dict[str, typing.Any], property_name: str
    ) -> str | None:
        try:
            return object["properties"][property_name]
        except KeyError:
            return None

    def _associations(
        self, object: dict[str, typing.Any], association_name: str
    ) -> list[str]:
        if "associations" not in object or not object["associations"]:
            return []
        for name, associations in object["associations"].items():
            if association_name in name:
                return [
                    str(association["id"]) for association in associations["results"]
                ]
        return []

    async def close(self):
        await self._client.aclose()


class _HubSpotAuth(httpx.Auth):
    def __init__(self, api_key: str | None = None):
        self._api_key = api_key or config.HUBSPOT_API_KEY

    def auth_flow(self, request: httpx.Request):
        request.headers["Authorization"] = f"Bearer {self._api_key}"
        yield request
