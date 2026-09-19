import type { ParsedToken, WordDetail } from './index';

export const DEFAULT_SENTENCE = '今日は晴れになったですね';

export const DEFAULT_TRANSLATION_EN = "It turned out to be a sunny day, didn't it?";
export const DEFAULT_TRANSLATION_RU = 'Выдался солнечный денёк, не так ли?';

export const TODAY_WORD_DETAIL: WordDetail = {
  word: '今日',
  reading: 'きょう, こんじつ, こんにち',
  meaning: 'today',
  components: [
    {
      kanji: '今',
      meaning: 'immediately',
      readings: 'いま, こん',
    },
    {
      kanji: '日',
      meaning: 'day',
      readings: 'か, ち, にち, ひ, んち',
    },
  ],
};

export const MOCK_WORD_DETAILS: Record<string, WordDetail> = {
  今日: TODAY_WORD_DETAIL,
  晴れ: {
    word: '晴れ',
    reading: 'はれ',
    meaning: 'clear weather, sunny',
    components: [
      {
        kanji: '晴',
        meaning: 'clear up',
        readings: 'は, セイ',
      },
    ],
  },
  は: {
    word: 'は',
    reading: 'は (wa)',
    meaning: 'topic marker',
    components: [],
  },
  に: {
    word: 'に',
    reading: 'に',
    meaning: 'result / target marker',
    components: [],
  },
  なった: {
    word: 'なった',
    reading: 'なった',
    meaning: 'became, turned into',
    components: [
      {
        kanji: '成',
        meaning: 'turn into, become',
        readings: 'な, セイ',
      },
    ],
  },
  です: {
    word: 'です',
    reading: 'です',
    meaning: 'to be (polite)',
    components: [],
  },
  ね: {
    word: 'ね',
    reading: 'ね',
    meaning: "isn't it? right?",
    components: [],
  },
};

export const DEFAULT_TOKENS: ParsedToken[] = [
  { id: '1', text: '今日', isClickable: true, detail: MOCK_WORD_DETAILS['今日'] },
  { id: '2', text: 'は', isClickable: true, detail: MOCK_WORD_DETAILS['は'] },
  { id: '3', text: '晴れ', isClickable: true, detail: MOCK_WORD_DETAILS['晴れ'] },
  { id: '4', text: 'に', isClickable: true, detail: MOCK_WORD_DETAILS['に'] },
  { id: '5', text: 'なった', isClickable: true, detail: MOCK_WORD_DETAILS['なった'] },
  { id: '6', text: 'です', isClickable: true, detail: MOCK_WORD_DETAILS['です'] },
  { id: '7', text: 'ね', isClickable: true, detail: MOCK_WORD_DETAILS['ね'] },
];

export function parseSentence(text: string): ParsedToken[] {
  if (!text || text.trim() === '' || text === DEFAULT_SENTENCE) {
    return DEFAULT_TOKENS;
  }


  let words: string[] = [];
  if (text.includes(' ')) {
    words = text.split(/\s+/).filter(Boolean);
  } else {
    const matched = text.match(/[\u4e00-\u9faf]+|[\u3040-\u309f]+|[\u30a0-\u30ff]+|[a-zA-Z0-9]+|[^\s]/g);
    words = matched ? matched : [text];
  }

  return words.map((w, idx) => {
    const known = MOCK_WORD_DETAILS[w];
    if (known) {
      return { id: String(idx + 1), text: w, isClickable: true, detail: known };
    }
    return {
      id: String(idx + 1),
      text: w,
      isClickable: true,
      detail: {
        word: w,
        reading: w,
        meaning: `definition of ${w}`,
        components: Array.from(w).map((char) => ({
          kanji: char,
          meaning: `kanji character: ${char}`,
          readings: 'он / кун',
        })),
      },
    };
  });
}
