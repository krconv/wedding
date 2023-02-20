import datetime
import pydantic


class Faq(pydantic.BaseModel):
    question: str
    answer: str


class UpdateMessage(pydantic.BaseModel):
    message: str
    posted_at: datetime.date | None
