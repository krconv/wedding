import fastapi

from . import schemas, deps, hubspot

router = fastapi.APIRouter(prefix="/api/rsvp", tags=["rsvp"])


@router.post(
    "/people/search",
    response_model=list[schemas.PersonSearchResult],
    name="search_for_person",
)
async def search_for_person(
    *,
    q: str,
    hubspot_client: hubspot.HubSpotClient = fastapi.Depends(deps.get_hubspot_client)
) -> list[schemas.PersonSearchResult]:
    return await hubspot_client.search_for_person(q=q)


@router.get("/people/{person_id}", response_model=schemas.Person, name="get_person")
async def get_person(
    *,
    person_id: str,
    hubspot_client: hubspot.HubSpotClient = fastapi.Depends(deps.get_hubspot_client)
) -> schemas.Person:
    person = await hubspot_client.get_person(person_id=person_id)
    if not person:
        raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND)
    return person


@router.get("/families/{family_id}", response_model=schemas.Family, name="get_family")
async def get_family(
    *,
    family_id: str,
    hubspot_client: hubspot.HubSpotClient = fastapi.Depends(deps.get_hubspot_client)
) -> schemas.Family:
    family = await hubspot_client.get_family(family_id=family_id)
    if not family:
        raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND)
    return family


@router.post("/rsvps", response_model=schemas.Rsvp, name="create_rsvp")
async def create_rsvp(
    *,
    rsvp_in: schemas.RsvpCreate,
    hubspot_client: hubspot.HubSpotClient = fastapi.Depends(deps.get_hubspot_client)
) -> schemas.Rsvp:
    return await hubspot_client.create_rsvp(rsvp_in=rsvp_in)


@router.patch("/rsvps/{rsvp_id}", response_model=schemas.Rsvp, name="update_rsvp")
async def update_rsvp(
    *,
    rsvp_id: str,
    rsvp_in: schemas.RsvpUpdate,
    hubspot_client: hubspot.HubSpotClient = fastapi.Depends(deps.get_hubspot_client)
) -> None:
    await hubspot_client.update_rsvp(rsvp_id=rsvp_id, rsvp_in=rsvp_in)


@router.delete("/rsvps/{rsvp_id}", response_model=None, name="delete_rsvp")
async def delete_rsvp(
    *,
    rsvp_id: str,
    hubspot_client: hubspot.HubSpotClient = fastapi.Depends(deps.get_hubspot_client)
) -> None:
    await hubspot_client.delete_rsvp(rsvp_id=rsvp_id)
