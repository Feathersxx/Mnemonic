import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface AddWordModalProps {
  onClose: () => void;
  onAdd: (words: string) => void;
  isLoading: boolean;
}

const AddWordModal: React.FC<AddWordModalProps> = ({ onClose, onAdd, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        
        <div className="p-6 border-b border-sage-100 flex justify-between items-center bg-sage-50">
          <h2 className="text-lg font-serif font-bold text-sage-900">Add Word Group</h2>
          <button 
            onClick={onClose}
            className="text-sage-400 hover:text-sage-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sage-600 text-sm mb-6">
            Enter a single word or a group of confusing words separated by commas. Our AI will generate a comparative flashcard set.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="wordInput" className="block text-xs font-semibold text-sage-500 uppercase tracking-wide mb-2">
                Words (Comma separated)
              </label>
              <input
                id="wordInput"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Dominate, Nominate, Intimidate"
                className="w-full p-4 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500 transition-all text-lg font-serif"
                autoFocus
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-full py-4 bg-sage-900 hover:bg-sage-800 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Generating Mnemonics...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Flashcards</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWordModal;