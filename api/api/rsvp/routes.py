import logging

import fastapi

from . import deps, schemas, zola

router = fastapi.APIRouter(prefix="/api/rsvp", tags=["rsvp"])


@router.post(
    "/groups/search",
    response_model=list[schemas.GuestGroupSearchResult],
    name="search_for_guest_group",
)
async def search_for_guest_group(
    *,
    q: str = fastapi.Body(embed=True),
    zola_client: zola.ZolaClient = fastapi.Depends(deps.get_zola_client),
) -> list[schemas.GuestGroupSearchResult]:
    results = await zola_client.search_for_guest_group(q=q)
    logging.info(f"Found {len(results)} results for query {q}")
    return results


@router.get(
    "/group/{group_uuid}", response_model=schemas.GuestGroup, name="get_guest_group"
)
async def get_guest_group(
    *,
    group_uuid: str,
    zola_client: zola.ZolaClient = fastapi.Depends(deps.get_zola_client),
) -> schemas.GuestGroup:
    guest_group = await zola_client.get_guest_group(uuid=group_uuid)
    if not guest_group:
        raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND)
    return guest_group


@router.put("/group", response_model=None, name="update_guest_group")
async def update_guest_group(
    *,
    group_in: schemas.GuestGroupUpdate,
    zola_client: zola.ZolaClient = fastapi.Depends(deps.get_zola_client),
) -> None:
    await zola_client.update_guest_group(group_in=group_in)
