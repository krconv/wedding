import fastapi

from . import parser, schemas

router = fastapi.APIRouter()


@router.get("/", response_model=schemas.Registry, name="get_registry")
async def get_registry() -> schemas.Registry:
    zola = parser.ZolaParser()
    return await zola.fetch_and_parse_registry()
