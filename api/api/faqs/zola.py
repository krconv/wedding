import datetime
import json
import cachetools
import re
import bs4
import fastapi
import typing

from . import schemas
from .. import utils


class ZolaClient(utils.zola.ZolaClientBase):
    _cache = cachetools.TTLCache(maxsize=10, ttl=30 * 60)

    async def get_faqs(self) -> list[schemas.Faq]:
        raw_data = await self._get_raw_data()
        raw_faqs = raw_data["props"]["pageProps"]["pageData"]["faq"]["faqs"]
        return [schemas.Faq(**raw_faq) for raw_faq in raw_faqs]

    async def get_update_message(self) -> schemas.UpdateMessage | None:
        raw_data = await self._get_raw_data()
        show_message = raw_data["props"]["pageProps"]["wedding"]["enable_cms_banner"]
        if not show_message:
            return None
        match = re.fullmatch(
            r"^(.+?)(\n? *\((\d+\/\d+\/\d\d\d\d)\)\n? *)?$",
            raw_data["props"]["pageProps"]["wedding"]["cms_banner_message"],
            flags=re.S,
        )
        try:
            posted_at = datetime.datetime.strptime(
                match.group(3),
                "%m/%d/%Y",
            ).date()
        except:
            posted_at = None

        return schemas.UpdateMessage(
            message=match.group(1),
            posted_at=posted_at,
        )

    async def _get_raw_data(self) -> dict[str, typing.Any]:
        try:
            return self._cache["_get_raw_data"]
        except KeyError:
            pass

        response = await self._client.get(
            "https://www.zola.com/wedding/maddyandkodey/faq",
            headers={
                "Cookie": "guid=NjNlODIzMjIzMTVlMjcyNTA2ZWM3YmMx|1676844884057|f|7df419a41fb80985d9adfa36c297484850827d4e;",
            },
        )
        soup = bs4.BeautifulSoup(response.text, "html.parser")

        data = json.loads(soup.find(id="__NEXT_DATA__").string)
        self._cache["_get_raw_data"] = data
        return data
