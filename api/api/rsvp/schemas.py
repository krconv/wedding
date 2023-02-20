import zoneinfo
import datetime
import typing
import enum
import pydantic


class _GuestBase(pydantic.BaseModel):
    class Role(str, enum.Enum):
        primary = "primary"
        partner = "partner"
        child = "child"

        @classmethod
        def from_zola_api(cls, data: str) -> "_GuestBase.Role":
            return cls(data.lower())

    first_name: str | None
    last_name: str | None

    role: Role


class GuestGroupSearchResult(pydantic.BaseModel):
    class Guest(_GuestBase):
        uuid: str

        searched_for: bool

        @classmethod
        def from_zola_api(
            cls, data: dict[str, typing.Any]
        ) -> "GuestGroupSearchResult.Guest":
            return cls(
                uuid=data["uuid"],
                first_name=data["first_name"],
                last_name=data["family_name"],
                role=cls.Role.from_zola_api(data["relationship_type"]),
                searched_for=data["searched_for"],
            )

    uuid: str

    guests: list[Guest]

    @classmethod
    def from_zola_api(cls, data: dict[str, typing.Any]) -> "GuestGroupSearchResult":
        return cls(
            uuid=data["uuid"],
            guests=[cls.Guest.from_zola_api(guest) for guest in data["guests"]],
        )


class RsvpResponse(str, enum.Enum):
    attending = "attending"
    declined = "declined"
    no_response = "no_response"

    @classmethod
    def from_zola_api(cls, data: str) -> "RsvpResponse":
        return cls(data.lower())

    def to_zola_api(self) -> str:
        return self.value.upper()


class Event(pydantic.BaseModel):
    class MealOption(pydantic.BaseModel):
        id: str
        name: str

        @classmethod
        def from_zola_api(cls, data: dict[str, typing.Any]) -> "Event.MealOption":
            return cls(
                id=str(data["id"]),
                name=data["name"],
            )

    class Question(pydantic.BaseModel):
        id: str
        question: str

        @classmethod
        def from_zola_api(cls, data: dict[str, typing.Any]) -> "Event.Question":
            return cls(
                id=str(data["id"]),
                question=data["question"],
            )

    id: str
    name: str

    note: str | None
    attire: str | None

    starts_at: datetime.datetime
    ends_at: datetime.datetime | None

    collect_rsvps: bool
    meal_options: list[MealOption]
    questions: list[Question]

    @classmethod
    def from_zola_api(cls, data: dict[str, typing.Any]) -> "Event":
        date_format = "%Y-%m-%dT%H:%M:%SZ"
        tzinfo = zoneinfo.ZoneInfo(data["timezone"])
        return cls(
            id=str(data["id"]),
            name=data["name"],
            note=data["note"],
            attire=data["attire"],
            starts_at=datetime.datetime.strptime(data["start_at"], date_format).replace(
                tzinfo=tzinfo
            ),
            ends_at=(
                datetime.datetime.strptime(data["end_at"], date_format).replace(
                    tzinfo=tzinfo
                )
                if data["end_at"]
                else None
            ),
            collect_rsvps=data["collect_rsvps"],
            meal_options=[
                cls.MealOption.from_zola_api(meal) for meal in data["meal_options"]
            ],
            questions=[
                cls.Question.from_zola_api(question)
                for question in data["rsvp_questions"]
            ],
        )


class _GuestGroupBase(pydantic.BaseModel):
    class Guest(_GuestBase):
        class Invitation(pydantic.BaseModel):
            id: str
            event_id: str

            meal_choice_id: str | None
            rsvp: RsvpResponse

            @classmethod
            def from_zola_api(
                cls, data: dict[str, typing.Any]
            ) -> "_GuestGroupBase.Guest.Invitation":
                return cls(
                    id=(data["id"]),
                    event_id=str(data["event_id"]),
                    meal_choice_id=str(data["meal_option_id"])
                    if data["meal_option_id"]
                    else None,
                    rsvp=RsvpResponse.from_zola_api(data["rsvp_type"]),
                )

            def to_zola_api(self) -> dict[str, typing.Any]:
                return {
                    "id": int(self.id),
                    "event_id": int(self.event_id),
                    "rsvp_type": self.rsvp.to_zola_api(),
                    "meal_option_id": int(self.meal_choice_id)
                    if self.meal_choice_id
                    else None,
                }

        id: str
        rsvp: RsvpResponse

        invitations: list[Invitation]

        @classmethod
        def from_zola_api(cls, data: dict[str, typing.Any]) -> "_GuestGroupBase.Guest":
            return cls(
                id=str(data["id"]),
                first_name=data["first_name"],
                last_name=data["family_name"],
                role=cls.Role.from_zola_api(data["relationship_type"]),
                rsvp=RsvpResponse.from_zola_api(data["rsvp"]),
                invitations=[
                    cls.Invitation.from_zola_api(invitation)
                    for invitation in data["event_invitations"]
                ],
            )

        def to_zola_api(self) -> dict[str, typing.Any]:
            return {
                "id": int(self.id),
                "first_name": self.first_name,
                "family_name": self.last_name,
                "rsvp": self.rsvp.value,
                "event_invitations": [
                    invitation.to_zola_api() for invitation in self.invitations
                ],
            }

    class Answer(pydantic.BaseModel):
        question_id: str
        answer: str

        @classmethod
        def from_zola_api(cls, data: dict[str, typing.Any]) -> "_GuestGroupBase.Answer":
            return cls(
                question_id=str(data["rsvp_question_id"]),
                answer=data["answer"],
            )

        def to_zola_api(self) -> dict[str, typing.Any]:
            return {
                "rsvp_question_id": int(self.question_id),
                "answer": self.answer,
            }

    id: str
    guests: list[Guest]

    answers: list[Answer]


class GuestGroup(_GuestGroupBase):
    events: list[Event]

    @classmethod
    def from_zola_api(cls, data: dict[str, typing.Any]) -> "GuestGroup":
        return cls(
            id=str(data["guest_group_id"]),
            guests=[cls.Guest.from_zola_api(guest) for guest in data["guests"]],
            answers=[
                cls.Answer.from_zola_api(answer) for answer in data["rsvp_answers"]
            ],
            events=[Event.from_zola_api(event) for event in data["events"]],
        )


class GuestGroupUpdate(_GuestGroupBase):
    def to_zola_api(self) -> dict[str, typing.Any]:
        return {
            "wedding_account_id": int("2438167"),
            "guest_group_id": int(self.id),
            "guests": [guest.to_zola_api() for guest in self.guests],
            "rsvp_answers": [answer.to_zola_api() for answer in self.answers],
        }
