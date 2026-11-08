export interface FuriganaSegment {
  text: string;
  reading?: string;
}

function isKanji(ch: string): boolean {
  return /[\u4e00-\u9faf\u3400-\u4dbf]/.test(ch);
}

function isKana(ch: string): boolean {
  return /[\u3040-\u309f\u30a0-\u30ff]/.test(ch);
}

function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

export function parseFurigana(word: string, rawReading?: string): FuriganaSegment[] {
  if (!word) return [];
  if (!rawReading || !rawReading.trim()) return [{ text: word }];

  const reading = katakanaToHiragana(rawReading.trim());
  const cleanWord = word.trim();

  if (![...cleanWord].some(isKanji)) {
    return [{ text: cleanWord }];
  }


  if ([...cleanWord].every(isKanji)) {
    return [{ text: cleanWord, reading }];
  }

  let startW = 0;
  let startR = 0;
  while (
    startW < cleanWord.length &&
    startR < reading.length &&
    isKana(cleanWord[startW]) &&
    cleanWord[startW] === reading[startR]
  ) {
    startW++;
    startR++;
  }

  let endW = cleanWord.length - 1;
  let endR = reading.length - 1;
  while (
    endW >= startW &&
    endR >= startR &&
    isKana(cleanWord[endW]) &&
    cleanWord[endW] === reading[endR]
  ) {
    endW--;
    endR--;
  }

  while (endW >= startW && isKana(cleanWord[endW])) {
    if (endR >= startR && cleanWord[endW] === reading[endR]) {
      endW--;
      endR--;
    } else {
      endW--;
    }
  }

  const prefix = cleanWord.slice(0, startW);
  const midWord = cleanWord.slice(startW, endW + 1);
  const midReading = reading.slice(startR, endR + 1);
  const suffix = cleanWord.slice(endW + 1);

  const result: FuriganaSegment[] = [];
  if (prefix) result.push({ text: prefix });
  if (midWord) {
    const subSegments = splitMidWord(midWord, midReading);
    result.push(...subSegments);
  }
  if (suffix) result.push({ text: suffix });

  return result;
}

function splitMidWord(midWord: string, midReading: string): FuriganaSegment[] {
  if (!midWord) return [];
  if (![...midWord].some(isKanji) || !midReading) {
    return [{ text: midWord }];
  }
  if ([...midWord].every(isKanji)) {
    return [{ text: midWord, reading: midReading }];
  }

  let kanaStart = -1;
  for (let i = 0; i < midWord.length; i++) {
    if (isKana(midWord[i])) {
      kanaStart = i;
      break;
    }
  }

  if (kanaStart !== -1) {
    let kanaEnd = kanaStart;
    while (kanaEnd < midWord.length && isKana(midWord[kanaEnd])) {
      kanaEnd++;
    }
    const kanaRun = midWord.slice(kanaStart, kanaEnd);
    const rIdx = midReading.indexOf(kanaRun, 1);
    if (rIdx !== -1 && rIdx < midReading.length) {
      const leftWord = midWord.slice(0, kanaStart);
      const leftReading = midReading.slice(0, rIdx);
      const rightWord = midWord.slice(kanaEnd);
      const rightReading = midReading.slice(rIdx + kanaRun.length);

      const leftSegments = splitMidWord(leftWord, leftReading);
      const rightSegments = splitMidWord(rightWord, rightReading);

      return [...leftSegments, { text: kanaRun }, ...rightSegments];
    }
  }

  return [{ text: midWord, reading: midReading }];
}

