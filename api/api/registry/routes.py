import fastapi

from . import zola, schemas, deps

router = fastapi.APIRouter(prefix="/api/registry", tags=["registry"])


@router.get("/", response_model=schemas.Registry, name="get_registry")
async def get_registry(
    zola_client: zola.ZolaClient = fastapi.Depends(deps.get_zola_client),
) -> schemas.Registry:
    return await zola_client.fetch_registry()
