import fastapi

from . import schemas, zola

router = fastapi.APIRouter()


@router.get("/", response_model=schemas.Registry, name="get_registry")
async def get_registry() -> schemas.Registry:
    zola_ = zola.ZolaClient()
    return await zola_.fetch_registry()
