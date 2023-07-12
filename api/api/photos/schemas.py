import datetime
import decimal

import pydantic


class DropeventPhoto(pydantic.BaseModel):
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


class PictimePhoto(pydantic.BaseModel):
    id: str

    thumbnail_src: str
    external_link: str | None


class PhotoAlbum(pydantic.BaseModel):
    community_album_link: str
    community_upload_link: str = "https://dropevent.com/maddyandkodey/upload"
    community_photos: list[DropeventPhoto]

    photographer_album_link: str
    photographer_photos: list[PictimePhoto]
