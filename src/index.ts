export interface KanjiComponent {
  kanji: string;
  meaning: string;
  readings: string;
}

export interface WordDetail {
  word: string;
  reading: string;
  meaning: string;
  components: KanjiComponent[];
}

export interface ParsedToken {
  id: string;
  text: string;
  isClickable: boolean;
  detail?: WordDetail;
}
