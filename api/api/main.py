import fastapi

from .services import registry


app = fastapi.FastAPI(
    title="coach",
    openapi_url=f"/api/openapi.json",
    generate_unique_id_function=lambda route: route.name,
)


app.include_router(registry.endpoints.router, prefix="/api/registry", tags=["registry"])
