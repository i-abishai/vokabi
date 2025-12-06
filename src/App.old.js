import React, { useState, useEffect, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ProfileScreen from './components/ProfileScreen';
import HomeScreen from './components/HomeScreen';
import WordsScreen from './components/WordsScreen';
import StatsScreen from './components/StatsScreen';
import StudyScreen from './components/StudyScreen';
import { initialVocabulary, emojiOptions, availableBadges, stickerOptions } from './constants';

// --- STATIC DATA NOW IMPORTED FROM CONSTANTS ---

function App() {
  // ALL STATE HOOKS MUST BE AT THE TOP - UNCONDITIONALLY
  const [screen, setScreen] = useState('welcome');
  
  // Lazy initialize state from localStorage to avoid useEffect dependency issues
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('vokabi_profile');
    return saved ? JSON.parse(saved) : { name: '', emoji: '' };
  });
  
  const [vocabulary] = useState(initialVocabulary); // No setter needed if static
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('vokabi_score');
    return saved ? parseInt(saved) : 0;
  });
  
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('vokabi_streak');
    return saved ? parseInt(saved) : 0;
  });
  
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('vokabi_level');
    return saved ? parseInt(saved) : 1;
  });
  
  const [stars, setStars] = useState(() => {
    const saved = localStorage.getItem('vokabi_stars');
    return saved ? parseInt(saved) : 0;
  });
  
  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('vokabi_badges');
    return saved ? JSON.parse(saved) : availableBadges;
  });
  
  const [studyCards, setStudyCards] = useState([]);
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('vokabi_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [difficultWords, setDifficultWords] = useState(() => {
    const saved = localStorage.getItem('vokabi_difficult');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [easyWords, setEasyWords] = useState(() => {
    const saved = localStorage.getItem('vokabi_easy');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [completedSets, setCompletedSets] = useState(() => {
    const saved = localStorage.getItem('vokabi_completed');
    return saved ? parseInt(saved) : 0;
  });
  
  const [recentSticker, setRecentSticker] = useState(null);
  const [showStickerPopup, setShowStickerPopup] = useState(false);
  
  const [analytics, setAnalytics] = useState(() => {
    const saved = localStorage.getItem('vokabi_analytics');
    return saved ? JSON.parse(saved) : {
      studySessions: 0,
      totalWordsStudied: 0,
      wordsMastered: 0,
      totalTimeStudied: 0,
      dailyStreak: 0,
      lastStudyDate: null,
      accuracyByCategory: {},
      sessionHistory: [],
      strugglingWords: []
    };
  });

  // Profile screen state
  const [tempName, setTempName] = useState('');
  const [tempEmoji, setTempEmoji] = useState('');
  
  // Words screen state
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Check if profile exists on initial load
  useEffect(() => {
    if (profile.name) {
      setScreen('home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (profile.name) {
      localStorage.setItem('vokabi_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('vokabi_score', score.toString());
  }, [score]);

  useEffect(() => {
    localStorage.setItem('vokabi_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('vokabi_level', level.toString());
  }, [level]);

  useEffect(() => {
    localStorage.setItem('vokabi_stars', stars.toString());
  }, [stars]);

  useEffect(() => {
    localStorage.setItem('vokabi_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('vokabi_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('vokabi_difficult', JSON.stringify(difficultWords));
  }, [difficultWords]);

  useEffect(() => {
    localStorage.setItem('vokabi_easy', JSON.stringify(easyWords));
  }, [easyWords]);

  useEffect(() => {
    localStorage.setItem('vokabi_completed', completedSets.toString());
  }, [completedSets]);

  useEffect(() => {
    localStorage.setItem('vokabi_analytics', JSON.stringify(analytics));
  }, [analytics]);

  const showRandomSticker = useCallback(() => {
    const randomSticker = stickerOptions[Math.floor(Math.random() * stickerOptions.length)];
    setRecentSticker(randomSticker);
    setShowStickerPopup(true);
    setTimeout(() => setShowStickerPopup(false), 2000);
  }, []);

  // Check for badge achievements
  const checkBadges = useCallback(() => {
    const newBadges = [...badges];
    let badgeEarned = false;

    if (!newBadges[0].earned && analytics.totalWordsStudied >= 1) {
      newBadges[0].earned = true;
      badgeEarned = true;
    }

    if (!newBadges[1].earned && analytics.totalWordsStudied >= 10) {
      newBadges[1].earned = true;
      badgeEarned = true;
    }

    if (!newBadges[2].earned && analytics.totalWordsStudied >= 50) {
      newBadges[2].earned = true;
      badgeEarned = true;
    }

    if (!newBadges[3].earned && analytics.totalWordsStudied >= 100) {
      newBadges[3].earned = true;
      badgeEarned = true;
    }

    if (!newBadges[4].earned && streak >= 3) {
      newBadges[4].earned = true;
      badgeEarned = true;
    }

    if (!newBadges[5].earned && streak >= 7) {
      newBadges[5].earned = true;
      badgeEarned = true;
    }

    if (!newBadges[6].earned && completedSets >= 1) {
      newBadges[6].earned = true;
      badgeEarned = true;
    }

    if (!newBadges[7].earned && level >= 5) {
      newBadges[7].earned = true;
      badgeEarned = true;
    }

    if (!newBadges[9].earned && favorites.length >= 10) {
      newBadges[9].earned = true;
      badgeEarned = true;
    }

    if (badgeEarned) {
      setBadges(newBadges);
      showRandomSticker();
    }
  }, [badges, analytics.totalWordsStudied, streak, completedSets, level, favorites.length, showRandomSticker]);

  useEffect(() => {
    checkBadges();
  }, [checkBadges]);

  useEffect(() => {
    const newLevel = Math.floor(score / 200) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      showRandomSticker();
    }
  }, [score, level, showRandomSticker]);

  const handleCreateProfile = (name, emoji) => {
    setProfile({ name, emoji });
    setScreen('home');
  };

  const startStudying = (category, mode) => {
    setSelectedCategory(category);
    // studyMode state removed as it wasn't being used in render, logic is handled here
    
    let categoryWords = vocabulary.filter(word => word.category === category);
    
    // Transform words to include fixed front/back sides based on mode
    const processedCards = categoryWords.map(word => {
        let front, back, frontLang, backLang;
        
        // Determine sides ONCE here to prevent looping/flipping bugs
        const isEnFront = mode === 'en-tr' ? true : 
                          mode === 'tr-en' ? false : 
                          Math.random() > 0.5; // 'shuffle' mode

        if (isEnFront) {
            front = word.english;
            back = word.turkish;
            frontLang = 'en';
            backLang = 'tr';
        } else {
            front = word.turkish;
            back = word.english;
            frontLang = 'tr';
            backLang = 'en';
        }

        return {
            ...word,
            front,
            back,
            frontLang,
            backLang
        };
    });

    // Shuffle the order of cards
    const shuffledCards = processedCards.sort(() => Math.random() - 0.5);
    
    setStudyCards(shuffledCards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setScreen('study');
    
    updateAnalytics('sessionStart', { category });
  };

  const speakWord = (text, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech to prevent overlap
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (isCorrect) => {
    const currentCard = studyCards[currentCardIndex];
    
    if (isCorrect) {
      const bonusPoints = streak >= 5 ? 15 : 10;
      setScore(score + bonusPoints);
      setStreak(streak + 1);
      setStars(stars + 1);
      
      if (!easyWords.includes(currentCard.id)) {
        setEasyWords([...easyWords, currentCard.id]);
      }
      
      if (difficultWords.includes(currentCard.id)) {
        setDifficultWords(difficultWords.filter(id => id !== currentCard.id));
      }
    } else {
      setStreak(0);
      
      if (!difficultWords.includes(currentCard.id)) {
        setDifficultWords([...difficultWords, currentCard.id]);
      }
    }
    
    updateAnalytics('wordStudied', { 
      word: currentCard, 
      correct: isCorrect,
      category: selectedCategory
    });
    
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      setCompletedSets(completedSets + 1);
      updateAnalytics('sessionEnd', { category: selectedCategory });
      setScreen('home');
    }
  };

  const toggleFavorite = (wordId) => {
    if (favorites.includes(wordId)) {
      setFavorites(favorites.filter(id => id !== wordId));
    } else {
      setFavorites([...favorites, wordId]);
    }
  };

  const updateAnalytics = (action, data) => {
    const newAnalytics = { ...analytics };
    const today = new Date().toDateString();
    
    switch (action) {
      case 'sessionStart':
        newAnalytics.studySessions += 1;
        
        if (newAnalytics.lastStudyDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (newAnalytics.lastStudyDate === yesterday.toDateString()) {
            newAnalytics.dailyStreak += 1;
          } else if (newAnalytics.lastStudyDate !== today) {
            newAnalytics.dailyStreak = 1;
          }
          
          newAnalytics.lastStudyDate = today;
        }
        break;
        
      case 'wordStudied':
        newAnalytics.totalWordsStudied += 1;
        
        if (!newAnalytics.accuracyByCategory[data.category]) {
          newAnalytics.accuracyByCategory[data.category] = { correct: 0, total: 0 };
        }
        newAnalytics.accuracyByCategory[data.category].total += 1;
        if (data.correct) {
          newAnalytics.accuracyByCategory[data.category].correct += 1;
        }
        
        if (!data.correct) {
          const existingWord = newAnalytics.strugglingWords.find(w => w.id === data.word.id);
          if (existingWord) {
            existingWord.mistakes += 1;
          } else {
            newAnalytics.strugglingWords.push({
              ...data.word,
              mistakes: 1
            });
          }
        }
        break;
        
      case 'sessionEnd':
        newAnalytics.sessionHistory.push({
          date: new Date().toISOString(),
          category: data.category,
          wordsStudied: studyCards.length
        });
        break;
        
      default:
        break;
    }
    
    setAnalytics(newAnalytics);
  };

  const categories = [...new Set(vocabulary.map(word => word.category))];

  const renderCurrentCard = () => {
    if (!studyCards[currentCardIndex]) return null;
    
    const card = studyCards[currentCardIndex];
    
    // Determine if pronunciation text should be shown (only for English words)
    const showFrontPronunciation = card.frontLang === 'en';
    const showBackPronunciation = card.backLang === 'en';
    
    // Determine if audio button should be shown (only for English words)
    const showAudioButton = (!isFlipped && card.frontLang === 'en') || (isFlipped && card.backLang === 'en');

    return (
      <div className="relative w-full max-w-md mx-auto">
        <div className="text-center mb-4 text-purple-600 font-semibold">
          {currentCardIndex + 1} / {studyCards.length}
        </div>
        
        <div 
          className="relative h-80 cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={() => setIsFlipped(!isFlipped)}
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
                    speakWord(card.english, 'en-US');
                }}
                className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
            >
                <Volume2 className="w-6 h-6 text-purple-600" />
            </button>
          )}
          
          <button
            type="button"
            onClick={() => toggleFavorite(card.id)}
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
              onClick={() => handleAnswer(false)}
              className="flex-1 bg-red-400 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <ThumbsDown className="w-5 h-5" />
              Bilmedim
            </button>
            <button
              type="button"
              onClick={() => handleAnswer(true)}
              className="flex-1 bg-green-400 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <ThumbsUp className="w-5 h-5" />
              Bildim
            </button>
          </div>
        )}
      </div>
    );
  };

  if (screen === 'welcome') {
    return <WelcomeScreen onStart={() => setScreen('profile')} />;
  }

  if (screen === 'profile') {
    return <ProfileScreen onCreateProfile={handleCreateProfile} />;
  }

  if (screen === 'home') {
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
                      onClick={() => startStudying(category, 'en-tr')}
                      className={`bg-gradient-to-br ${colors[index % 4]} text-white font-semibold py-3 px-2 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-sm`}
                    >
                      EN → TR
                    </button>
                    <button
                      type="button"
                      onClick={() => startStudying(category, 'tr-en')}
                      className={`bg-gradient-to-br ${colors[index % 4]} text-white font-semibold py-3 px-2 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-sm`}
                    >
                      TR → EN
                    </button>
                    <button
                      type="button"
                      onClick={() => startStudying(category, 'shuffle')}
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
              onClick={() => setScreen('home')}
              className="flex flex-col items-center gap-1 text-purple-600"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-semibold">Ana Sayfa</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('words')}
              className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-600"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs font-semibold">Kelimeler</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('stats')}
              className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-600"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs font-semibold">İstatistikler</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'study') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setScreen('home')}
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
          {renderCurrentCard()}
        </div>
      </div>
    );
  }

  if (screen === 'words') {
    let displayWords = vocabulary;
    
    if (filterCategory !== 'all') {
      displayWords = displayWords.filter(w => w.category === filterCategory);
    }
    
    if (filterType === 'favorites') {
      displayWords = displayWords.filter(w => favorites.includes(w.id));
    } else if (filterType === 'difficult') {
      displayWords = displayWords.filter(w => difficultWords.includes(w.id));
    } else if (filterType === 'easy') {
      displayWords = displayWords.filter(w => easyWords.includes(w.id));
    }

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
                      onClick={() => speakWord(word.english, 'en-US')}
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
                  onClick={() => toggleFavorite(word.id)}
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
              onClick={() => setScreen('home')}
              className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-600"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-semibold">Ana Sayfa</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('words')}
              className="flex flex-col items-center gap-1 text-purple-600"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs font-semibold">Kelimeler</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('stats')}
              className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-600"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs font-semibold">İstatistikler</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'stats') {
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
              onClick={() => setScreen('home')}
              className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-600"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-semibold">Ana Sayfa</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('words')}
              className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-600"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs font-semibold">Kelimeler</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('stats')}
              className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-600"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs font-semibold">İstatistikler</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;