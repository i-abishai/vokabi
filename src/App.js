import React, { useState, useEffect, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ProfileScreen from './components/ProfileScreen';
import HomeScreen from './components/HomeScreen';
import WordsScreen from './components/WordsScreen';
import StatsScreen from './components/StatsScreen';
import StudyScreen from './components/StudyScreen';
import { initialVocabulary, availableBadges, stickerOptions } from './constants';

function App() {
  // Screen navigation
  const [screen, setScreen] = useState('welcome');

  // Profile state
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('vokabi_profile');
    return saved ? JSON.parse(saved) : { name: '', emoji: '' };
  });

  // Game state
  const [vocabulary] = useState(initialVocabulary);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Study state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyCards, setStudyCards] = useState([]);

  // Progress state
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

  // Word tracking
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

  // Sticker popup state
  const [recentSticker, setRecentSticker] = useState(null);
  const [showStickerPopup, setShowStickerPopup] = useState(false);

  // Analytics
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

  // Check if profile exists on initial load
  useEffect(() => {
    if (profile.name) {
      setScreen('home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save data to localStorage
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

    let categoryWords = vocabulary.filter(word => word.category === category);

    const processedCards = categoryWords.map(word => {
        let front, back, frontLang, backLang;

        const isEnFront = mode === 'en-tr' ? true :
                          mode === 'tr-en' ? false :
                          Math.random() > 0.5;

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

    const shuffledCards = processedCards.sort(() => Math.random() - 0.5);

    setStudyCards(shuffledCards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setScreen('study');

    updateAnalytics('sessionStart', { category });
  };

  const speakWord = (text, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
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

  // Render screens using components
  if (screen === 'welcome') {
    return <WelcomeScreen onStart={() => setScreen('profile')} />;
  }

  if (screen === 'profile') {
    return <ProfileScreen onCreateProfile={handleCreateProfile} />;
  }

  if (screen === 'home') {
    return (
      <HomeScreen
        profile={profile}
        level={level}
        score={score}
        streak={streak}
        stars={stars}
        categories={categories}
        vocabulary={vocabulary}
        badges={badges}
        showStickerPopup={showStickerPopup}
        recentSticker={recentSticker}
        onStartStudy={startStudying}
        onNavigate={setScreen}
      />
    );
  }

  if (screen === 'study') {
    return (
      <StudyScreen
        studyCards={studyCards}
        currentCardIndex={currentCardIndex}
        isFlipped={isFlipped}
        streak={streak}
        stars={stars}
        favorites={favorites}
        onFlipCard={setIsFlipped}
        onAnswer={handleAnswer}
        onSpeakWord={speakWord}
        onToggleFavorite={toggleFavorite}
        onNavigate={setScreen}
      />
    );
  }

  if (screen === 'words') {
    return (
      <WordsScreen
        vocabulary={vocabulary}
        categories={categories}
        favorites={favorites}
        difficultWords={difficultWords}
        easyWords={easyWords}
        onSpeakWord={speakWord}
        onToggleFavorite={toggleFavorite}
        onNavigate={setScreen}
      />
    );
  }

  if (screen === 'stats') {
    return (
      <StatsScreen
        vocabulary={vocabulary}
        analytics={analytics}
        badges={badges}
        onNavigate={setScreen}
      />
    );
  }

  return null;
}

export default App;
