import React, { useState, useMemo, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, Shuffle, Clock, LayoutGrid, Palette, Star, Search } from 'lucide-react';
import { FlashcardSet } from './types';
import { INITIAL_CARDS } from './constants';
import { generateCardContent } from './services/geminiService';
import Flashcard from './components/Flashcard';
import AddWordModal from './components/AddWordModal';
import Overview from './components/Overview';

type SortMode = 'LATEST' | 'RANDOM';
type ViewMode = 'FLASHCARD' | 'OVERVIEW';

const BG_COLORS = [
  { name: 'Sage', value: '#f4f7f5' },
  { name: 'Cream', value: '#fdfbf7' },
  { name: 'Mist', value: '#f0f4f8' },
  { name: 'Pale Pink', value: '#fff5f5' },
  { name: 'Pale Amber', value: '#fffbf0' },
];

export default function App() {
  const [cards, setCards] = useState<FlashcardSet[]>(INITIAL_CARDS);
  const [sortMode, setSortMode] = useState<SortMode>('LATEST');
  const [viewMode, setViewMode] = useState<ViewMode>('FLASHCARD');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  
  // Animation state
  const [animClass, setAnimClass] = useState('');
  const [bgColor, setBgColor] = useState(BG_COLORS[0].value);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Apply background color to body for full immersion
  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
  }, [bgColor]);

  const toggleBookmark = (id: string) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, isBookmarked: !card.isBookmarked } : card
      )
    );
  };

  // Derived state for display order
  const displayCards = useMemo(() => {
    let filtered = [...cards];
    
    if (showBookmarkedOnly) {
      filtered = filtered.filter(c => c.isBookmarked);
    }

    if (sortMode === 'LATEST') {
      return filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      // In a real app, shuffle should be stable. For now, we re-shuffle on mode toggle.
      return filtered;
    }
  }, [cards, sortMode, showBookmarkedOnly]);

  // Ensure currentIndex is valid when filtering changes
  useEffect(() => {
    if (currentIndex >= displayCards.length && displayCards.length > 0) {
      setCurrentIndex(0);
    }
  }, [displayCards.length, currentIndex]);

  const currentCard = displayCards[currentIndex];

  const handleNext = () => {
    if (displayCards.length <= 1) return;
    setIsFlipped(false);
    setAnimClass('animate-swing-out');
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % displayCards.length);
      setAnimClass('animate-swing-in');
    }, 200); // Wait for half of exit animation
  };

  const handlePrev = () => {
    if (displayCards.length <= 1) return;
    setIsFlipped(false);
    setAnimClass('animate-swing-out');

    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + displayCards.length) % displayCards.length);
      setAnimClass('animate-swing-in');
    }, 200);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleSortMode = () => {
    setIsFlipped(false);
    setSortMode(prev => {
        if (prev === 'LATEST') {
            // Shuffle cards when switching to random
            setCards(prevCards => [...prevCards].sort(() => Math.random() - 0.5));
            return 'RANDOM';
        } else {
            // Cards will automatically resort by date in render via useMemo
            return 'LATEST';
        }
    });
    setCurrentIndex(0);
  };

  const handleAddWord = async (input: string) => {
    setIsLoading(true);
    try {
      const newCardSet = await generateCardContent(input);
      setCards(prev => [...prev, newCardSet]); 
      setIsModalOpen(false);
      
      // Reset to latest to show the new card first
      setSortMode('LATEST'); 
      setShowBookmarkedOnly(false);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error("Failed to generate card:", error);
      alert("Could not generate card. Please check the API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverviewSelect = (cardId: string) => {
    // Find index in current displayCards, or reset filters if not found
    let index = displayCards.findIndex(c => c.id === cardId);
    
    if (index === -1) {
      // If selected card isn't in current filtered view (e.g. searching in overview), switch view to show it
      // For simplicity, we just find it in the main list and reset filters if needed, 
      // but 'displayCards' passed to Overview should generally match.
      // However, Overview has its own search. 
      // Strategy: When selecting from Overview, we set the global index to match that card in the FULL list 
      // and reset filters so the user sees it.
      const fullIndex = cards.findIndex(c => c.id === cardId);
      if (fullIndex !== -1) {
         setShowBookmarkedOnly(false);
         setSortMode('LATEST'); // Simplify navigation
         // Need to wait for state update to calculate new index in 'LATEST' mode... 
         // simpler to just iterate the sorted full list logic here:
         const sorted = [...cards].sort((a,b) => b.createdAt - a.createdAt);
         const newIndex = sorted.findIndex(c => c.id === cardId);
         setCurrentIndex(newIndex);
      }
    } else {
      setCurrentIndex(index);
    }
    
    setViewMode('FLASHCARD');
    setIsFlipped(false);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center py-8 px-4 font-sans text-sage-900 transition-colors duration-500`} style={{ backgroundColor: bgColor }}>
      
      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-6 gap-4 z-10">
        <div className="flex items-center gap-2 select-none">
          <div className="w-10 h-10 bg-sage-900 rounded-xl text-white shadow-lg flex items-center justify-center">
            <span className="font-serif font-bold text-xl">M</span>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-sage-900 leading-none">Mnemonic</h1>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage-500">Mastery Cards</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-1.5 rounded-xl border border-white/60 shadow-sm">
           <button 
            onClick={() => setViewMode('OVERVIEW')}
            className="p-2 text-sage-600 hover:bg-white hover:text-sage-900 rounded-lg transition-all relative group"
            title="Overview"
          >
            <LayoutGrid size={18} />
             <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-sage-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Overview</span>
          </button>
          
          <div className="w-px h-4 bg-sage-200"></div>

          <button 
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            className={`p-2 rounded-lg transition-all relative group ${showBookmarkedOnly ? 'bg-amber-100 text-amber-600' : 'text-sage-600 hover:bg-white hover:text-sage-900'}`}
            title="Show Bookmarked Only"
          >
            <Star size={18} fill={showBookmarkedOnly ? "currentColor" : "none"} />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-sage-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Bookmarks</span>
          </button>

           <button 
            onClick={toggleSortMode}
            className="p-2 text-sage-600 hover:bg-white hover:text-sage-900 rounded-lg transition-all relative group"
            title={sortMode === 'LATEST' ? "Sorted by Newest" : "Random Shuffle"}
          >
            {sortMode === 'LATEST' ? <Clock size={18} /> : <Shuffle size={18} />}
             <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-sage-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">{sortMode === 'LATEST' ? 'Newest' : 'Random'}</span>
          </button>

          <button 
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={`p-2 rounded-lg transition-all relative ${showColorPicker ? 'bg-white text-sage-900 shadow-sm' : 'text-sage-600 hover:bg-white hover:text-sage-900'}`}
          >
            <Palette size={18} />
            
            {showColorPicker && (
              <div className="absolute top-full right-0 mt-3 p-2 bg-white/90 backdrop-blur rounded-xl shadow-xl border border-white/50 flex gap-2 animate-[fadeIn_0.2s_ease-out] z-50">
                {BG_COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setBgColor(c.value)}
                    className="w-6 h-6 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sage-900 text-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all font-medium text-sm ml-2"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </header>

      {/* Main Flashcard Area */}
      <main className="flex-1 w-full max-w-lg flex flex-col items-center justify-center relative perspective-1000">
        
        {displayCards.length > 0 && currentCard ? (
          <>
            {/* The Card Container with Swing Animation */}
            <div 
              key={currentCard.id}
              className={`w-full aspect-[3/4] max-h-[550px] relative z-10 ${animClass}`}
              onAnimationEnd={() => setAnimClass('')} 
            >
              <Flashcard 
                data={currentCard} 
                isFlipped={isFlipped} 
                onFlip={handleFlip} 
                onBookmark={() => toggleBookmark(currentCard.id)}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between w-full max-w-xs mt-8 z-20">
              <button 
                onClick={handlePrev}
                className="p-4 rounded-full bg-white/40 backdrop-blur-sm shadow-sm border border-white/40 text-sage-800 hover:bg-white hover:scale-110 hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
                aria-label="Previous card"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex flex-col items-center">
                 <span className="text-sage-900 font-serif font-bold text-xl tracking-tight">
                  {currentIndex + 1} <span className="text-sage-300 mx-1">/</span> {displayCards.length}
                </span>
              </div>

              <button 
                onClick={handleNext}
                className="p-4 rounded-full bg-white/40 backdrop-blur-sm shadow-sm border border-white/40 text-sage-800 hover:bg-white hover:scale-110 hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
                aria-label="Next card"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </>
        ) : (
           <div className="text-center text-sage-500 mt-20 p-8 bg-white/30 backdrop-blur rounded-2xl border border-white/40">
            <p className="mb-4 font-serif text-lg">No flashcards found.</p>
            {showBookmarkedOnly ? (
               <button onClick={() => setShowBookmarkedOnly(false)} className="text-sage-800 underline font-semibold">Show all cards</button>
            ) : (
               <button onClick={() => setIsModalOpen(true)} className="text-sage-800 underline font-semibold">Add your first word group</button>
            )}
           </div>
        )}

      </main>

      {/* Overview Overlay */}
      {viewMode === 'OVERVIEW' && (
        <Overview 
          cards={cards} 
          onSelect={handleOverviewSelect} 
          onClose={() => setViewMode('FLASHCARD')} 
        />
      )}

      {/* Add Word Modal */}
      {isModalOpen && (
        <AddWordModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddWord} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
}