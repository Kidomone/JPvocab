import type { VocabItem } from '../model/types';
import { MOCK_WORD_DETAILS } from '../../word';

/**
 * Converts Katakana characters in a string to Hiragana
 */
export function katakanaToHiragana(str: string): string {
  if (!str) return '';
  return str.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

/**
 * Ordered mapping from Latin romaji syllables to Hiragana
 */
const ROMAJI_TABLE: [RegExp, string][] = [
  // 3-letter combos (digraphs)
  [/kya/gi, 'きゃ'], [/kyu/gi, 'きゅ'], [/kyo/gi, 'きょ'],
  [/sha/gi, 'しゃ'], [/shu/gi, 'しゅ'], [/sho/gi, 'しょ'],
  [/cha/gi, 'ちゃ'], [/chu/gi, 'ちゅ'], [/cho/gi, 'ちょ'],
  [/nya/gi, 'にゃ'], [/nyu/gi, 'にゅ'], [/nyo/gi, 'にょ'],
  [/hya/gi, 'ひゃ'], [/hyu/gi, 'ひゅ'], [/hyo/gi, 'ひょ'],
  [/mya/gi, 'みゃ'], [/myu/gi, 'みゅ'], [/myo/gi, 'みょ'],
  [/rya/gi, 'りゃ'], [/ryu/gi, 'りゅ'], [/ryo/gi, 'りょ'],
  [/gya/gi, 'ぎゃ'], [/gyu/gi, 'ぎゅ'], [/gyo/gi, 'ぎょ'],
  [/bya/gi, 'びゃ'], [/byu/gi, 'びゅ'], [/byo/gi, 'びょ'],
  [/pya/gi, 'ぴゃ'], [/pyu/gi, 'ぴゅ'], [/pyo/gi, 'ぴょ'],
  [/tsu/gi, 'つ'],   [/chi/gi, 'ち'],   [/shi/gi, 'し'],

  // 2-letter combos
  [/ka/gi, 'か'], [/ki/gi, 'き'], [/ku/gi, 'く'], [/ke/gi, 'け'], [/ko/gi, 'こ'],
  [/sa/gi, 'さ'], [/si/gi, 'し'], [/su/gi, 'す'], [/se/gi, 'せ'], [/so/gi, 'そ'],
  [/ta/gi, 'た'], [/ti/gi, 'ち'], [/tu/gi, 'つ'], [/te/gi, 'て'], [/to/gi, 'と'],
  [/na/gi, 'な'], [/ni/gi, 'に'], [/nu/gi, 'ぬ'], [/ne/gi, 'ね'], [/no/gi, 'の'],
  [/ha/gi, 'は'], [/hi/gi, 'ひ'], [/fu/gi, 'ふ'], [/hu/gi, 'ふ'], [/he/gi, 'へ'], [/ho/gi, 'ほ'],
  [/ma/gi, 'ま'], [/mi/gi, 'み'], [/mu/gi, 'む'], [/me/gi, 'め'], [/mo/gi, 'も'],
  [/ya/gi, 'や'], [/yu/gi, 'ゆ'], [/yo/gi, 'よ'],
  [/ra/gi, 'ら'], [/ri/gi, 'り'], [/ru/gi, 'る'], [/re/gi, 'れ'], [/ro/gi, 'ろ'],
  [/wa/gi, 'わ'], [/wo/gi, 'を'],
  [/ga/gi, 'が'], [/gi/gi, 'ぎ'], [/gu/gi, 'ぐ'], [/ge/gi, 'げ'], [/go/gi, 'ご'],
  [/za/gi, 'ざ'], [/ji/gi, 'じ'], [/zi/gi, 'じ'], [/zu/gi, 'ず'], [/ze/gi, 'ぜ'], [/zo/gi, 'ぞ'],
  [/da/gi, 'だ'], [/di/gi, 'ぢ'], [/du/gi, 'づ'], [/de/gi, 'で'], [/do/gi, 'ど'],
  [/ba/gi, 'ば'], [/bi/gi, 'び'], [/bu/gi, 'ぶ'], [/be/gi, 'べ'], [/bo/gi, 'ぼ'],
  [/pa/gi, 'ぱ'], [/pi/gi, 'ぴ'], [/pu/gi, 'ぷ'], [/pe/gi, 'ぺ'], [/po/gi, 'ぽ'],
  [/ja/gi, 'じゃ'], [/ju/gi, 'じゅ'], [/jo/gi, 'じょ'],

  // Single vowels
  [/a/gi, 'あ'], [/i/gi, 'い'], [/u/gi, 'う'], [/e/gi, 'え'], [/o/gi, 'お'],

  // Syllabic n
  [/n'/gi, 'ん'], [/nn/gi, 'ん'], [/n(?![aiueoy])/gi, 'ん'],
];

/**
 * Converts standard romaji text into Hiragana
 */
export function romajiToHiragana(text: string): string {
  if (!text) return '';
  let res = text.trim();

  // Sokuon (small tsu) for doubled consonants (e.g. tt, kk, pp, ss, etc.)
  res = res.replace(/([bcdfghjklmpqrstvwxyz])\1/gi, 'っ$1');

  for (const [pattern, kana] of ROMAJI_TABLE) {
    res = res.replace(pattern, kana);
  }

  return res;
}

/**
 * Checks whether a VocabItem matches a given search query in Japanese (kanji, hiragana, katakana, romaji)
 * or in English (meaning, notes, components).
 */
export function matchVocabItem(item: VocabItem, query: string): boolean {
  const clean = query.trim().toLowerCase();
  if (!clean) return true;

  const itemWordLower = item.word.toLowerCase();
  const itemMeaningLower = item.meaning.toLowerCase();
  const itemNotesLower = item.notes.toLowerCase();
  const itemReadingLower = (item.reading || '').toLowerCase();

  // 1. Direct text search across word, meaning, notes, reading
  if (
    itemWordLower.includes(clean) ||
    itemMeaningLower.includes(clean) ||
    itemNotesLower.includes(clean) ||
    itemReadingLower.includes(clean)
  ) {
    return true;
  }

  // 2. Kana-normalized search (Hiragana <-> Katakana)
  const queryHira = katakanaToHiragana(clean);
  const wordHira = katakanaToHiragana(item.word);
  const notesHira = katakanaToHiragana(item.notes);
  const readingHira = item.reading ? katakanaToHiragana(item.reading) : '';

  if (
    wordHira.includes(queryHira) ||
    notesHira.includes(queryHira) ||
    (readingHira && readingHira.includes(queryHira))
  ) {
    return true;
  }

  // 3. Romaji to Kana matching (for queries in English alphabet like "neko", "hare", "mizu")
  if (/^[a-z\s'-]+$/i.test(clean)) {
    const romajiKana = romajiToHiragana(clean);
    if (romajiKana && romajiKana !== clean) {
      if (
        wordHira.includes(romajiKana) ||
        notesHira.includes(romajiKana) ||
        (readingHira && readingHira.includes(romajiKana))
      ) {
        return true;
      }
    }
  }

  // 4. Detailed search via MOCK_WORD_DETAILS for known words
  const detail = MOCK_WORD_DETAILS[item.word];
  if (detail) {
    if (detail.meaning.toLowerCase().includes(clean)) return true;

    const detailHira = katakanaToHiragana(detail.reading);
    if (detailHira.includes(queryHira)) return true;

    if (/^[a-z\s'-]+$/i.test(clean)) {
      const romajiKana = romajiToHiragana(clean);
      if (romajiKana && detailHira.includes(romajiKana)) return true;
    }

    if (detail.components) {
      for (const comp of detail.components) {
        if (comp.kanji.toLowerCase().includes(clean)) return true;
        if (comp.meaning.toLowerCase().includes(clean)) return true;
        if (katakanaToHiragana(comp.readings).includes(queryHira)) return true;
      }
    }
  }

  return false;
}

/**
 * Filters a list of VocabItems by a search query
 */
export function filterVocabList(items: VocabItem[], query: string): VocabItem[] {
  if (!query || !query.trim()) return items;
  return items.filter((item) => matchVocabItem(item, query));
}
