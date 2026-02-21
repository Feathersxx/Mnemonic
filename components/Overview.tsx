import React, { useState, useMemo, useRef } from 'react';
import { FlashcardSet } from '../types';
import { LayoutGrid, ArrowRight, Search, Star, X, Trash2, Download, Upload } from 'lucide-react';

interface OverviewProps {
  cards: FlashcardSet[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onClose: () => void;
}

const Overview: React.FC<OverviewProps> = ({ cards, onSelect, onDelete, onExport, onImport, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCards = useMemo(() => {
    if (!searchTerm.trim()) return cards;
    const term = searchTerm.toLowerCase();
    
    return cards.filter(set => 
      (set.title && set.title.toLowerCase().includes(term)) ||
      set.words.some(word => 
        word.word.toLowerCase().includes(term) || 
        word.translation.includes(term) ||
        word.chineseDefinition.includes(term)
      )
    );
  }, [cards, searchTerm]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
    // Reset input so same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out] overflow-y-auto">
      <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen flex flex-col">
        
        {/* Overview Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sticky top-0 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm z-20 border border-gray-100/50">
          <div className="flex items-center gap-3 text-sage-900 w-full md:w-auto">
            <div className="p-2 bg-sage-100 rounded-lg">
              <LayoutGrid size={20} className="text-sage-700" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold leading-none">Library</h2>
              <span className="text-xs text-sage-500 font-medium">
                {filteredCards.length} card sets
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64 group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 group-focus-within:text-sage-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search words..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-sage-50 border border-sage-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:bg-white transition-all placeholder:text-sage-300"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 p-1 rounded-full hover:bg-sage-100 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
             </div>

             <div className="h-8 w-px bg-sage-200 mx-1 hidden md:block"></div>

             <button 
               onClick={onExport}
               className="p-2.5 text-sage-500 hover:text-sage-900 hover:bg-sage-50 rounded-xl transition-colors"
               title="Export Backup"
             >
               <Download size={20} />
             </button>

             <button 
               onClick={() => fileInputRef.current?.click()}
               className="p-2.5 text-sage-500 hover:text-sage-900 hover:bg-sage-50 rounded-xl transition-colors"
               title="Import Backup"
             >
               <Upload size={20} />
             </button>
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               accept=".json" 
               className="hidden" 
             />

             <div className="h-8 w-px bg-sage-200 mx-1 hidden md:block"></div>

            <button 
              onClick={onClose}
              className="p-2.5 text-sage-500 hover:text-sage-900 hover:bg-sage-50 rounded-xl transition-colors"
              title="Close Library"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
          {filteredCards.length > 0 ? (
            filteredCards.map((set) => (
              <div
                key={set.id}
                className="group relative flex flex-col bg-white rounded-2xl border border-sage-100 shadow-sm hover:shadow-lg hover:border-sage-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Card Content - Clickable */}
                <button
                  onClick={() => onSelect(set.id)}
                  className="flex-1 p-5 text-left w-full"
                >
                  {/* Bookmark Badge */}
                  {set.isBookmarked && (
                    <div className="absolute top-3 right-3 text-amber-400 z-10">
                      <Star size={16} fill="currentColor" />
                    </div>
                  )}
                  
                  {/* Title / Words */}
                  <div className="mb-4 pr-6">
                    {set.title ? (
                       <h3 className="font-serif font-bold text-sage-900 text-lg leading-tight mb-1 line-clamp-2">
                         {set.title}
                       </h3>
                    ) : (
                      <div className="flex flex-wrap gap-x-2 gap-y-1">
                        {set.words.map((w, wIdx) => (
                          <span key={wIdx} className="font-serif font-bold text-sage-900 text-lg">
                            {w.word}{wIdx < set.words.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-sage-400 mt-1">
                      {new Date(set.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Translations Preview */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                      {set.words.slice(0, 4).map((w, wIdx) => (
                      <span key={wIdx} className="text-[10px] px-1.5 py-0.5 bg-sage-50 text-sage-600 rounded border border-sage-100 font-cn">
                          {w.translation}
                      </span>
                      ))}
                      {set.words.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-sage-50 text-sage-400 rounded border border-sage-100">
                          +{set.words.length - 4}
                        </span>
                      )}
                  </div>
                </button>

                {/* Actions Footer */}
                <div className="px-4 py-3 bg-sage-50/50 border-t border-sage-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this card set?')) {
                        onDelete(set.id);
                      }
                    }}
                    className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Card Set"
                   >
                     <Trash2 size={14} />
                   </button>
                   
                   <button
                    onClick={() => onSelect(set.id)}
                    className="flex items-center gap-1 text-xs font-medium text-sage-600 hover:text-sage-900 transition-colors"
                   >
                     Study <ArrowRight size={12} />
                   </button>
                </div>
              </div>
            ))
          ) : (
             <div className="col-span-full flex flex-col items-center justify-center py-20 text-sage-400">
                <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="opacity-40" />
                </div>
                <p>No cards found matching "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-sage-600 text-sm hover:underline"
                >
                  Clear search
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;