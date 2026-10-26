export type Language = 'ru' | 'en';

export interface Translations {
  // Navigation / Header
  navVocab: string;
  navLogin: string;
  langSwitch: string;

  // Home Page
  homeTitle: string;
  homeInputPlaceholder: string;
  homeInputAria: string;
  analyzeButton: string;
  validationEmpty: string;
  validationLong: string;

  // Result Page
  resultInputPlaceholder: string;
  translationHeadingEn: string;
  translationHeadingJa: string;
  translationSentencePrefix: string;
  translationPrefixJa: string;
  addToVocab: string;
  inVocab: string;
  justAdded: string;
  tokenTooltip: string;
  noDataTitle: string;
  noDataDesc: string;
  resetDefaultBtn: string;
  toHomeBtn: string;
  wordAddedSnackbar: string;
  kanjiReadingsDefault: string;
  kanjiCharDefault: string;
  definitionDefault: string;

  // Vocab Page
  vocabTitle: string;
  vocabCount: string;
  vocabSearchPlaceholder: string;
  vocabSearchAria: string;
  vocabFoundCount: string;
  vocabNoResultsTitle: string;
  vocabNoResultsDesc: string;
  vocabResetSearchBtn: string;
  clearVocabBtn: string;
  emptyVocabTitle: string;
  emptyVocabDesc: string;
  analyzeTextBtn: string;
  tableNum: string;
  tableWord: string;
  tableMeaning: string;
  tableNotes: string;
  notesPlaceholder: string;
  deleteTooltip: string;
  wordDeletedSnackbar: string;
  vocabClearedSnackbar: string;

  // Login Page
  loginTitle: string;
  loginUsernameLabel: string;
  loginPasswordLabel: string;
  loginSubmitBtn: string;
  errUserRequired: string;
  errUserShort: string;
  errUserLong: string;
  errPassRequired: string;
  errPassShort: string;
}
