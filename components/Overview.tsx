import React, { useState, useMemo } from 'react';
import { FlashcardSet } from '../types';
import { LayoutGrid, ArrowRight, Search, Star, X } from 'lucide-react';

interface OverviewProps {
  cards: FlashcardSet[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

const Overview: React.FC<OverviewProps> = ({ cards, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = useMemo(() => {
    if (!searchTerm.trim()) return cards;
    const term = searchTerm.toLowerCase();
    
    return cards.filter(set => 
      set.words.some(word => 
        word.word.toLowerCase().includes(term) || 
        word.translation.includes(term) ||
        word.chineseDefinition.includes(term)
      )
    );
  }, [cards, searchTerm]);

  return (
    <div className="fixed inset-0 z-40 bg-white/50 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out] overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen">
        
        {/* Overview Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sticky top-0 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm z-20 border border-gray-100/50">
          <div className="flex items-center gap-2 text-sage-900 w-full md:w-auto">
            <LayoutGrid size={20} />
            <h2 className="text-xl font-serif font-bold">Library</h2>
            <span className="bg-sage-100 text-sage-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {filteredCards.length}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" />
                <input 
                  type="text" 
                  placeholder="Search words..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-sage-50 border border-sage-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all placeholder:text-sage-300"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600"
                  >
                    <X size={14} />
                  </button>
                )}
             </div>

            <button 
              onClick={onClose}
              className="text-sm font-medium text-sage-600 hover:text-sage-900 px-4 py-2 hover:bg-sage-50 rounded-lg transition-colors whitespace-nowrap"
            >
              Close
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
          {filteredCards.length > 0 ? (
            filteredCards.map((set, idx) => (
              <button
                key={set.id}
                onClick={() => onSelect(set.id)}
                className="group flex flex-col text-left bg-white rounded-xl p-5 border border-sage-100 shadow-sm hover:shadow-md hover:border-sage-300 transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Side Accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-sage-100 group-hover:bg-sage-400 transition-colors"></div>
                
                {/* Bookmark Badge */}
                {set.isBookmarked && (
                  <div className="absolute top-3 right-3 text-amber-400">
                    <Star size={14} fill="currentColor" />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-3 pr-6">
                  {set.words.map((w, wIdx) => (
                    <span key={wIdx} className="font-serif font-bold text-sage-900 text-lg">
                      {w.word}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto pt-3 border-t border-dashed border-gray-100 flex justify-between items-center w-full">
                  <div className="flex gap-2 flex-wrap">
                      {set.words.map((w, wIdx) => (
                      <span key={wIdx} className="text-xs text-gray-500 font-cn">
                          {w.translation}
                      </span>
                      ))}
                  </div>
                  <ArrowRight size={14} className="text-sage-300 group-hover:text-sage-600 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))
          ) : (
             <div className="col-span-full flex flex-col items-center justify-center py-20 text-sage-400">
                <Search size={48} className="mb-4 opacity-20" />
                <p>No cards found matching "{searchTerm}"</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;