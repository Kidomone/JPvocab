import re
from functools import lru_cache
from typing import Tuple, Optional
import requests

_session = requests.Session()
_session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
})


def is_japanese_text(text: str) -> bool:
    return bool(re.search(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]', text))


def _google_translate_fast(text: str, source: str, target: str) -> Optional[str]:
    try:
        url = "https://translate.googleapis.com/translate_a/single"
        params = {
            "client": "dict-chrome-ex",
            "sl": source,
            "tl": target,
            "dt": "t",
            "q": text,
        }
        res = _session.get(url, params=params, timeout=4.5)
        if res.status_code == 200:
            data = res.json()
            if data and isinstance(data, list) and data[0]:
                chunks = [chunk[0] for chunk in data[0] if chunk and chunk[0]]
                translated = "".join(chunks).strip()
                if translated:
                    return translated
    except Exception:
        pass

    try:
        url = "https://clients5.google.com/translate_a/t"
        params = {
            "client": "dict-chrome-ex",
            "sl": source,
            "tl": target,
            "q": text,
        }
        res = _session.get(url, params=params, timeout=4.5)
        if res.status_code == 200:
            data = res.json()
            if isinstance(data, list) and data and isinstance(data[0], str):
                translated = data[0].strip()
                if translated:
                    return translated
    except Exception:
        pass

    try:
        url = "https://translate.googleapis.com/translate_a/single"
        params = {
            "client": "gtx",
            "sl": source,
            "tl": target,
            "dt": "t",
            "q": text,
        }
        res = _session.get(url, params=params, timeout=4.5)
        if res.status_code == 200:
            data = res.json()
            if data and isinstance(data, list) and data[0]:
                chunks = [chunk[0] for chunk in data[0] if chunk and chunk[0]]
                translated = "".join(chunks).strip()
                if translated:
                    return translated
    except Exception:
        pass

    return None


def _mymemory_translate(text: str, source: str, target: str) -> Optional[str]:
    try:
        src_code = source.lower()
        tgt_code = target.lower()
        url = "https://api.mymemory.translated.net/get"
        params = {"q": text, "langpair": f"{src_code}|{tgt_code}"}
        res = _session.get(url, params=params, timeout=5.0)
        if res.status_code == 200:
            data = res.json()
            translated = data.get("responseData", {}).get("translatedText", "")
            if translated and isinstance(translated, str):
                cleaned = translated.strip()
                if cleaned and not cleaned.startswith("MYMEMORY WARNING"):
                    return cleaned
    except Exception:
        pass
    return None


@lru_cache(maxsize=2048)
def _cached_translate(clean_text: str, source: str, target: str) -> str:
    fast_result = _google_translate_fast(clean_text, source=source, target=target)
    if fast_result:
        return fast_result

    mm_result = _mymemory_translate(clean_text, source=source, target=target)
    if mm_result:
        return mm_result

    return clean_text



def translate_text(text: str, source_lang: str = "auto", target_lang: str = None) -> Tuple[str, str, str]:
    clean_text = text.strip()
    if not clean_text:
        return "", source_lang, target_lang or "en"

    if source_lang == "auto" or not source_lang:
        if is_japanese_text(clean_text):
            source = "ja"
            target = target_lang or "en"
        else:
            source = "en"
            target = target_lang or "ja"
    else:
        source = source_lang
        target = target_lang or ("en" if source == "ja" else "ja")

    translated = _cached_translate(clean_text, source, target)
    return translated, source, target
