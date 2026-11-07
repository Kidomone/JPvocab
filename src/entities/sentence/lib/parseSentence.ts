import type { ParsedToken } from '../model/types';

export function parseSentence(text: string): ParsedToken[] {
  if (!text || text.trim() === '') {
    return [];
  }

  const words = text.includes(' ')
    ? text.split(/\s+/).filter(Boolean)
    : text.match(/[\u4e00-\u9faf]+|[\u3040-\u309f]+|[\u30a0-\u30ff]+|[a-zA-Z0-9]+|[^\s]/g) || [text];

  return words.map((w, idx) => ({
    id: String(idx + 1),
    text: w,
    isClickable: true,
  }));
}

