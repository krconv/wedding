import datetime
import decimal

import pydantic


class Photo(pydantic.BaseModel):
    id: str

    thumbnail_src: str
    original_src: str
    external_link: str | None

    uploader: str
    uploaded_at: datetime.datetime

    taken_at: datetime.datetime
    caption: str | None

    @pydantic.root_validator()
    def compute_link(cls, values) -> dict:
        return {
            **values,
            "external_link": f"https://dropevent.com/maddyandkodey/p/{values['id']}",
        }


class PhotoAlbum(pydantic.BaseModel):
    album_link: str = "https://dropevent.com/maddyandkodey"
    upload_link: str = "https://dropevent.com/maddyandkodey/upload"

    photos: list[Photo]
