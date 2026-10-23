import type { ParsedToken } from '../model/types';
import { parseSentence } from '../lib/parseSentence';
import {
  DEFAULT_SENTENCE,
  DEFAULT_TRANSLATION_EN,
  DEFAULT_TRANSLATION_RU,
} from '../model/mockData';
import { MOCK_WORD_DETAILS } from '../../word';

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

  try {
    const res = await fetch('/api/analyze/sentence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: clean, source_lang: 'auto', lang }),
    });

    if (res.ok) {
      const data = await res.json();
      const tokens: ParsedToken[] = (data.tokens || []).map((t: BackendTokenDetail, idx: number) => {
        const isPunctuation = t.pos === 'Punctuation';
        const displayWord = t.target_word || t.surface;

        return {
          id: String(idx + 1),
          text: t.surface,
          isClickable: !isPunctuation,
          detail: !isPunctuation
            ? {
              word: displayWord,
              reading: t.reading || displayWord,
              meaning: t.meaning || (lang === 'en' ? `definition of ${t.surface}` : `значение: ${t.surface}`),
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
        japaneseText: data.japanese_text,
      };
    }
  } catch {
    // If backend is not running, fall back to local parsing
  }

  // Local fallback
  const isDefault = clean === DEFAULT_SENTENCE;
  const tokens = parseSentence(clean, lang);
  const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(clean);
  const known = MOCK_WORD_DETAILS[clean];

  let fallbackTranslation: string;
  if (isDefault) {
    fallbackTranslation = DEFAULT_TRANSLATION_EN;
  } else if (known) {
    fallbackTranslation = known.meaning;
  } else if (isJapanese) {
    fallbackTranslation = lang === 'en'
      ? `Sentence translation: "${clean}"`
      : `Перевод предложения: "${clean}"`;
  } else {
    fallbackTranslation = lang === 'en'
      ? `Japanese translation: "${clean}"`
      : `Перевод на японский: "${clean}"`;
  }

  return {
    tokens,
    originalText: clean,
    sourceLang: isJapanese ? 'ja' : 'en',
    targetLang: isJapanese ? 'en' : 'ja',
    translation: fallbackTranslation,
    secondaryTranslation: isDefault && lang === 'ru' ? DEFAULT_TRANSLATION_RU : undefined,
  };
}
