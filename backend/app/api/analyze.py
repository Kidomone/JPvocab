from typing import List
from fastapi import APIRouter, Query, HTTPException, status
from app.schemas.analyze import (
    AnalyzeSentenceRequest,
    AnalyzeSentenceResponse,
    TokenDetail,
    KanjiComponent,
    JapaneseAlternative,
    DictionaryEntry,
)
from app.services.tokenizer import (
    tokenize_japanese_sentence,
    tokenize_english_sentence,
)
from app.services.translator import translate_text, is_japanese_text
from app.services.dictionary import search_japanese_word, search_english_word

router = APIRouter()


@router.post("/analyze/sentence", response_model=AnalyzeSentenceResponse)
def analyze_sentence(req: AnalyzeSentenceRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input text cannot be empty",
        )

    if req.source_lang == "ja" or (req.source_lang == "auto" and is_japanese_text(text)):
        source_lang = "ja"
        target_lang = "en"
        japanese_text = text
        translated_text, _, _ = translate_text(text, source_lang="ja", target_lang="en")
        tokens_data = tokenize_japanese_sentence(japanese_text)
    else:
        source_lang = "en"
        target_lang = "ja"
        translated_text, _, _ = translate_text(text, source_lang="en", target_lang="ja")
        japanese_text = translated_text
        tokens_data = tokenize_english_sentence(text, context_translation=japanese_text)

    tokens = [
        TokenDetail(
            surface=t["surface"],
            lemma=t["lemma"],
            reading=t["reading"],
            pos=t["pos"],
            meaning=t["meaning"],
            target_word=t.get("target_word"),
            components=[KanjiComponent(**c) for c in t.get("components", [])],
            alternatives=[JapaneseAlternative(**a) for a in t.get("alternatives", [])],
        )
        for t in tokens_data
    ]

    return AnalyzeSentenceResponse(
        original_text=text,
        source_lang=source_lang,
        target_lang=target_lang,
        japanese_text=japanese_text,
        translation=translated_text,
        tokens=tokens,
    )


@router.get("/dictionary/search", response_model=List[DictionaryEntry])
def search_dictionary(
    query: str = Query(..., min_length=1, description="Word to look up (Japanese or English)"),
    limit: int = Query(10, ge=1, le=50),
):
    q = query.strip()
    if is_japanese_text(q):
        match = search_japanese_word(q)
        if match:
            return [DictionaryEntry(
                kanji=match["word"],
                reading=match["reading"],
                meanings=match["meanings"],
            )]
        return []
    else:
        matches = search_english_word(q, limit=limit)
        return [
            DictionaryEntry(
                kanji=m.get("kanji"),
                reading=m.get("reading"),
                meanings=m.get("meanings", []),
            )
            for m in matches
        ]
