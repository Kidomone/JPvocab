import type { WordDetail } from './types';

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
