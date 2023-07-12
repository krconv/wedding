from . import dropevent, pictime

dropevent_client: dropevent.DropeventClient | None = None


def get_dropevent_client() -> dropevent.DropeventClient:
    global dropevent_client
    if dropevent_client is None:
        dropevent_client = dropevent.DropeventClient()
    return dropevent_client


pictime_client: pictime.PictimeClient | None = None


def get_pictime_client() -> pictime.PictimeClient:
    global pictime_client
    if pictime_client is None:
        pictime_client = pictime.PictimeClient()
    return pictime_client
