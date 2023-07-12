import fastapi

from . import deps, dropevent, pictime, schemas

router = fastapi.APIRouter(prefix="/api/photos", tags=["photo"])


@router.get("/", response_model=schemas.PhotoAlbum, name="get_photos")
async def get_photos(
    dropevent_client: dropevent.DropeventClient = fastapi.Depends(
        deps.get_dropevent_client
    ),
    pictime_client: pictime.PictimeClient = fastapi.Depends(deps.get_pictime_client),
) -> schemas.PhotoAlbum:
    (
        community_album_link,
        community_upload_link,
        community_photos,
    ) = await dropevent_client.fetch_photos()
    photographer_album_link, photographer_photos = await pictime_client.fetch_photos()

    return schemas.PhotoAlbum(
        community_album_link=community_album_link,
        community_upload_link=community_upload_link,
        community_photos=community_photos,
        photographer_album_link=photographer_album_link,
        photographer_photos=photographer_photos,
    )
