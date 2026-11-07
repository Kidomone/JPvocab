import type { ParsedToken } from '../model/types';

export interface BackendTokenDetail {
  surface: string;
  lemma: string;
  reading: string;
  pos: string;
  meaning?: string;
  target_word?: string;
  components?: Array<{
    kanji: string;
    meaning: string;
    readings: string;
  }>;
}

export interface AnalyzeSentenceResult {
  tokens: ParsedToken[];
  originalText: string;
  sourceLang: 'ja' | 'en' | 'auto';
  targetLang: 'ja' | 'en';
  translation: string;
  secondaryTranslation?: string;
  japaneseText?: string;
}

export async function analyzeSentenceApi(
  text: string,
  lang: 'ru' | 'en' = 'ru'
): Promise<AnalyzeSentenceResult> {
  const clean = text.trim();
  if (!clean) {
    return {
      tokens: [],
      originalText: '',
      sourceLang: 'auto',
      targetLang: lang === 'en' ? 'en' : 'ja',
      translation: '',
    };
  }

  const res = await fetch('/api/analyze/sentence', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: clean, source_lang: 'auto', lang }),
  });

  if (!res.ok) {
    throw new Error(`Sentence analysis failed: ${res.status}`);
  }

  const data = await res.json();
  const tokens: ParsedToken[] = (data.tokens || []).map((t: BackendTokenDetail, idx: number) => {
    const isPunctuation = t.pos === 'Punctuation';
    const displayWord = t.target_word || t.surface;
    const hasMeaning = Boolean(t.meaning && t.meaning.trim());

    return {
      id: String(idx + 1),
      text: t.surface,
      isClickable: !isPunctuation,
      detail: !isPunctuation
        ? {
          word: displayWord,
          reading: t.reading || displayWord,
          meaning: hasMeaning ? t.meaning! : '',
          notFound: !hasMeaning,
          components: t.components || [],
        }
        : undefined,
    };
  });

  return {
    tokens,
    originalText: data.original_text,
    sourceLang: data.source_lang,
    targetLang: data.target_lang,
    translation: data.translation,
    secondaryTranslation: data.secondary_translation,
    japaneseText: data.japanese_text,
  };
}

