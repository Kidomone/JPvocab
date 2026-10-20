import type { ParsedToken } from '../model/types';
import { DEFAULT_SENTENCE, DEFAULT_TOKENS } from '../model/mockData';
import { MOCK_WORD_DETAILS } from '../../word';

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
