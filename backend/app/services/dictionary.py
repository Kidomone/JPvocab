import os
import sqlite3
from typing import Dict, List, Optional
from app.config import settings
from app.services.lemmatizer import get_english_candidate_stems

SUDACHI_TO_JMDICT_POS = {
    "助詞": ["prt"],
    "助動詞": ["aux", "aux-v", "aux-adj", "cop"],
    "名詞": ["n", "noun", "pn"],
    "動詞": ["v1", "v5", "v5r", "v5k", "v5s", "v5t", "v5n", "v5m", "v5g", "v5b", "vz", "vi", "vt"],
    "形容詞": ["adj-i", "adj-na"],
    "副詞": ["adv", "adv-to"],
    "接続詞": ["conj"],
    "感動詞": ["int"],
    "連体詞": ["adj-pn"],
    "接頭辞": ["pref"],
    "接尾辞": ["suf"],
}


def _get_jmdict_connection() -> Optional[sqlite3.Connection]:
    path = settings.jmdict_path
    if path.exists():
        return sqlite3.connect(str(path))
    return None


def _get_kanjidic_connection() -> Optional[sqlite3.Connection]:
    path = settings.kanjidic_path
    if path.exists():
        return sqlite3.connect(str(path))
    return None



def is_kanji(char: str) -> bool:
    return '\u4e00' <= char <= '\u9faf'


def has_kanji(text: str) -> bool:
    return any(is_kanji(c) for c in text)


def get_kanji_breakdown(text: str) -> List[Dict[str, str]]:
    """Look up individual kanji components in kanjidic2.db."""
    conn = _get_kanjidic_connection()
    if not conn:
        return []

    results = []
    seen = set()
    try:
        cursor = conn.cursor()
        for char in text:
            if is_kanji(char) and char not in seen:
                seen.add(char)
                cursor.execute(
                    "SELECT meaning FROM meanings WHERE kanji_literal = ? AND (lang IS NULL OR lang = 'en') LIMIT 3",
                    (char,)
                )
                meanings = [row[0] for row in cursor.fetchall()]
                meaning_str = ", ".join(meanings) if meanings else ""

                cursor.execute(
                    "SELECT reading FROM readings WHERE kanji_literal = ? AND reading_type IN ('ja_on', 'ja_kun') LIMIT 4",
                    (char,)
                )
                readings = [row[0] for row in cursor.fetchall()]
                readings_str = ", ".join(readings) if readings else ""

                results.append({
                    "kanji": char,
                    "meaning": meaning_str,
                    "readings": readings_str,
                })
    except Exception:
        pass
    finally:
        conn.close()

    return results


def search_japanese_word(word: str, pos_hint: Optional[str] = None) -> Optional[Dict]:
    """
    Look up a Japanese word (kanji or kana) in JMdict.db.
    """
    conn = _get_jmdict_connection()
    if not conn:
        return None

    try:
        cursor = conn.cursor()
        query = """
        SELECT DISTINCT
            e.id AS entry_id,
            k.keb AS kanji,
            r.reb AS reading,
            p.name AS pos_name,
            g.content AS translation
        FROM entry e
        LEFT JOIN k_ele k ON e.id = k.id_entry
        LEFT JOIN r_ele r ON e.id = r.id_entry
        LEFT JOIN sense s ON e.id = s.id_entry
        LEFT JOIN sense_pos sp ON s.id = sp.id_sense
        LEFT JOIN pos p ON sp.id_pos = p.id
        LEFT JOIN gloss g ON s.id = g.id_sense
        WHERE (k.keb = ? OR r.reb = ?)
          AND (g.id_lang = '1' OR g.id_lang IS NULL OR g.id_lang = 'eng')
        """
        cursor.execute(query, (word, word))
        rows = cursor.fetchall()
        if not rows:
            return None

        target_pos_tags = SUDACHI_TO_JMDICT_POS.get(pos_hint, []) if pos_hint else []
        word_is_pure_kana = not has_kanji(word)

        entries_map: Dict[str, Dict] = {}
        for entry_id, kanji, reading, pos_name, translation in rows:
            if entry_id not in entries_map:
                entries_map[entry_id] = {
                    "entry_id": entry_id,
                    "kanji": kanji,
                    "reading": reading,
                    "pos_names": set(),
                    "translations": [],
                }
            if pos_name:
                entries_map[entry_id]["pos_names"].add(pos_name)
            if translation and translation not in entries_map[entry_id]["translations"]:
                entries_map[entry_id]["translations"].append(translation)

        def score_entry(item: Dict) -> int:
            score = 0
            if target_pos_tags:
                if any(any(pos.startswith(tag) for tag in target_pos_tags) for pos in item["pos_names"]):
                    score += 100
                else:
                    score -= 50
            if word_is_pure_kana:
                if item["kanji"] is None:
                    score += 50
                else:
                    score -= 20

            if item["kanji"] == word or item["reading"] == word:
                score += 20

            return score

        best_entry = max(entries_map.values(), key=score_entry)

        meanings = best_entry["translations"]
        display_word = best_entry["kanji"] or best_entry["reading"] or word
        display_reading = best_entry["reading"] or word

        return {
            "word": display_word,
            "reading": display_reading,
            "meanings": meanings[:5],
            "meaning_summary": "; ".join(meanings[:3]),
        }
    except Exception:
        return None
    finally:
        conn.close()


ENGLISH_PRONOUNS_MAP = {
    "i": [
        {"kanji": "私", "reading": "わたし", "meanings": ["I", "me"]},
        {"kanji": "僕", "reading": "ぼく", "meanings": ["I (male informal)"]},
        {"kanji": "俺", "reading": "おれ", "meanings": ["I (male casual)"]},
        {"kanji": "あたし", "reading": "あたし", "meanings": ["I (female informal)"]},
    ],
    "me": [
        {"kanji": "私", "reading": "わたし", "meanings": ["me", "I"]},
        {"kanji": "僕", "reading": "ぼく", "meanings": ["me"]},
    ],
    "you": [
        {"kanji": "あなた", "reading": "あなた", "meanings": ["you"]},
        {"kanji": "君", "reading": "きみ", "meanings": ["you (familiar)"]},
        {"kanji": "お前", "reading": "おまえ", "meanings": ["you (rough/casual)"]},
    ],
    "he": [
        {"kanji": "彼", "reading": "かれ", "meanings": ["he", "him", "boyfriend"]},
    ],
    "him": [
        {"kanji": "彼", "reading": "かれ", "meanings": ["him", "he"]},
    ],
    "she": [
        {"kanji": "彼女", "reading": "かのじょ", "meanings": ["she", "her", "girlfriend"]},
    ],
    "her": [
        {"kanji": "彼女", "reading": "かのじょ", "meanings": ["her", "she"]},
    ],
    "we": [
        {"kanji": "私たち", "reading": "わたしたち", "meanings": ["we", "us"]},
        {"kanji": "僕たち", "reading": "ぼくたち", "meanings": ["we (informal)"]},
    ],
    "us": [
        {"kanji": "私たち", "reading": "わたしたち", "meanings": ["us", "we"]},
    ],
    "they": [
        {"kanji": "彼ら", "reading": "かれら", "meanings": ["they", "them"]},
    ],
    "them": [
        {"kanji": "彼ら", "reading": "かれら", "meanings": ["them", "they"]},
    ],
    "my": [
        {"kanji": "私の", "reading": "わたしの", "meanings": ["my"]},
    ],
    "your": [
        {"kanji": "あなたの", "reading": "あなたの", "meanings": ["your"]},
    ],
}


def search_english_word(keyword: str, limit: int = 10, context_words: Optional[set] = None) -> List[Dict]:
    clean_keyword = keyword.strip().lower()
    if not clean_keyword:
        return []

    if clean_keyword in ENGLISH_PRONOUNS_MAP:
        pronoun_results = []
        for p in ENGLISH_PRONOUNS_MAP[clean_keyword][:limit]:
            word_key = p["kanji"]
            reading_key = p["reading"]
            in_ctx = False
            exact_ctx = False
            if context_words:
                if (word_key in context_words) or (reading_key in context_words):
                    in_ctx = True
                    exact_ctx = True
                elif any(is_kanji(ch) and any(ch in cw for cw in context_words) for ch in word_key):
                    in_ctx = True
            pronoun_results.append({
                "kanji": word_key,
                "reading": reading_key,
                "meanings": p["meanings"],
                "in_context": in_ctx,
                "exact_context": exact_ctx,
            })
        return pronoun_results

    conn = _get_jmdict_connection()
    if not conn:
        return []

    results = []
    try:
        cursor = conn.cursor()

        stems = get_english_candidate_stems(clean_keyword)
        variations = []
        for s in stems:
            variations.append(s)
            variations.append(f"to {s}")
            variations.append(f"to be {s}")
            variations.append(f"to become {s}")

        unique_vars = list(dict.fromkeys(variations))
        placeholders = ", ".join(["?"] * len(unique_vars))

        like_stems = stems[:4]
        like_clauses = " OR ".join(["g.content LIKE ? COLLATE NOCASE" for _ in like_stems])
        query = f"""
        SELECT DISTINCT
            e.id AS entry_id,
            k.keb AS kanji,
            r.reb AS reading,
            g.content AS translation,
            CASE WHEN pr.id_entry IS NOT NULL THEN 1 ELSE 0 END AS is_common
        FROM gloss g
        JOIN sense s ON g.id_sense = s.id
        JOIN entry e ON s.id_entry = e.id
        LEFT JOIN k_ele k ON e.id = k.id_entry
        LEFT JOIN r_ele r ON e.id = r.id_entry
        LEFT JOIN pri pr ON e.id = pr.id_entry
        WHERE (g.content IN ({placeholders}) COLLATE NOCASE OR {like_clauses})
          AND (g.id_lang = '1' OR g.id_lang IS NULL OR g.id_lang = 'eng')
          AND (k.keb IS NOT NULL OR r.reb IS NOT NULL)
        ORDER BY is_common DESC, (k.keb IS NOT NULL) DESC
        LIMIT ?
        """
        like_patterns = [f"{s} (%" for s in like_stems]
        params = list(unique_vars) + like_patterns + [limit * 15]
        cursor.execute(query, params)
        rows = cursor.fetchall()

        if len(rows) < 3 and len(clean_keyword) >= 4:
            pattern = f"{clean_keyword}%"
            fallback_query = """
            SELECT DISTINCT
                e.id AS entry_id,
                k.keb AS kanji,
                r.reb AS reading,
                g.content AS translation,
                CASE WHEN pr.id_entry IS NOT NULL THEN 1 ELSE 0 END AS is_common
            FROM gloss g
            JOIN sense s ON g.id_sense = s.id
            JOIN entry e ON s.id_entry = e.id
            LEFT JOIN k_ele k ON e.id = k.id_entry
            LEFT JOIN r_ele r ON e.id = r.id_entry
            LEFT JOIN pri pr ON e.id = pr.id_entry
            WHERE g.content LIKE ? COLLATE NOCASE
              AND (g.id_lang = '1' OR g.id_lang IS NULL OR g.id_lang = 'eng')
              AND (k.keb IS NOT NULL OR r.reb IS NOT NULL)
            ORDER BY is_common DESC
            LIMIT ?
            """
            cursor.execute(fallback_query, (pattern, limit * 5))
            rows.extend(cursor.fetchall())

        grouped: Dict[tuple, Dict] = {}
        for entry_id, kanji, reading, translation, is_common in rows:
            word_key = kanji if kanji else reading
            reading_key = reading if reading else kanji
            key = (word_key, reading_key)
            if key not in grouped:
                grouped[key] = {
                    "kanji": word_key,
                    "reading": reading_key,
                    "meanings": [],
                    "is_common": bool(is_common),
                    "in_context": False,
                }
            if translation and translation not in grouped[key]["meanings"]:
                grouped[key]["meanings"].append(translation)

            context_score = 0
            if context_words:
                if (word_key in context_words) or (reading_key in context_words):
                    context_score = 2
                elif any(is_kanji(ch) and any(ch in cw for cw in context_words) for ch in word_key):
                    context_score = 1

            grouped[key]["context_score"] = context_score
            grouped[key]["in_context"] = context_score > 0

        sorted_items = sorted(
            grouped.values(),
            key=lambda x: (x["context_score"], x["is_common"]),
            reverse=True
        )

        for item in sorted_items[:limit]:
            results.append({
                "kanji": item["kanji"],
                "reading": item["reading"],
                "meanings": item["meanings"][:4],
                "in_context": item["in_context"],
                "exact_context": item["context_score"] == 2,
            })
    except Exception:
        pass
    finally:
        conn.close()

    return results
