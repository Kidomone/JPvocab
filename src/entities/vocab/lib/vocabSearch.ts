import type { VocabItem } from '../model/types';


export function katakanaToHiragana(str: string): string {
  if (!str) return '';
  return str.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

const ROMAJI_TABLE: [RegExp, string][] = [
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

  [/a/gi, 'あ'], [/i/gi, 'い'], [/u/gi, 'う'], [/e/gi, 'え'], [/o/gi, 'お'],

  [/n'/gi, 'ん'], [/nn/gi, 'ん'], [/n(?![aiueoy])/gi, 'ん'],
];

export function romajiToHiragana(text: string): string {
  if (!text) return '';
  let res = text.trim();

  res = res.replace(/([bcdfghjklmpqrstvwxyz])\1/gi, 'っ$1');

  for (const [pattern, kana] of ROMAJI_TABLE) {
    res = res.replace(pattern, kana);
  }

  return res;
}

export function matchVocabItem(item: VocabItem, query: string): boolean {
  const clean = query.trim().toLowerCase();
  if (!clean) return true;

  const itemWordLower = item.word.toLowerCase();
  const itemMeaningLower = item.meaning.toLowerCase();
  const itemNotesLower = item.notes.toLowerCase();
  const itemReadingLower = (item.reading || '').toLowerCase();

  if (
    itemWordLower.includes(clean) ||
    itemMeaningLower.includes(clean) ||
    itemNotesLower.includes(clean) ||
    itemReadingLower.includes(clean)
  ) {
    return true;
  }

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

  return false;
}

export function filterVocabList(items: VocabItem[], query: string): VocabItem[] {
  if (!query || !query.trim()) return items;
  return items.filter((item) => matchVocabItem(item, query));
}
