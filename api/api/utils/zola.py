import httpx


class ZolaClientBase:
    def __init__(self, client: httpx.AsyncClient | None = None):
        self._client = client or httpx.AsyncClient()

    async def close(self):
        await self._client.aclose()
