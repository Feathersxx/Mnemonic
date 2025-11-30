export interface BilingualExample {
  en: string;
  cn: string;
}

export interface WordData {
  word: string;
  phonetic: string;
  translation: string;
  chineseDefinition: string; // Changed to Chinese
  chineseMnemonic: string;   // Changed to Chinese
  examples: BilingualExample[];
}

export interface FlashcardSet {
  id: string;
  createdAt: number;
  words: WordData[];
  isBookmarked?: boolean;
}