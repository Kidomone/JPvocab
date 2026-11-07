import re
from functools import lru_cache
from typing import Tuple, Optional
import requests
from deep_translator import GoogleTranslator, MyMemoryTranslator

LANG_NAME_MAP = {
    "ja": "japanese",
    "en": "english",
    "ru": "russian",
}

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
            "client": "gtx",
            "sl": source,
            "tl": target,
            "dt": "t",
            "q": text,
        }
        res = _session.get(url, params=params, timeout=2.0)
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
        src_name = LANG_NAME_MAP.get(source, "japanese" if source == "ja" else "english")
        tgt_name = LANG_NAME_MAP.get(target, "russian" if target == "ru" else ("english" if target == "en" else "japanese"))
        url = "https://api.mymemory.translated.net/get"
        params = {"q": text, "langpair": f"{src_name}|{tgt_name}"}
        res = _session.get(url, params=params, timeout=3.5)
        if res.status_code == 200:
            data = res.json()
            translated = data.get("responseData", {}).get("translatedText", "").strip()
            if translated and not translated.startswith("MYMEMORY WARNING"):
                return translated
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

