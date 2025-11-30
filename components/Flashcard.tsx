import React, { useState, useEffect } from 'react';
import { Sparkles, Star } from 'lucide-react';
import { FlashcardSet } from '../types';

interface FlashcardProps {
  data: FlashcardSet;
  isFlipped: boolean;
  onFlip: () => void;
  onBookmark: () => void;
}

// Helper to parse **text** into bold spans
const HighlightedText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={index} className="highlight-word">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

const Flashcard: React.FC<FlashcardProps> = ({ data, isFlipped, onFlip, onBookmark }) => {
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

  // Reset local reveals when card changes or closes
  useEffect(() => {
    if (!isFlipped) {
      setRevealedIndices([]);
    }
  }, [isFlipped, data.id]);

  const toggleReveal = (index: number) => {
    setRevealedIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // Determine spacing based on word count to prevent scrolling
  const getSpacingClass = () => {
    if (data.words.length <= 2) return "gap-12";
    if (data.words.length === 3) return "gap-6";
    return "gap-3";
  };

  const getItemHeightClass = () => {
     if (data.words.length <= 2) return "h-1/2";
     if (data.words.length === 3) return "h-1/3";
     return "h-1/4";
  };

  return (
    <div 
      className="w-full h-full relative cursor-pointer group perspective-1000 select-none"
    >
      <div 
        className={`
          w-full h-full absolute top-0 left-0
          transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] transform-style-3d shadow-2xl rounded-2xl
        `}
        style={{
          transform: isFlipped ? 'rotateY(180deg) rotateX(2deg) scale(1.05)' : 'rotateY(0deg) scale(1)'
        }}
      >
        {/* === FRONT OF CARD === */}
        <div 
          onClick={onFlip}
          className={`
            absolute w-full h-full backface-hidden bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden border border-white/60 shadow-inner flex flex-col items-center justify-center p-6
            ${isFlipped ? 'pointer-events-none' : 'z-20 pointer-events-auto'}
          `}
        >
          
          <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
             <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark();
              }}
              className={`p-2 rounded-full transition-all hover:scale-110 active:scale-95 ${data.isBookmarked ? 'text-amber-400' : 'text-sage-200 hover:text-sage-400'}`}
              title="Bookmark"
            >
              <Star size={20} fill={data.isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>

           <div className="absolute top-4 left-4">
            <span className="bg-sage-100/50 text-sage-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-sage-100">
              {data.words.length} Words
            </span>
          </div>

          <div className={`w-full flex flex-col items-center justify-center ${getSpacingClass()}`}>
            {data.words.map((item, idx) => {
              const isRevealed = revealedIndices.includes(idx);
              return (
                <div 
                  key={idx} 
                  className="relative text-center w-full group/word"
                >
                  <h2 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReveal(idx);
                    }}
                    className="text-3xl font-serif font-bold text-sage-900 mb-1 tracking-tight group-hover/word:text-amber-700 transition-colors cursor-help"
                  >
                    {item.word}
                  </h2>
                  <div className="flex items-center justify-center gap-3 h-6">
                    <span className="text-sage-400 font-mono text-xs select-none">{item.phonetic}</span>
                    
                    {/* Reveal Button / Translation */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReveal(idx);
                      }}
                      className={`
                        px-2 py-0.5 rounded-md text-xs font-cn transition-all duration-300
                        ${isRevealed 
                          ? 'bg-amber-100 text-amber-800 shadow-sm cursor-default' 
                          : 'bg-sage-50 text-sage-300 hover:bg-sage-200 hover:text-sage-600 cursor-help hover:shadow-sm border border-transparent hover:border-sage-200'}
                      `}
                      title="Click word or button to reveal meaning"
                    >
                      {isRevealed ? item.translation : 'Show Meaning'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-6 text-sage-300 text-[10px] font-medium tracking-[0.2em] uppercase animate-pulse">
            Click Word to Peek • Flip for Details
          </div>
        </div>

        {/* === BACK OF CARD === */}
        <div 
          onClick={onFlip}
          className={`
            absolute w-full h-full backface-hidden rotate-y-180 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/60 shadow-inner flex flex-col
            ${!isFlipped ? 'pointer-events-none' : 'z-20 pointer-events-auto'}
          `}
        >
          
          <div className="absolute top-3 right-3 z-30">
             <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark();
              }}
              className={`p-2 rounded-full transition-all hover:scale-110 active:scale-95 ${data.isBookmarked ? 'text-amber-400' : 'text-sage-200 hover:text-sage-400'}`}
            >
              <Star size={18} fill={data.isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Scroll disabled, using flex layout to distribute space */}
          <div className="flex-1 flex flex-col p-5 h-full">
            {data.words.map((item, idx) => (
              <div 
                key={idx} 
                className={`
                  flex flex-col justify-center border-b border-gray-100/50 last:border-0 relative
                  ${getItemHeightClass()}
                  ${idx === 0 ? 'pt-0' : 'pt-2'}
                  ${idx === data.words.length - 1 ? 'pb-0' : 'pb-2'}
                `}
              >
                {/* Header Line: Word + Translation + Mnemonic */}
                <div className="flex items-baseline justify-between mb-1">
                    <div className="flex items-baseline gap-2">
                        <span className="font-serif font-bold text-sage-800 text-lg">{item.word}</span>
                        <span className="text-xs font-mono text-sage-400">{item.phonetic}</span>
                    </div>
                    <span className="font-cn font-bold text-amber-700 text-sm bg-amber-50 px-2 rounded-sm border border-amber-100/50">
                        {item.translation}
                    </span>
                </div>

                {/* Definition & Mnemonic (Compact) */}
                <div className="flex gap-2 mb-1.5">
                    <div className="flex-1 text-[11px] leading-snug text-gray-600 font-cn">
                        <span className="text-sage-500 font-bold mr-1">[释义]</span>
                        <HighlightedText text={item.chineseDefinition} />
                    </div>
                </div>

                <div className="bg-sage-50/80 rounded p-1.5 mb-1.5 border border-sage-100/60">
                    <div className="text-[11px] leading-relaxed text-sage-800 font-cn">
                        <Sparkles size={10} className="inline mr-1 text-amber-500" />
                        <HighlightedText text={item.chineseMnemonic} />
                    </div>
                </div>

                {/* Example (Bilingual) */}
                <div className="text-[10px] space-y-0.5 border-l-2 border-sage-200 pl-2">
                    <p className="text-sage-900 leading-tight">
                        <HighlightedText text={item.examples[0].en} />
                    </p>
                    <p className="text-gray-500 font-cn leading-tight">
                        <HighlightedText text={item.examples[0].cn} />
                    </p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;