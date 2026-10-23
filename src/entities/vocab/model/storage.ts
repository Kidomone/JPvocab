import type { VocabItem } from './types';
import type { WordDetail } from '../../word';
import { initialVocabList } from './mockData';

const VOCAB_STORAGE_KEY = 'jpvocab_saved_words';

export function loadVocabList(): VocabItem[] {
  try {
    const raw = localStorage.getItem(VOCAB_STORAGE_KEY);
    if (!raw) {
      saveVocabList(initialVocabList);
      return initialVocabList;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as VocabItem[];
    }
    return initialVocabList;
  } catch (err) {
    console.error('Failed to load vocabulary from storage:', err);
    return initialVocabList;
  }
}

export function saveVocabList(items: VocabItem[]): void {
  try {
    localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save vocabulary to storage:', err);
  }
}

export function isWordSaved(wordText: string): boolean {
  const list = loadVocabList();
  return list.some((item) => item.word.trim() === wordText.trim());
}

export function addWordToVocab(word: WordDetail, notes: string = ''): { list: VocabItem[]; alreadyExists: boolean } {
  const list = loadVocabList();
  const existing = list.find((item) => item.word.trim() === word.word.trim());
  if (existing) {
    return { list, alreadyExists: true };
  }

  const nextId = list.length > 0 ? Math.max(...list.map((i) => i.id)) + 1 : 1;
  const isEn = typeof window !== 'undefined' && localStorage.getItem('jpvocab_lang') === 'en';
  const readingPrefix = isEn ? 'reading:' : 'чтение:';
  const newItem: VocabItem = {
    id: nextId,
    word: word.word,
    meaning: word.meaning,
    notes: notes || (word.reading ? `${readingPrefix} ${word.reading}` : ''),
  };

  const updated = [newItem, ...list];
  saveVocabList(updated);
  return { list: updated, alreadyExists: false };
}

export function removeWordFromVocab(id: number): VocabItem[] {
  const list = loadVocabList();
  const updated = list.filter((item) => item.id !== id);
  saveVocabList(updated);
  return updated;
}

export function updateWordNotes(id: number, notes: string): VocabItem[] {
  const list = loadVocabList();
  const updated = list.map((item) => (item.id === id ? { ...item, notes } : item));
  saveVocabList(updated);
  return updated;
}

export function resetVocabToDefault(): VocabItem[] {
  saveVocabList(initialVocabList);
  return initialVocabList;
}

export function clearVocab(): VocabItem[] {
  saveVocabList([]);
  return [];
}
