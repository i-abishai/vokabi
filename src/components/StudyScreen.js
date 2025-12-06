import React from 'react';
import {
  ArrowLeft, Flame, Star, Volume2, Heart,
  ThumbsUp, ThumbsDown
} from 'lucide-react';

const StudyScreen = ({
  studyCards,
  currentCardIndex,
  isFlipped,
  streak,
  stars,
  favorites,
  onFlipCard,
  onAnswer,
  onSpeakWord,
  onToggleFavorite,
  onNavigate
}) => {
  if (!studyCards[currentCardIndex]) return null;

  const card = studyCards[currentCardIndex];

  // Determine if pronunciation text should be shown (only for English words)
  const showFrontPronunciation = card.frontLang === 'en';
  const showBackPronunciation = card.backLang === 'en';

  // Determine if audio button should be shown (only for English words)
  const showAudioButton = (!isFlipped && card.frontLang === 'en') || (isFlipped && card.backLang === 'en');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-purple-600" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-purple-600">{streak}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-purple-600">{stars}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative w-full max-w-md mx-auto">
          <div className="text-center mb-4 text-purple-600 font-semibold">
            {currentCardIndex + 1} / {studyCards.length}
          </div>

          <div
            className="relative h-80 cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={() => onFlipCard(!isFlipped)}
          >
            <div
              className={`relative w-full h-full transition-transform duration-600`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* FRONT FACE */}
              <div
                className="absolute w-full h-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-white text-4xl font-bold mb-4 text-center">
                  {card.front}
                </div>
                {showFrontPronunciation && (
                  <div className="text-pink-100 text-xl italic">
                    {card.pronunciation}
                  </div>
                )}
                <div className="mt-8 text-white text-sm opacity-75">
                  Çevirmek için tıkla 👆
                </div>
              </div>

              {/* BACK FACE */}
              <div
                className="absolute w-full h-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="text-white text-4xl font-bold mb-4 text-center">
                  {card.back}
                </div>
                {showBackPronunciation && (
                  <div className="text-blue-100 text-xl italic">
                    {card.pronunciation}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 justify-center h-16">
            {/* Audio Button - Only render if visible language is English */}
            {showAudioButton && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeakWord(card.english, 'en-US');
                }}
                className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
              >
                <Volume2 className="w-6 h-6 text-purple-600" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleFavorite(card.id)}
              className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 ${
                favorites.includes(card.id)
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-pink-500'
              }`}
            >
              <Heart className="w-6 h-6" fill={favorites.includes(card.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          {isFlipped && (
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => onAnswer(false)}
                className="flex-1 bg-red-400 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <ThumbsDown className="w-5 h-5" />
                Bilmedim
              </button>
              <button
                type="button"
                onClick={() => onAnswer(true)}
                className="flex-1 bg-green-400 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <ThumbsUp className="w-5 h-5" />
                Bildim
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyScreen;
