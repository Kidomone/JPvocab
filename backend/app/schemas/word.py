from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class WordBase(BaseModel):
    word: str = Field(..., min_length=1, max_length=100, description="Japanese word (kanji or kana)")
    reading: str = Field(..., min_length=1, max_length=100, description="Kana reading (furigana)")
    meaning: str = Field(..., min_length=1, description="English definition / meaning")
    notes: Optional[str] = Field("", description="Custom personal user notes")

class WordCreate(WordBase):
    user_id: int = Field(..., description="ID of the user who owns this vocabulary item")

class WordUpdate(BaseModel):
    word: Optional[str] = Field(None, min_length=1, max_length=100)
    reading: Optional[str] = Field(None, min_length=1, max_length=100)
    meaning: Optional[str] = None
    notes: Optional[str] = None

class WordResponse(WordBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
