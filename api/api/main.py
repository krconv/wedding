import asyncio

import fastapi

from . import config, faqs, photos, registry, rsvp, schedule, utils

utils.sentry.init()

app = fastapi.FastAPI(
    title="wedding",
    openapi_url=f"/api/openapi.json",
    generate_unique_id_function=lambda route: route.name,
)


@app.on_event("startup")
async def startup():
    config.init()


@app.on_event("shutdown")
async def shutdown():
    clients = [
        registry.deps.zola_client,
        rsvp.deps.zola_client,
        schedule.deps.zola_client,
        faqs.deps.zola_client,
        photos.deps.dropevent_client,
        photos.deps.pictime_client,
    ]

    async def close_client_if_needed(client):
        if client:
            await client.close()

    await asyncio.gather(*[close_client_if_needed(client) for client in clients])


@app.get("/_ah/start", status_code=200, include_in_schema=False)
def is_started():
    return ""


app.include_router(registry.routes.router)
app.include_router(rsvp.routes.router)
app.include_router(schedule.routes.router)
app.include_router(faqs.routes.router)
app.include_router(photos.routes.router)
