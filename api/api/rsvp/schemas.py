import decimal
import enum
import pydantic


class FoodChoice(str, enum.Enum):
    beef = "beef"
    chicken = "chicken"
    vegetarian = "vegetarian"


class _RsvpBase(pydantic.BaseModel):
    is_attending: bool | None

    food_choice: FoodChoice | None
    song_suggestions: str | None
    notes: str | None


class Rsvp(_RsvpBase):
    id: str

    is_attending: bool


class RsvpCreate(_RsvpBase):
    is_attending: bool

    family_id: str | None
    person_id: str | None

    @pydantic.validator("family_id", "person_id")
    def validate_only_one(cls, v, values):
        if values.get("family_id") and values.get("person_id"):
            raise ValueError("Cannot set both family_id and person_id")
        return v


class RsvpUpdate(_RsvpBase):
    pass


class PersonSearchResult(pydantic.BaseModel):
    id: str

    first_name: str
    last_name: str


class Person(pydantic.BaseModel):
    id: str

    first_name: str
    last_name: str

    email: str | None
    phone_number: str | None

    rsvp: Rsvp | None
    family_id: str | None


class Lodging(pydantic.BaseModel):
    id: str

    name: str

    cost: decimal.Decimal | None


class Family(pydantic.BaseModel):
    id: str

    name: str
    total_guests: int

    members: list[Person]
    plus_ones: list[Rsvp]

    lodging: Lodging | None
