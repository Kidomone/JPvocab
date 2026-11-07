import concurrent.futures
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

    ui_lang = (req.lang or "ru").lower()
    is_ja = req.source_lang == "ja" or (req.source_lang == "auto" and is_japanese_text(text))

    if is_ja:
        source_lang = "ja"
        japanese_text = text
        target_lang = "ru" if ui_lang == "ru" else "en"

        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            fut_trans = executor.submit(translate_text, text, "ja", target_lang)
            fut_sec = executor.submit(translate_text, text, "ja", "en") if ui_lang == "ru" else None
            fut_tokens = executor.submit(tokenize_japanese_sentence, japanese_text)

            translated_text, _, _ = fut_trans.result()
            secondary_translation = None
            if fut_sec:
                en_trans, _, _ = fut_sec.result()
                if en_trans and en_trans.lower() != translated_text.lower():
                    secondary_translation = en_trans
            tokens_data = fut_tokens.result()
    else:
        source_lang = "en"
        target_lang = "ja"

        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            fut_ja = executor.submit(translate_text, text, "en", "ja")
            fut_ru = executor.submit(translate_text, text, "en", "ru") if ui_lang == "ru" else None

            japanese_trans, _, _ = fut_ja.result()
            secondary_translation = None
            if fut_ru:
                ru_trans, _, _ = fut_ru.result()
                secondary_translation = ru_trans

        japanese_text = japanese_trans
        translated_text = japanese_trans
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
        secondary_translation=secondary_translation,
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
