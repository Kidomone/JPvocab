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

export const SUNNY_WORD_DETAIL: WordDetail = {
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
};

export const CAT_WORD_DETAIL: WordDetail = {
  word: '猫',
  reading: 'ねこ',
  meaning: 'cat',
  components: [
    {
      kanji: '猫',
      meaning: 'cat',
      readings: 'ビョウ, ねこ',
    },
  ],
};

export const MOCK_WORD_DETAILS: Record<string, WordDetail> = {
  今日: TODAY_WORD_DETAIL,
  晴れ: SUNNY_WORD_DETAIL,
  猫: CAT_WORD_DETAIL,
  cat: CAT_WORD_DETAIL,
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
  // English mappings for offline / mock analysis
  today: TODAY_WORD_DETAIL,
  sunny: SUNNY_WORD_DETAIL,
  day: {
    word: '日',
    reading: 'ひ, にち',
    meaning: 'day, sun',
    components: [
      {
        kanji: '日',
        meaning: 'day',
        readings: 'か, ち, にち, ひ',
      },
    ],
  },
  weather: {
    word: '天気',
    reading: 'てんき',
    meaning: 'weather',
    components: [
      {
        kanji: '天',
        meaning: 'heavens, sky',
        readings: 'テン, あめ',
      },
      {
        kanji: '気',
        meaning: 'spirit, atmosphere',
        readings: 'キ, ケ',
      },
    ],
  },
  became: {
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
  hello: {
    word: 'こんにちは',
    reading: 'こんにちは',
    meaning: 'hello, good day',
    components: [],
  },
  water: {
    word: '水',
    reading: 'みず',
    meaning: 'water',
    components: [
      {
        kanji: '水',
        meaning: 'water',
        readings: 'スイ, みず',
      },
    ],
  },
  book: {
    word: '本',
    reading: 'ほん',
    meaning: 'book, origin',
    components: [
      {
        kanji: '本',
        meaning: 'book, origin',
        readings: 'ホン, もと',
      },
    ],
  },
  friend: {
    word: '友達',
    reading: 'ともだち',
    meaning: 'friend',
    components: [
      {
        kanji: '友',
        meaning: 'friend',
        readings: 'ユウ, とも',
      },
      {
        kanji: '達',
        meaning: 'reach, attain, plural suffix',
        readings: 'タツ, だち',
      },
    ],
  },
};
