import React from 'react';
import {
  Home, BookOpen, BarChart3, Flame,
  Calendar, Target
} from 'lucide-react';

const StatsScreen = ({
  vocabulary,
  analytics,
  badges,
  onNavigate
}) => {
  const totalWords = vocabulary.length;
  const studiedWords = analytics.totalWordsStudied;
  const progressPercent = Math.round((studiedWords / totalWords) * 100);

  let totalCorrect = 0;
  let totalAttempts = 0;
  Object.values(analytics.accuracyByCategory).forEach(cat => {
    totalCorrect += cat.correct;
    totalAttempts += cat.total;
  });
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const topStrugglingWords = analytics.strugglingWords
    .sort((a, b) => b.mistakes - a.mistakes)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pb-20">
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 rounded-b-3xl shadow-lg mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">İstatistikler</h2>
        <p className="text-purple-100">Gelişimini takip et 📊</p>
      </div>

      <div className="px-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{studiedWords}</p>
                <p className="text-xs text-purple-400">Çalışılan Kelime</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{overallAccuracy}%</p>
                <p className="text-xs text-purple-400">Doğruluk</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{analytics.dailyStreak}</p>
                <p className="text-xs text-purple-400">Günlük Seri</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{analytics.studySessions}</p>
                <p className="text-xs text-purple-400">Toplam Oturum</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-purple-600">Genel İlerleme</h3>
            <span className="text-purple-600 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-4 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-purple-400 mt-2">
            {studiedWords} / {totalWords} kelime çalışıldı
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-bold text-purple-600 mb-4">Konulara Göre Başarı</h3>
          <div className="space-y-3">
            {Object.entries(analytics.accuracyByCategory).map(([category, data]) => {
              const accuracy = Math.round((data.correct / data.total) * 100);
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-600 font-semibold">
                      {category.split(' ')[0]}
                    </span>
                    <span className="text-sm text-purple-600 font-bold">{accuracy}%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full"
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {topStrugglingWords.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-purple-600 mb-4">En Çok Zorlandığın Kelimeler</h3>
            <div className="space-y-3">
              {topStrugglingWords.map(word => (
                <div key={word.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-purple-600">{word.english}</p>
                    <p className="text-sm text-purple-400">{word.turkish}</p>
                  </div>
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {word.mistakes} hata
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-bold text-purple-600 mb-4">Tüm Rozetler</h3>
          <div className="grid grid-cols-2 gap-4">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl text-center ${
                  badge.earned
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white ring-4 ring-yellow-300'
                    : 'bg-purple-50 text-purple-400'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="font-bold text-sm mb-1">{badge.name}</p>
                <p className="text-xs opacity-75">{badge.requirement}</p>
              </div>
            ))}
          </div>
        </div>

        {analytics.sessionHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-purple-600 mb-4">Son Çalışma Oturumları</h3>
            <div className="space-y-3">
              {analytics.sessionHistory.slice(-5).reverse().map((session, index) => {
                const date = new Date(session.date);
                const dateStr = date.toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-purple-600">{session.category}</p>
                      <p className="text-xs text-purple-400">{dateStr}</p>
                    </div>
                    <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {session.wordsStudied} kelime
                    </div>
                  </div>
                );
              })}
            </div>
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
            className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-600"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-semibold">Kelimeler</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('stats')}
            className="flex flex-col items-center gap-1 text-purple-600"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-semibold">İstatistikler</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;
