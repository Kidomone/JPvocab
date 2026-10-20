import type { ParsedToken } from './types';
import { MOCK_WORD_DETAILS } from '../../word';

export const DEFAULT_SENTENCE = '今日は晴れになったですね';

export const DEFAULT_TRANSLATION_EN = "It turned out to be a sunny day, didn't it?";
export const DEFAULT_TRANSLATION_RU = 'Выдался солнечный денёк, не так ли?';

export const DEFAULT_TOKENS: ParsedToken[] = [
  { id: '1', text: '今日', isClickable: true, detail: MOCK_WORD_DETAILS['今日'] },
  { id: '2', text: 'は', isClickable: true, detail: MOCK_WORD_DETAILS['は'] },
  { id: '3', text: '晴れ', isClickable: true, detail: MOCK_WORD_DETAILS['晴れ'] },
  { id: '4', text: 'に', isClickable: true, detail: MOCK_WORD_DETAILS['に'] },
  { id: '5', text: 'なった', isClickable: true, detail: MOCK_WORD_DETAILS['なった'] },
  { id: '6', text: 'です', isClickable: true, detail: MOCK_WORD_DETAILS['です'] },
  { id: '7', text: 'ね', isClickable: true, detail: MOCK_WORD_DETAILS['ね'] },
];
