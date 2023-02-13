from . import hubspot

hubspot_client: hubspot.HubSpotClient | None = None


def get_hubspot_client() -> hubspot.HubSpotClient:
    global hubspot_client
    if hubspot_client is None:
        hubspot_client = hubspot.HubSpotClient()
    return hubspot_client
