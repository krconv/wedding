import fastapi

from . import deps, dropevent, schemas

router = fastapi.APIRouter(prefix="/api/photos", tags=["photo"])


@router.get("/", response_model=schemas.PhotoAlbum, name="get_photos")
async def get_photos(
    dropevent_client: dropevent.DropeventClient = fastapi.Depends(
        deps.get_dropevent_client
    ),
) -> schemas.PhotoAlbum:
    return await dropevent_client.fetch_photos()
