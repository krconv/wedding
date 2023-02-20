from . import zola

zola_client: zola.ZolaClient | None = None


def get_zola_client() -> zola.ZolaClient:
    global zola_client
    if zola_client is None:
        zola_client = zola.ZolaClient()
    return zola_client
