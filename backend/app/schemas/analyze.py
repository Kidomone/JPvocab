from typing import List, Optional
from pydantic import BaseModel, Field

class KanjiComponent(BaseModel):
    kanji: str
    meaning: str
    readings: str

class JapaneseAlternative(BaseModel):
    word: str
    reading: str
    meanings: List[str] = []
    in_context: bool = False

class TokenDetail(BaseModel):
    surface: str
    lemma: str
    reading: str
    pos: str
    meaning: Optional[str] = None
    target_word: Optional[str] = None
    components: List[KanjiComponent] = []
    alternatives: List[JapaneseAlternative] = []

class AnalyzeSentenceRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Sentence or phrase to analyze in Japanese or English")
    source_lang: Optional[str] = Field("auto", description="Source language ('ja', 'en', or 'auto')")

class AnalyzeSentenceResponse(BaseModel):
    original_text: str
    source_lang: str
    target_lang: str
    japanese_text: str
    translation: str
    tokens: List[TokenDetail]

class DictionaryEntry(BaseModel):
    kanji: Optional[str] = None
    reading: Optional[str] = None
    meanings: List[str] = []
