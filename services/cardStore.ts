import { FlashcardSet } from '../types';
import { INITIAL_CARDS } from '../constants';

const STORAGE_KEY = 'mnemonic_flashcards_data';

export interface CardStore {
  getAll(): FlashcardSet[];
  save(set: FlashcardSet): void;
  delete(id: string): void;
  toggleBookmark(id: string): void;
  getRandom(): FlashcardSet | null;
  exportData(): string;
  importData(json: string): boolean;
  clearAll(): void;
}

class LocalStorageCardStore implements CardStore {
  private load(): FlashcardSet[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Initialize with default data if empty
        this.saveAll(INITIAL_CARDS);
        return INITIAL_CARDS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load cards', e);
      return INITIAL_CARDS;
    }
  }

  private saveAll(cards: FlashcardSet[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save cards', e);
    }
  }

  getAll(): FlashcardSet[] {
    return this.load();
  }

  save(set: FlashcardSet): void {
    const cards = this.load();
    const index = cards.findIndex(c => c.id === set.id);
    if (index >= 0) {
      cards[index] = set;
    } else {
      cards.push(set);
    }
    this.saveAll(cards);
  }

  delete(id: string): void {
    const cards = this.load().filter(c => c.id !== id);
    this.saveAll(cards);
  }

  toggleBookmark(id: string): void {
    const cards = this.load();
    const card = cards.find(c => c.id === id);
    if (card) {
      card.isBookmarked = !card.isBookmarked;
      this.saveAll(cards);
    }
  }

  getRandom(): FlashcardSet | null {
    const cards = this.load();
    if (cards.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
  }

  exportData(): string {
    return JSON.stringify(this.load(), null, 2);
  }

  importData(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (Array.isArray(data)) {
        // Basic validation could be added here
        this.saveAll(data);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const cardStore = new LocalStorageCardStore();
