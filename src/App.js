import React, { useState, useEffect } from 'react';
import { Heart, Star, Trophy, Sparkles, Trash2, Shuffle, TrendingDown, ChevronLeft, ChevronRight, Home, Book, BarChart3 } from 'lucide-react';

const VokabiApp = () => {
  // Pre-loaded vocabulary with pronunciations
  const initialVocabulary = [
    { id: 1, english: 'Accuracy', turkish: 'Doğruluk, kesinlik', pronunciation: 'eküırısi' },
    { id: 2, english: 'Interaction', turkish: 'Etkileşim', pronunciation: 'interekşın' },
    { id: 3, english: 'Resolution', turkish: 'Çözüm veya Kararlılık', pronunciation: 'rezıluşın' },
    { id: 4, english: 'Motivated', turkish: 'Motive olmuş, istekli', pronunciation: 'motiveyted' },
    { id: 5, english: 'Maintain', turkish: 'Sürdürmek, korumak', pronunciation: 'meynteyn' },
    { id: 6, english: 'Conflict', turkish: 'Çatışma, anlaşmazlık', pronunciation: 'konflikt' },
    { id: 7, english: 'Overcome', turkish: 'Üstesinden gelmek, aşmak', pronunciation: 'ovırkam' },
    { id: 8, english: 'Enthusiasm', turkish: 'Coşku, heves', pronunciation: 'entüziazım' },
    { id: 9, english: 'Challenge', turkish: 'Zorluk, meydan okuma', pronunciation: 'çelınc' },
    { id: 10, english: 'Adapt', turkish: 'Uyum sağlamak, adapte olmak', pronunciation: 'ıdept' },
    { id: 11, english: 'Self-esteem', turkish: 'Öz saygı', pronunciation: 'self ıstiim' },
    { id: 12, english: 'Dyslexia', turkish: 'Disleksi (okuma güçlüğü)', pronunciation: 'disleksiı' },
    { id: 13, english: 'Implement', turkish: 'Uygulamak, hayata geçirmek', pronunciation: 'implıment' },
    { id: 14, english: 'Persevere', turkish: 'Azmetmek, direnmek', pronunciation: 'pörsıvir' },
    { id: 15, english: 'Collaborate', turkish: 'İşbirliği yapmak', pronunciation: 'kıleboureyt' },
    { id: 16, english: 'Confidence', turkish: 'Kendine güven', pronunciation: 'konfidıns' },
    { id: 17, english: 'Strategy', turkish: 'Strateji, yöntem', pronunciation: 'stretıci' },
    { id: 18, english: 'Improvement', turkish: 'Gelişme, ilerleme', pronunciation: 'impruvmınt' },
    { id: 19, english: 'Concentrate', turkish: 'Konsantre olmak', pronunciation: 'konsıntreyt' },
    { id: 20, english: 'Independence', turkish: 'Bağımsızlık', pronunciation: 'indipendıns' },
    { id: 21, english: 'Citizen', turkish: 'Vatandaş', pronunciation: 'sitizın' },
    { id: 22, english: 'Commemorate', turkish: 'Anmak (törenle)', pronunciation: 'kımemoreyt' },
    { id: 23, english: 'Victory', turkish: 'Zafer', pronunciation: 'viktıri' },
    { id: 24, english: 'Republic', turkish: 'Cumhuriyet', pronunciation: 'ripablik' },
    { id: 25, english: 'Democracy', turkish: 'Demokrasi', pronunciation: 'dimokrısi' }
  ];

  const [screen, setScreen] = useState('welcome');
  const [profile, setProfile] = useState({ name: '', emoji: '🌸' });
  const [vocabulary, setVocabulary] = useState(initialVocabulary);
  const [studyMode, setStudyMode] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [stars, setStars] = useState(0);
  const [badges, setBadges] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [difficultWords, setDifficultWords] = useState({});
  const [easyWords, setEasyWords] = useState({});
  const [answeredCorrect, setAnsweredCorrect] = useState(false);
  const [showReward, setShowReward] = useState(null);
  const [studyCards, setStudyCards] = useState([]);
  const [completedSets, setCompletedSets] = useState(0);

  const emojiOptions = ['🌸', '🌺', '💖', '✨', '🦋', '🌈', '🎀', '🍓', '🌙', '⭐', '💫', '🎨', '🧁', '🍰', '🎪'];
  const stickers = ['🌟', '💝', '🎉', '🏆', '👑', '💎', '🦄', '🌻', '🎭', '🎪'];

  const checkBadges = () => {
    const newBadges = [];
    if (score >= 100 && !badges.includes('first-100')) newBadges.push('first-100');
    if (streak >= 5 && !badges.includes('streak-5')) newBadges.push('streak-5');
    if (completedSets >= 1 && !badges.includes('first-set')) newBadges.push('first-set');
    if (stars >= 50 && !badges.includes('star-collector')) newBadges.push('star-collector');
    
    if (newBadges.length > 0) {
      setBadges([...badges, ...newBadges]);
      setShowReward({ type: 'badge', badge: newBadges[0] });
      setTimeout(() => setShowReward(null), 3000);
    }
  };

  useEffect(() => {
    if (score > 0 || streak > 0 || completedSets > 0 || stars > 0) {
      checkBadges();
    }
    const newLevel = Math.floor(score / 200) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setShowReward({ type: 'level', level: newLevel });
      setTimeout(() => setShowReward(null), 3000);
    }
  }, [score, streak, completedSets, stars]);

  const startStudy = (mode) => {
    setStudyMode(mode);
    let cards = [...vocabulary];
    if (mode === 'shuffle') {
      cards = cards.sort(() => Math.random() - 0.5);
    }
    setStudyCards(cards);
    setCurrentIndex(0);
    setFlipped(false);
    setAnsweredCorrect(false);
    setScreen('study');
  };

  const handleAnswer = (correct) => {
    if (answeredCorrect) return;
    
    setAnsweredCorrect(true);
    const currentWord = studyCards[currentIndex];
    
    if (correct) {
      const points = 10 + (streak * 2);
      setScore(score + points);
      setStreak(streak + 1);
      setStars(stars + 1);
      
      if (streak > 0 && (streak + 1) % 5 === 0) {
        setShowReward({ type: 'sticker', sticker: stickers[Math.floor(Math.random() * stickers.length)] });
        setTimeout(() => setShowReward(null), 2000);
      }
      
      if (currentIndex === studyCards.length - 1) {
        setCompletedSets(completedSets + 1);
        setScore(score + points + 50);
        setShowReward({ type: 'complete' });
        setTimeout(() => {
          setShowReward(null);
          setScreen('home');
        }, 3000);
      }
    } else {
      setStreak(0);
      const wordId = currentWord.id;
      setDifficultWords({
        ...difficultWords,
        [wordId]: (difficultWords[wordId] || 0) + 1
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < studyCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
      setAnsweredCorrect(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
      setAnsweredCorrect(false);
    }
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fid => fid !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const toggleDifficult = (id) => {
    setDifficultWords({
      ...difficultWords,
      [id]: difficultWords[id] ? 0 : 1
    });
  };

  const toggleEasy = (id) => {
    setEasyWords({
      ...easyWords,
      [id]: easyWords[id] ? 0 : 1
    });
  };

  const getDifficultWordsList = () => {
    return vocabulary
      .filter(w => difficultWords[w.id] >= 1)
      .sort((a, b) => (difficultWords[b.id] || 0) - (difficultWords[a.id] || 0));
  };

  // Welcome Screen
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-4">
        <div className="text-center">
          <div className="mb-6 animate-bounce">
            <div className="text-8xl">🌸</div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4" style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.3)' }}>
            vokabi
          </h1>
          <p className="text-white text-xl mb-8">
            Sihirli kelime maceran! ✨
          </p>
          <button
            type="button"
            onClick={() => setScreen('profile')}
            className="bg-white text-pink-600 px-12 py-4 rounded-full font-bold text-xl shadow-lg hover:scale-105 transition-transform"
          >
            Hadi Başlayalım! 🎀
          </button>
        </div>
      </div>
    );
  }

  // Profile Setup
  if (screen === 'profile') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
            Profilini Oluştur! 💖
          </h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              İsmin:
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-3 border-4 border-pink-300 rounded-2xl focus:outline-none focus:border-pink-500"
              placeholder="İsmini yaz..."
            />
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-3">
              Emojini Seç:
            </label>
            <div className="grid grid-cols-5 gap-3">
              {emojiOptions.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setProfile({ ...profile, emoji })}
                  className={`text-4xl p-3 rounded-xl transition-all ${
                    profile.emoji === emoji 
                      ? 'bg-pink-200 scale-110 shadow-lg' 
                      : 'bg-gray-100 hover:bg-pink-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (profile.name) {
                setScreen('home');
              } else {
                alert('Lütfen ismini yaz! 💕');
              }
            }}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-full font-bold text-xl shadow-lg hover:scale-105 transition-transform"
          >
            Öğrenmeye Başla! ✨
          </button>
        </div>
      </div>
    );
  }

  // Home Screen
  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-4">
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-5xl">{profile.emoji}</div>
              <div>
                <h2 className="text-2xl font-bold text-pink-600">
                  {profile.name}
                </h2>
                <p className="text-gray-600">Seviye {level}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-yellow-500 text-xl font-bold">
                <Star fill="currentColor" />
                {stars}
              </div>
              <div className="flex items-center gap-2 text-orange-500 font-bold">
                <Trophy size={20} />
                {score}
              </div>
            </div>
          </div>
          
          {streak > 0 && (
            <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-2 rounded-full text-center font-bold">
              🔥 {streak} Seri!
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          <div className="inline-block bg-white rounded-full p-6 shadow-xl animate-bounce">
            <div className="text-6xl">🦋</div>
          </div>
          <p className="text-white font-bold mt-2">
            Öğrenmeye hazır mısın? Hadi başlayalım! 💪
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => startStudy('en-tr')}
            className={`bg-white rounded-2xl p-6 shadow-xl transition-all ${
              studyMode === 'en-tr' 
                ? 'ring-4 ring-pink-400 scale-105' 
                : 'hover:scale-105'
            }`}
          >
            <div className="text-4xl mb-2">🇬🇧</div>
            <p className="font-bold text-pink-600">
              İngilizce → Türkçe
            </p>
          </button>
          
          <button
            type="button"
            onClick={() => startStudy('tr-en')}
            className={`bg-white rounded-2xl p-6 shadow-xl transition-all ${
              studyMode === 'tr-en' 
                ? 'ring-4 ring-purple-400 scale-105' 
                : 'hover:scale-105'
            }`}
          >
            <div className="text-4xl mb-2">🇹🇷</div>
            <p className="font-bold text-purple-600">
              Türkçe → İngilizce
            </p>
          </button>
        </div>

        <button
          type="button"
          onClick={() => startStudy('shuffle')}
          className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl p-6 shadow-xl transition-all mb-20 ${
            studyMode === 'shuffle' 
              ? 'ring-4 ring-yellow-400 scale-105' 
              : 'hover:scale-105'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <Shuffle />
            <span className="font-bold text-xl">Karışık Mod!</span>
          </div>
        </button>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-pink-300 p-4 z-50">
          <div className="flex justify-around max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="flex flex-col items-center text-pink-600 cursor-pointer p-2 bg-transparent border-0"
            >
              <Home size={28} />
              <span className="text-xs font-bold mt-1">Ana Sayfa</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('words')}
              className="flex flex-col items-center text-purple-600 cursor-pointer p-2 bg-transparent border-0"
            >
              <Book size={28} />
              <span className="text-xs font-bold mt-1">Kelimeler</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('stats')}
              className="flex flex-col items-center text-blue-600 cursor-pointer p-2 bg-transparent border-0"
            >
              <BarChart3 size={28} />
              <span className="text-xs font-bold mt-1">İstatistikler</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Words Management
  if (screen === 'words') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            📚 Kelime Listem
          </h2>

          <div className="space-y-3">
            {vocabulary.map(word => (
              <div key={word.id} className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-pink-600 text-lg">
                      {word.english}
                    </div>
                    <div className="text-purple-600">
                      {word.turkish}
                    </div>
                    <div className="text-gray-400 text-sm italic mt-1">
                      🔊 {word.pronunciation}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(word.id)}
                      className={`p-2 rounded-lg ${favorites.includes(word.id) ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-300'}`}
                      title="Sevdim"
                    >
                      <Heart fill={favorites.includes(word.id) ? 'currentColor' : 'none'} size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleEasy(word.id)}
                      className={`p-2 rounded-lg ${easyWords[word.id] ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'}`}
                      title="Kolay"
                    >
                      😊
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleDifficult(word.id)}
                      className={`p-2 rounded-lg ${difficultWords[word.id] ? 'bg-orange-100 text-orange-500' : 'bg-gray-100 text-gray-400'}`}
                      title="Zor"
                    >
                      😰
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-pink-300 p-4 z-50">
          <div className="flex justify-around max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="flex flex-col items-center text-gray-400 cursor-pointer p-2 bg-transparent border-0"
            >
              <Home size={28} />
              <span className="text-xs font-bold mt-1">Ana Sayfa</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('words')}
              className="flex flex-col items-center text-purple-600 cursor-pointer p-2 bg-transparent border-0"
            >
              <Book size={28} />
              <span className="text-xs font-bold mt-1">Kelimeler</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('stats')}
              className="flex flex-col items-center text-gray-400 cursor-pointer p-2 bg-transparent border-0"
            >
              <BarChart3 size={28} />
              <span className="text-xs font-bold mt-1">İstatistikler</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stats Screen
  if (screen === 'stats') {
    const difficultList = getDifficultWordsList();
    const favoriteWords = vocabulary.filter(w => favorites.includes(w.id));
    const easyWordsList = vocabulary.filter(w => easyWords[w.id]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            📊 İstatistiklerim
          </h2>

          <div className="bg-white rounded-3xl p-6 mb-6 shadow-xl">
            <h3 className="text-xl font-bold text-pink-600 mb-4">
              🏆 Rozetlerim
            </h3>
            {badges.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {badges.map(badge => (
                  <div key={badge} className="text-center">
                    <div className="text-4xl mb-1">🏆</div>
                    <div className="text-xs font-bold text-gray-600">
                      {badge === 'first-100' && '100 Puan!'}
                      {badge === 'streak-5' && '5 Seri!'}
                      {badge === 'first-set' && 'İlk Set!'}
                      {badge === 'star-collector' && '50 Yıldız!'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                Henüz rozet yok! Çalışmaya devam et! 💪
              </p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 mb-6 shadow-xl">
            <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
              <TrendingDown /> Zor Kelimeler
            </h3>
            {difficultList.length > 0 ? (
              <div className="space-y-2">
                {difficultList.map(word => (
                  <div key={word.id} className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                    <div>
                      <div className="font-bold text-gray-800">
                        {word.english} → {word.turkish}
                      </div>
                    </div>
                    <div className="text-red-600 font-bold">
                      ×{difficultWords[word.id]}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                Zor kelime yok! 🎉
              </p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 mb-6 shadow-xl">
            <h3 className="text-xl font-bold text-green-600 mb-4">
              😊 Kolay Kelimeler
            </h3>
            {easyWordsList.length > 0 ? (
              <div className="space-y-2">
                {easyWordsList.map(word => (
                  <div key={word.id} className="p-3 bg-green-50 rounded-xl">
                    <div className="font-bold text-gray-800">
                      {word.english} → {word.turkish}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                Henüz kolay kelime işaretlemedin!
              </p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2">
              <Heart fill="currentColor" /> Favori Kelimeler
            </h3>
            {favoriteWords.length > 0 ? (
              <div className="space-y-2">
                {favoriteWords.map(word => (
                  <div key={word.id} className="p-3 bg-pink-50 rounded-xl">
                    <div className="font-bold text-gray-800">
                      {word.english} → {word.turkish}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                Henüz favori yok! Ekle! 💕
              </p>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-pink-300 p-4 z-50">
          <div className="flex justify-around max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="flex flex-col items-center text-gray-400 cursor-pointer p-2 bg-transparent border-0"
            >
              <Home size={28} />
              <span className="text-xs font-bold mt-1">Ana Sayfa</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('words')}
              className="flex flex-col items-center text-gray-400 cursor-pointer p-2 bg-transparent border-0"
            >
              <Book size={28} />
              <span className="text-xs font-bold mt-1">Kelimeler</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('stats')}
              className="flex flex-col items-center text-blue-600 cursor-pointer p-2 bg-transparent border-0"
            >
              <BarChart3 size={28} />
              <span className="text-xs font-bold mt-1">İstatistikler</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Study Screen
  if (screen === 'study' && studyCards.length > 0) {
    const currentCard = studyCards[currentIndex];
    const showEnglish = studyMode === 'en-tr' || (studyMode === 'shuffle' && currentIndex % 2 === 0);
    const front = showEnglish ? currentCard.english : currentCard.turkish;
    const back = showEnglish ? currentCard.turkish : currentCard.english;
    const showPronunciationOnFront = showEnglish;
    const showPronunciationOnBack = !showEnglish;
    const pronunciation = currentCard.pronunciation;

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-4 flex flex-col">
        <div className="bg-white rounded-3xl p-4 mb-4 shadow-xl flex justify-between items-center">
          <button
            type="button"
            onClick={() => setScreen('home')}
            className="text-pink-600 font-bold cursor-pointer px-2 py-1 bg-transparent border-0"
          >
            ← Geri
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star fill="currentColor" size={20} />
              <span className="font-bold">{stars}</span>
            </div>
            {streak > 0 && (
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                🔥 {streak}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="inline-block bg-white rounded-full p-4 shadow-lg">
            <div className="text-4xl">🦋</div>
          </div>
          <p className="text-white font-bold mt-2">
            {!flipped ? "Görmek için dokun! ✨" : "Yaparsın! 💪"}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center mb-4">
          <div
            className={`relative w-full max-w-md h-80 transition-all duration-500 cursor-pointer ${
              flipped ? 'rotate-y-180' : ''
            }`}
            onClick={() => !answeredCorrect && setFlipped(!flipped)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div 
              className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border-8 border-pink-300"
              style={{ 
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #fff 0%, #ffe4f0 100%)'
              }}
            >
              <h2 className="text-5xl font-bold text-pink-600 text-center mb-4">
                {front}
              </h2>
              {showPronunciationOnFront && pronunciation && (
                <div className="text-gray-500 text-lg italic">
                  🔊 {pronunciation}
                </div>
              )}
            </div>
            
            <div 
              className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border-8 border-purple-300"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'linear-gradient(135deg, #fff 0%, #e4e4ff 100%)'
              }}
            >
              <h2 className="text-4xl font-bold text-purple-600 text-center mb-4">
                {back}
              </h2>
              {showPronunciationOnBack && pronunciation && (
                <div className="text-gray-500 text-lg italic mb-4">
                  🔊 {pronunciation}
                </div>
              )}
              
              {!answeredCorrect && (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnswer(false);
                    }}
                    className="bg-red-400 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  >
                    ❌ Yanlış
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnswer(true);
                    }}
                    className="bg-green-400 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  >
                    ✓ Doğru!
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => {
              if (currentIndex > 0) {
                handlePrevious();
              }
            }}
            className={`p-4 rounded-full ${
              currentIndex === 0 
                ? 'bg-white/30 text-white/50' 
                : 'bg-white text-pink-600 shadow-lg hover:scale-110 cursor-pointer'
            } transition-all`}
          >
            <ChevronLeft size={32} />
          </button>
          
          <div className="bg-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
            {currentIndex + 1} / {studyCards.length}
          </div>
          
          <button
            type="button"
            disabled={currentIndex === studyCards.length - 1 || !answeredCorrect}
            onClick={() => {
              if (currentIndex < studyCards.length - 1 && answeredCorrect) {
                handleNext();
              }
            }}
            className={`p-4 rounded-full ${
              currentIndex === studyCards.length - 1 || !answeredCorrect
                ? 'bg-white/30 text-white/50' 
                : 'bg-white text-purple-600 shadow-lg hover:scale-110 cursor-pointer'
            } transition-all`}
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {showReward && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl animate-bounce">
              {showReward.type === 'sticker' && (
                <>
                  <div className="text-8xl mb-4">{showReward.sticker}</div>
                  <p className="text-2xl font-bold text-pink-600">
                    Harika! +Çıkartma!
                  </p>
                </>
              )}
              {showReward.type === 'badge' && (
                <>
                  <div className="text-8xl mb-4">🏆</div>
                  <p className="text-2xl font-bold text-yellow-600">
                    Yeni Rozet Kazandın!
                  </p>
                </>
              )}
              {showReward.type === 'level' && (
                <>
                  <div className="text-8xl mb-4">👑</div>
                  <p className="text-2xl font-bold text-purple-600">
                    Seviye {showReward.level}!
                  </p>
                </>
              )}
              {showReward.type === 'complete' && (
                <>
                  <div className="text-8xl mb-4">🎉</div>
                  <p className="text-2xl font-bold text-green-600">
                    Set Tamamlandı! +50 Puan!
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
  
  * {
    font-family: 'Quicksand', 'Arial Rounded MT Bold', 'Helvetica Rounded', -apple-system, BlinkMacSystemFont, sans-serif !important;
  }
  
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-bounce {
    animation: bounce 2s infinite;
  }
  
  button {
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
    appearance: none;
  }
  
  button:focus {
    outline: none;
  }
  
  button:disabled {
    cursor: not-allowed;
  }
`;
document.head.appendChild(style);

export default VokabiApp;