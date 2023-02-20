import fastapi

from . import schemas, deps, zola

router = fastapi.APIRouter(prefix="/api", tags=["faq"])


@router.get("/faqs", response_model=list[schemas.Faq], name="get_faqs")
async def get_faqs(
    *, zola_client: zola.ZolaClient = fastapi.Depends(deps.get_zola_client)
) -> list[schemas.Faq]:
    return await zola_client.get_faqs()


@router.get(
    "/update-message",
    response_model=schemas.UpdateMessage,
    name="get_update_message",
)
async def get_update_message(
    *, zola_client: zola.ZolaClient = fastapi.Depends(deps.get_zola_client)
) -> schemas.UpdateMessage:
    update = await zola_client.get_update_message()
    if not update:
        raise fastapi.HTTPException(status_code=fastapi.status.HTTP_404_NOT_FOUND)
    return update
