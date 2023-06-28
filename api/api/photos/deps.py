from . import dropevent

dropevent_client: dropevent.DropeventClient | None = None


def get_dropevent_client() -> dropevent.DropeventClient:
    global dropevent_client
    if dropevent_client is None:
        dropevent_client = dropevent.DropeventClient()
    return dropevent_client
