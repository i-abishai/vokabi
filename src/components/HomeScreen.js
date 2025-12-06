import React from 'react';
import { Home, BookOpen, BarChart3, Shuffle } from 'lucide-react';

const HomeScreen = ({
  profile,
  level,
  score,
  streak,
  stars,
  categories,
  vocabulary,
  badges,
  showStickerPopup,
  recentSticker,
  onStartStudy,
  onNavigate
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pb-20">
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{profile.emoji}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">Merhaba, {profile.name}!</h2>
              <p className="text-purple-100">Seviye {level}</p>
            </div>
          </div>
          <div className="text-4xl animate-bounce">🦋</div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-white font-bold">{score}</div>
            <div className="text-purple-100 text-xs">Puan</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-white font-bold">{streak}</div>
            <div className="text-purple-100 text-xs">Seri</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-white font-bold">{stars}</div>
            <div className="text-purple-100 text-xs">Yıldız</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-purple-600 mb-4">Konu Seç</h3>

        <div className="space-y-4">
          {categories.map((category, index) => {
            const categoryWords = vocabulary.filter(w => w.category === category);
            const colors = [
              'from-pink-400 to-pink-500',
              'from-purple-400 to-purple-500',
              'from-blue-400 to-blue-500',
              'from-green-400 to-green-500'
            ];

            return (
              <div key={category} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-purple-600">{category}</h4>
                    <p className="text-purple-400 text-sm">{categoryWords.length} kelime</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-400" />
                </div>

                <div className="text-sm text-purple-600 mb-4">
                  Çalışma şekli seç:
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onStartStudy(category, 'en-tr')}
                    className={`bg-gradient-to-br ${colors[index % 4]} text-white font-semibold py-3 px-2 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-sm`}
                  >
                    EN → TR
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartStudy(category, 'tr-en')}
                    className={`bg-gradient-to-br ${colors[index % 4]} text-white font-semibold py-3 px-2 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-sm`}
                  >
                    TR → EN
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartStudy(category, 'shuffle')}
                    className={`bg-gradient-to-br ${colors[index % 4]} text-white font-semibold py-3 px-2 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-1 text-sm`}
                  >
                    <Shuffle className="w-4 h-4" />
                    Mix
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-purple-600 mb-4">Rozetler</h3>
          <div className="grid grid-cols-5 gap-3">
            {badges.slice(0, 5).map((badge) => (
              <div
                key={badge.id}
                className={`bg-white rounded-xl p-3 text-center shadow-md ${
                  badge.earned ? 'ring-2 ring-yellow-400' : 'opacity-50'
                }`}
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <div className="text-xs text-purple-600 font-semibold">{badge.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showStickerPopup && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-9xl animate-bounce">
            {recentSticker}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-purple-200 px-6 py-3">
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1 text-purple-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-semibold">Ana Sayfa</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('words')}
            className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-600"
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

export default HomeScreen;
