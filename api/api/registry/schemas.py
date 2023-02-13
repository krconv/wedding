import decimal
import pydantic


class RegistryItem(pydantic.BaseModel):
    id: str
    title: str
    brand: str | None
    price: decimal.Decimal | None
    image_link: str

    buy_link: str = ""

    @pydantic.root_validator()
    def compute_link(cls, values) -> dict:
        return {
            **values,
            "buy_link": f"https://www.zola.com/registry/collection-item/{values['id']}",
        }


class Registry(pydantic.BaseModel):
    full_link: str

    items: list[RegistryItem]
