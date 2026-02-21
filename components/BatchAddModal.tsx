import React, { useState } from 'react';
import { X, Sparkles, Loader2, Layers } from 'lucide-react';

interface BatchAddModalProps {
  onClose: () => void;
  onAdd: (groups: string[]) => Promise<void>;
  isLoading: boolean;
}

const BatchAddModal: React.FC<BatchAddModalProps> = ({ onClose, onAdd, isLoading }) => {
  const [input, setInput] = useState('');
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const groups = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (groups.length > 0) {
        // We wrap the onAdd to track progress if needed, 
        // but since onAdd is passed from parent, the parent controls the loading state.
        // However, to show "Processing 1/5", we might need more coordination.
        // For simplicity, we'll just let the parent handle the async operation 
        // and use the generic isLoading prop for now.
        // If we want detailed progress, we'd need to move the loop here or pass a progress callback.
        // Let's stick to the interface: parent handles logic.
        await onAdd(groups);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        
        <div className="p-6 border-b border-sage-100 flex justify-between items-center bg-sage-50">
          <div className="flex items-center gap-2">
            <Layers className="text-sage-700" size={20} />
            <h2 className="text-lg font-serif font-bold text-sage-900">Batch Add Words</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-sage-400 hover:text-sage-700 transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sage-600 text-sm mb-4">
            Enter multiple groups of words. Each line will create a separate flashcard set.
            <br />
            <span className="text-xs text-sage-400">Format: Word1, Word2 (one group per line)</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Dominate, Nominate&#10;Intimidate, Imitate&#10;Affect, Effect"
                className="w-full p-4 h-48 rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500 transition-all text-base font-serif resize-none"
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
                  <span>Processing Batch...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate All Cards</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BatchAddModal;
