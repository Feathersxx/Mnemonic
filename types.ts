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

export interface ReviewStats {
  reviewCount: number;
  lastReviewDate?: number;
  masteryLevel?: 'new' | 'learning' | 'mastered';
}

export interface FlashcardSet {
  id: string;
  title: string;
  createdAt: number;
  words: WordData[];
  isBookmarked?: boolean;
  reviewStats?: ReviewStats;
}