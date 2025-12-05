import React, { useState, useMemo } from 'react';
import { Home, BookOpen, BarChart3, Volume2, Heart } from 'lucide-react';

const WordsScreen = ({
  vocabulary,
  categories,
  favorites,
  difficultWords,
  easyWords,
  onSpeakWord,
  onToggleFavorite,
  onNavigate
}) => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const displayWords = useMemo(() => {
    let filtered = vocabulary;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(w => w.category === filterCategory);
    }

    if (filterType === 'favorites') {
      filtered = filtered.filter(w => favorites.includes(w.id));
    } else if (filterType === 'difficult') {
      filtered = filtered.filter(w => difficultWords.includes(w.id));
    } else if (filterType === 'easy') {
      filtered = filtered.filter(w => easyWords.includes(w.id));
    }

    return filtered;
  }, [vocabulary, filterCategory, filterType, favorites, difficultWords, easyWords]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pb-20">
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 rounded-b-3xl shadow-lg mb-6">
        <h2 className="text-3xl font-bold text-white mb-4">Tüm Kelimeler</h2>

        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${
                filterCategory === 'all'
                  ? 'bg-white text-purple-600'
                  : 'bg-white bg-opacity-20 text-white'
              }`}
            >
              Tümü
            </button>
            {categories.map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-white text-purple-600'
                    : 'bg-white bg-opacity-20 text-white'
                }`}
              >
                {cat.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-full font-semibold text-sm ${
                filterType === 'all'
                  ? 'bg-white text-purple-600'
                  : 'bg-white bg-opacity-20 text-white'
              }`}
            >
              Tümü
            </button>
            <button
              type="button"
              onClick={() => setFilterType('favorites')}
              className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1 ${
                filterType === 'favorites'
                  ? 'bg-white text-purple-600'
                  : 'bg-white bg-opacity-20 text-white'
              }`}
            >
              <Heart className="w-4 h-4" />
              Favoriler ({favorites.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('difficult')}
              className={`px-4 py-2 rounded-full font-semibold text-sm ${
                filterType === 'difficult'
                  ? 'bg-white text-purple-600'
                  : 'bg-white bg-opacity-20 text-white'
              }`}
            >
              Zorlar ({difficultWords.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('easy')}
              className={`px-4 py-2 rounded-full font-semibold text-sm ${
                filterType === 'easy'
                  ? 'bg-white text-purple-600'
                  : 'bg-white bg-opacity-20 text-white'
              }`}
            >
              Kolay ({easyWords.length})
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-3">
        {displayWords.map(word => (
          <div key={word.id} className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-purple-600">{word.english}</h3>
                  <button
                    type="button"
                    onClick={() => onSpeakWord(word.english, 'en-US')}
                    className="p-1 hover:bg-purple-100 rounded-full transition-all"
                  >
                    <Volume2 className="w-5 h-5 text-purple-400" />
                  </button>
                </div>
                <p className="text-purple-400 italic text-sm mb-1">{word.pronunciation}</p>
                <p className="text-lg text-purple-600">{word.turkish}</p>
                <p className="text-xs text-purple-400 mt-2">{word.category}</p>
              </div>
              <button
                type="button"
                onClick={() => onToggleFavorite(word.id)}
                className="p-2"
              >
                <Heart
                  className={`w-6 h-6 ${
                    favorites.includes(word.id) ? 'text-pink-500' : 'text-purple-300'
                  }`}
                  fill={favorites.includes(word.id) ? 'currentColor' : 'none'}
                />
              </button>
            </div>
            {difficultWords.includes(word.id) && (
              <div className="mt-2 inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                Zor kelime
              </div>
            )}
            {easyWords.includes(word.id) && (
              <div className="mt-2 inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                Kolay kelime
              </div>
            )}
          </div>
        ))}

        {displayWords.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-purple-400 text-lg">Kelime bulunamadı</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-purple-200 px-6 py-3">
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-semibold">Ana Sayfa</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('words')}
            className="flex flex-col items-center gap-1 text-purple-600"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-semibold">Kelimeler</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('stats')}
            className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-600"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-semibold">İstatistikler</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordsScreen;
