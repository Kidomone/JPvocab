import re
from typing import Tuple
from deep_translator import GoogleTranslator, MyMemoryTranslator

def is_japanese_text(text: str) -> bool:
    """Detect if text contains Japanese characters (Hiragana, Katakana, or Kanji)."""
    return bool(re.search(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]', text))

def translate_text(text: str, source_lang: str = "auto", target_lang: str = None) -> Tuple[str, str, str]:
    """
    Translates text between Japanese and English.
    Returns a tuple of (translated_text, resolved_source_lang, resolved_target_lang).
    """
    clean_text = text.strip()
    if not clean_text:
        return "", source_lang, target_lang or "en"

    if source_lang == "auto" or not source_lang:
        if is_japanese_text(clean_text):
            source = "ja"
            target = "en"
        else:
            source = "en"
            target = "ja"
    else:
        source = source_lang
        target = target_lang or ("en" if source == "ja" else "ja")

    try:
        translated = GoogleTranslator(source=source, target=target).translate(clean_text)
        return translated, source, target
    except Exception:
        try:
            src_name = "japanese" if source == "ja" else "english"
            tgt_name = "english" if target == "en" else "japanese"
            translated = MyMemoryTranslator(source=src_name, target=tgt_name).translate(clean_text)
            return translated, source, target
        except Exception as e:
            return f"[Translation error: {str(e)}]", source, target
