import fastapi

from . import schemas, deps, zola

router = fastapi.APIRouter(prefix="/api/schedule", tags=["schedule"])


@router.get(
    "/",
    response_model=list[schemas.Event],
    name="get_schedule",
)
async def get_schedule(
    *, zola_client: zola.ZolaClient = fastapi.Depends(deps.get_zola_client)
) -> list[schemas.Event]:
    return await zola_client.get_schedule()
