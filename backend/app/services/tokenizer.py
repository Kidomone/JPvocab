import re
from typing import List, Dict, Any
from sudachipy import dictionary, tokenizer
from app.services.dictionary import (
    search_japanese_word,
    search_english_word,
    get_kanji_breakdown,
)
from app.services.lemmatizer import (
    lemmatize_english_word,
    get_english_word_forms,
)

_dict_obj = None
_tokenizer_obj = None

def get_tokenizer():
    global _dict_obj, _tokenizer_obj
    if _tokenizer_obj is None:
        _dict_obj = dictionary.Dictionary()
        _tokenizer_obj = _dict_obj.create()
    return _tokenizer_obj


def katakana_to_hiragana(text: str) -> str:
    result = []
    for char in text:
        code = ord(char)
        if 0x30A1 <= code <= 0x30F6:
            result.append(chr(code - 0x60))
        else:
            result.append(char)
    return "".join(result)


def tokenize_japanese_sentence(text: str) -> List[Dict[str, Any]]:
    tok = get_tokenizer()
    mode = tokenizer.Tokenizer.SplitMode.C
    raw_tokens = list(tok.tokenize(text, mode))

    results = []
    i = 0
    while i < len(raw_tokens):
        if i + 1 < len(raw_tokens):
            t1 = raw_tokens[i]
            t2 = raw_tokens[i + 1]
            p1 = t1.part_of_speech()[0] if t1.part_of_speech() else ""
            p2 = t2.part_of_speech()[0] if t2.part_of_speech() else ""

            if p1 in ("名詞", "接頭辞") and p2 in ("名詞", "接尾辞"):
                comb_surface = t1.surface() + t2.surface()
                dict_data = search_japanese_word(comb_surface)
                if dict_data and dict_data.get("meaning_summary"):
                    reading_hiragana = dict_data.get("reading") or (
                        katakana_to_hiragana(t1.reading_form()) + katakana_to_hiragana(t2.reading_form())
                    )
                    components = get_kanji_breakdown(comb_surface)
                    results.append({
                        "surface": comb_surface,
                        "lemma": dict_data.get("word", comb_surface),
                        "reading": reading_hiragana,
                        "pos": "名詞",
                        "meaning": dict_data["meaning_summary"],
                        "target_word": dict_data.get("word", comb_surface),
                        "components": components,
                        "alternatives": [],
                    })
                    i += 2
                    continue

        token = raw_tokens[i]
        surface = token.surface()
        lemma = token.dictionary_form()
        reading_katakana = token.reading_form()
        reading_hiragana = katakana_to_hiragana(reading_katakana)
        pos = token.part_of_speech()
        main_pos = pos[0] if pos else "Unknown"

        normalized = token.normalized_form()
        dict_data = (
            search_japanese_word(lemma, pos_hint=main_pos)
            or search_japanese_word(surface, pos_hint=main_pos)
            or (search_japanese_word(normalized, pos_hint=main_pos) if normalized and normalized not in (lemma, surface) else None)
        )
        meaning = dict_data["meaning_summary"] if dict_data else None

        components = get_kanji_breakdown(surface)
        if not components and surface != lemma:
            components = get_kanji_breakdown(lemma)

        results.append({
            "surface": surface,
            "lemma": lemma,
            "reading": reading_hiragana,
            "pos": main_pos,
            "meaning": meaning,
            "target_word": dict_data["word"] if dict_data else surface,
            "components": components,
            "alternatives": [],
        })
        i += 1

    return results


def tokenize_english_sentence(text: str, context_translation: str = "") -> List[Dict[str, Any]]:
    context_words = set()
    ja_tokens = []
    if context_translation:
        try:
            ja_tokens = tokenize_japanese_sentence(context_translation)
            for jt in ja_tokens:
                context_words.add(jt["lemma"])
                context_words.add(jt["surface"])
                context_words.add(jt["reading"])
        except Exception:
            pass

    raw_tokens = re.findall(r"\b[\w']+\b|[^\w\s]", text)

    results = []
    i = 0
    while i < len(raw_tokens):
        token = raw_tokens[i]
        is_word = bool(re.match(r"^[A-Za-z0-9']+$", token))
        if not is_word:
            results.append({
                "surface": token,
                "lemma": token,
                "reading": "",
                "pos": "Punctuation",
                "meaning": None,
                "target_word": None,
                "components": [],
                "alternatives": [],
            })
            i += 1
            continue

        token_clean = token.lower()

        single_matches = search_english_word(token_clean, limit=6, context_words=context_words)

        matches = single_matches
        is_phrase = False
        if i + 1 < len(raw_tokens):
            next_token = raw_tokens[i + 1]
            if re.match(r"^[A-Za-z0-9']+$", next_token):
                phrase = f"{token_clean} {next_token.lower()}"
                phrase_matches = search_english_word(phrase, limit=6, context_words=context_words)
                
                phrase_has_exact_context = any(m.get("exact_context") for m in phrase_matches)
                single_has_exact_context = any(m.get("exact_context") for m in single_matches)

                if phrase_has_exact_context and not single_has_exact_context:
                    matches = phrase_matches
                    is_phrase = True
                elif not single_matches and phrase_matches:
                    matches = phrase_matches
                    is_phrase = True

        word_forms = get_english_word_forms(token_clean)

        direct_ja_context = None
        for jt in ja_tokens:
            if not jt.get("meaning"):
                continue
            for wf in word_forms:
                if len(wf) >= 2 and re.search(r'\b' + re.escape(wf) + r'\b', jt["meaning"], re.IGNORECASE):
                    direct_ja_context = jt
                    break
            if direct_ja_context:
                break

        if direct_ja_context:
            context_entry = {
                "kanji": direct_ja_context["surface"],
                "reading": direct_ja_context["reading"],
                "meanings": [direct_ja_context["meaning"]],
                "in_context": True,
                "exact_context": True,
            }

            matches = [m for m in matches if m.get("kanji") != direct_ja_context["surface"]]
            matches.insert(0, context_entry)

        alternatives = [
            {
                "word": m["kanji"] or m["reading"],
                "reading": m["reading"],
                "meanings": m["meanings"],
                "in_context": m.get("in_context", False),
            }
            for m in matches
        ]

        base_lemma = lemmatize_english_word(token_clean)



        if matches:
            best = matches[0]
            chosen_word = best["kanji"] or best["reading"]
            chosen_reading = best["reading"]
            meaning_str = "; ".join(best["meanings"][:3]) if isinstance(best["meanings"], list) else str(best["meanings"])
            components = direct_ja_context["components"] if (direct_ja_context and direct_ja_context["surface"] == chosen_word) else get_kanji_breakdown(chosen_word)

            display_surface = f"{token} {raw_tokens[i + 1]}" if is_phrase else token
            display_lemma = f"{token_clean} {raw_tokens[i + 1].lower()}" if is_phrase else base_lemma

            results.append({
                "surface": display_surface,
                "lemma": display_lemma,
                "reading": chosen_reading,
                "pos": "Phrase" if is_phrase else "Word",
                "meaning": meaning_str,
                "target_word": chosen_word,
                "components": components,
                "alternatives": alternatives,
            })
            if is_phrase:
                i += 2
                continue
        else:
            results.append({
                "surface": token,
                "lemma": base_lemma,
                "reading": "",
                "pos": "Word",
                "meaning": None,
                "target_word": None,
                "components": [],
                "alternatives": [],
            })

        i += 1

    return results
