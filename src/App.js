import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, BookOpen, BarChart3, Star, Trophy, Flame, 
  Volume2, Heart, ThumbsUp, ThumbsDown, Shuffle, 
  ArrowRight, ArrowLeft, Award, Clock, TrendingUp,
  Calendar, Target, Zap
} from 'lucide-react';

function App() {
  // Initial vocabulary data - 100+ words in 4 categories
  const initialVocabulary = [
    // Category 1: Academic & General Vocabulary (~40 words)
    { id: 1, english: "Appreciate", turkish: "Takdir etmek", pronunciation: "ıprişieyt", category: "Academic & General" },
    { id: 2, english: "Bilingual", turkish: "İki dilli", pronunciation: "baylinguıl", category: "Academic & General" },
    { id: 3, english: "Communicate", turkish: "İletişim kurmak", pronunciation: "kımyunikeyt", category: "Academic & General" },
    { id: 4, english: "Culture", turkish: "Kültür", pronunciation: "kalçır", category: "Academic & General" },
    { id: 5, english: "Delicious", turkish: "Lezzetli", pronunciation: "dilişıs", category: "Academic & General" },
    { id: 6, english: "Education", turkish: "Eğitim", pronunciation: "ecukeyşın", category: "Academic & General" },
    { id: 7, english: "Environment", turkish: "Çevre", pronunciation: "invayrınmınt", category: "Academic & General" },
    { id: 8, english: "Experience", turkish: "Deneyim", pronunciation: "ikspiıriyıns", category: "Academic & General" },
    { id: 9, english: "Fascinating", turkish: "Büyüleyici", pronunciation: "fæsıneyting", category: "Academic & General" },
    { id: 10, english: "Friendly", turkish: "Arkadaş canlısı", pronunciation: "frendli", category: "Academic & General" },
    { id: 11, english: "Generous", turkish: "Cömert", pronunciation: "cenırıs", category: "Academic & General" },
    { id: 12, english: "Grateful", turkish: "Minnettar", pronunciation: "greytfıl", category: "Academic & General" },
    { id: 13, english: "Heritage", turkish: "Miras", pronunciation: "heritıc", category: "Academic & General" },
    { id: 14, english: "Imagination", turkish: "Hayal gücü", pronunciation: "imæcineyşın", category: "Academic & General" },
    { id: 15, english: "Incredible", turkish: "İnanılmaz", pronunciation: "inkredıbıl", category: "Academic & General" },
    { id: 16, english: "Journey", turkish: "Yolculuk", pronunciation: "cörni", category: "Academic & General" },
    { id: 17, english: "Knowledge", turkish: "Bilgi", pronunciation: "nolic", category: "Academic & General" },
    { id: 18, english: "Language", turkish: "Dil", pronunciation: "længuıc", category: "Academic & General" },
    { id: 19, english: "Literature", turkish: "Edebiyat", pronunciation: "litırıçır", category: "Academic & General" },
    { id: 20, english: "Memory", turkish: "Hafıza", pronunciation: "memıri", category: "Academic & General" },
    { id: 21, english: "Neighborhood", turkish: "Mahalle", pronunciation: "neybırhud", category: "Academic & General" },
    { id: 22, english: "Opinion", turkish: "Görüş", pronunciation: "ıpinyın", category: "Academic & General" },
    { id: 23, english: "Patient", turkish: "Sabırlı", pronunciation: "peyşınt", category: "Academic & General" },
    { id: 24, english: "Polite", turkish: "Kibar", pronunciation: "pılayt", category: "Academic & General" },
    { id: 25, english: "Practice", turkish: "Pratik yapmak", pronunciation: "præktis", category: "Academic & General" },
    { id: 26, english: "Proud", turkish: "Gururlu", pronunciation: "praud", category: "Academic & General" },
    { id: 27, english: "Recipe", turkish: "Tarif", pronunciation: "resıpi", category: "Academic & General" },
    { id: 28, english: "Respect", turkish: "Saygı", pronunciation: "rispekt", category: "Academic & General" },
    { id: 29, english: "Responsible", turkish: "Sorumlu", pronunciation: "rispansıbıl", category: "Academic & General" },
    { id: 30, english: "Schedule", turkish: "Program", pronunciation: "skecul", category: "Academic & General" },
    { id: 31, english: "Society", turkish: "Toplum", pronunciation: "sısayıti", category: "Academic & General" },
    { id: 32, english: "Tradition", turkish: "Gelenek", pronunciation: "trıdişın", category: "Academic & General" },
    { id: 33, english: "Unique", turkish: "Benzersiz", pronunciation: "yunik", category: "Academic & General" },
    { id: 34, english: "Volunteer", turkish: "Gönüllü", pronunciation: "valıntir", category: "Academic & General" },
    { id: 35, english: "Wisdom", turkish: "Bilgelik", pronunciation: "wizdım", category: "Academic & General" },
    { id: 36, english: "Achievement", turkish: "Başarı", pronunciation: "ıçivmınt", category: "Academic & General" },
    { id: 37, english: "Adventure", turkish: "Macera", pronunciation: "ıdvençır", category: "Academic & General" },
    { id: 38, english: "Challenge", turkish: "Zorluk", pronunciation: "çælınc", category: "Academic & General" },
    { id: 39, english: "Opportunity", turkish: "Fırsat", pronunciation: "apırtunıti", category: "Academic & General" },
    { id: 40, english: "Success", turkish: "Başarı", pronunciation: "sıkses", category: "Academic & General" },

    // Category 2: Cultural, National & Holiday Vocabulary (~30 words)
    { id: 41, english: "Anniversary", turkish: "Yıldönümü", pronunciation: "ænivörsıri", category: "Cultural & National" },
    { id: 42, english: "Birthday", turkish: "Doğum günü", pronunciation: "börthdey", category: "Cultural & National" },
    { id: 43, english: "Celebrate", turkish: "Kutlamak", pronunciation: "selıbreyt", category: "Cultural & National" },
    { id: 44, english: "Ceremony", turkish: "Tören", pronunciation: "serımoni", category: "Cultural & National" },
    { id: 45, english: "Christmas", turkish: "Noel", pronunciation: "krismıs", category: "Cultural & National" },
    { id: 46, english: "Costume", turkish: "Kostüm", pronunciation: "kastum", category: "Cultural & National" },
    { id: 47, english: "Decoration", turkish: "Süsleme", pronunciation: "dekıreyşın", category: "Cultural & National" },
    { id: 48, english: "Festival", turkish: "Festival", pronunciation: "festivıl", category: "Cultural & National" },
    { id: 49, english: "Fireworks", turkish: "Havai fişek", pronunciation: "fayıwörks", category: "Cultural & National" },
    { id: 50, english: "Flag", turkish: "Bayrak", pronunciation: "flæg", category: "Cultural & National" },
    { id: 51, english: "Gift", turkish: "Hediye", pronunciation: "gift", category: "Cultural & National" },
    { id: 52, english: "Holiday", turkish: "Tatil", pronunciation: "halidey", category: "Cultural & National" },
    { id: 53, english: "Independence", turkish: "Bağımsızlık", pronunciation: "indipendıns", category: "Cultural & National" },
    { id: 54, english: "National", turkish: "Ulusal", pronunciation: "næşınıl", category: "Cultural & National" },
    { id: 55, english: "Parade", turkish: "Geçit töreni", pronunciation: "pıreyd", category: "Cultural & National" },
    { id: 56, english: "Party", turkish: "Parti", pronunciation: "parti", category: "Cultural & National" },
    { id: 57, english: "Republic", turkish: "Cumhuriyet", pronunciation: "ripablik", category: "Cultural & National" },
    { id: 58, english: "Special", turkish: "Özel", pronunciation: "speşıl", category: "Cultural & National" },
    { id: 59, english: "Symbol", turkish: "Sembol", pronunciation: "simbıl", category: "Cultural & National" },
    { id: 60, english: "Thanksgiving", turkish: "Şükran Günü", pronunciation: "thænksgiving", category: "Cultural & National" },
    { id: 61, english: "Victory", turkish: "Zafer", pronunciation: "viktıri", category: "Cultural & National" },
    { id: 62, english: "Wedding", turkish: "Düğün", pronunciation: "weding", category: "Cultural & National" },
    { id: 63, english: "Anthem", turkish: "Marş", pronunciation: "ænthım", category: "Cultural & National" },
    { id: 64, english: "Monument", turkish: "Anıt", pronunciation: "manyumınt", category: "Cultural & National" },
    { id: 65, english: "Museum", turkish: "Müze", pronunciation: "myuziyım", category: "Cultural & National" },
    { id: 66, english: "Patriotic", turkish: "Vatansever", pronunciation: "peytriätik", category: "Cultural & National" },
    { id: 67, english: "Memorial", turkish: "Anma", pronunciation: "mımoriıl", category: "Cultural & National" },
    { id: 68, english: "Unity", turkish: "Birlik", pronunciation: "yunıti", category: "Cultural & National" },
    { id: 69, english: "Celebration", turkish: "Kutlama", pronunciation: "selıbreyşın", category: "Cultural & National" },
    { id: 70, english: "Historical", turkish: "Tarihi", pronunciation: "historikıl", category: "Cultural & National" },

    // Category 3: Descriptive, Travel & Phrases (~35 words)
    { id: 71, english: "Amazing", turkish: "Harika", pronunciation: "ımeyzing", category: "Descriptive & Travel" },
    { id: 72, english: "Beautiful", turkish: "Güzel", pronunciation: "byutıfıl", category: "Descriptive & Travel" },
    { id: 73, english: "Crowded", turkish: "Kalabalık", pronunciation: "kraudıd", category: "Descriptive & Travel" },
    { id: 74, english: "Dangerous", turkish: "Tehlikeli", pronunciation: "deyncırıs", category: "Descriptive & Travel" },
    { id: 75, english: "Exciting", turkish: "Heyecan verici", pronunciation: "iksayting", category: "Descriptive & Travel" },
    { id: 76, english: "Famous", turkish: "Ünlü", pronunciation: "feymıs", category: "Descriptive & Travel" },
    { id: 77, english: "Gorgeous", turkish: "Muhteşem", pronunciation: "gorcıs", category: "Descriptive & Travel" },
    { id: 78, english: "Horrible", turkish: "Korkunç", pronunciation: "horibıl", category: "Descriptive & Travel" },
    { id: 79, english: "Interesting", turkish: "İlginç", pronunciation: "intrısting", category: "Descriptive & Travel" },
    { id: 80, english: "Lovely", turkish: "Sevimli", pronunciation: "lavli", category: "Descriptive & Travel" },
    { id: 81, english: "Magnificent", turkish: "Görkemli", pronunciation: "mægnifisınt", category: "Descriptive & Travel" },
    { id: 82, english: "Peaceful", turkish: "Huzurlu", pronunciation: "pisfıl", category: "Descriptive & Travel" },
    { id: 83, english: "Pleasant", turkish: "Hoş", pronunciation: "plezınt", category: "Descriptive & Travel" },
    { id: 84, english: "Quiet", turkish: "Sessiz", pronunciation: "kwayıt", category: "Descriptive & Travel" },
    { id: 85, english: "Romantic", turkish: "Romantik", pronunciation: "rımæntik", category: "Descriptive & Travel" },
    { id: 86, english: "Spectacular", turkish: "Muhteşem", pronunciation: "spektækyulır", category: "Descriptive & Travel" },
    { id: 87, english: "Terrible", turkish: "Berbat", pronunciation: "teribıl", category: "Descriptive & Travel" },
    { id: 88, english: "Wonderful", turkish: "Harika", pronunciation: "wandırfıl", category: "Descriptive & Travel" },
    { id: 89, english: "Accommodation", turkish: "Konaklama", pronunciation: "ıkamıdeyşın", category: "Descriptive & Travel" },
    { id: 90, english: "Airport", turkish: "Havalimanı", pronunciation: "erport", category: "Descriptive & Travel" },
    { id: 91, english: "Destination", turkish: "Hedef", pronunciation: "destineyşın", category: "Descriptive & Travel" },
    { id: 92, english: "Luggage", turkish: "Bagaj", pronunciation: "lagıc", category: "Descriptive & Travel" },
    { id: 93, english: "Passport", turkish: "Pasaport", pronunciation: "pæsport", category: "Descriptive & Travel" },
    { id: 94, english: "Sightseeing", turkish: "Gezi", pronunciation: "saytsiyng", category: "Descriptive & Travel" },
    { id: 95, english: "Tourist", turkish: "Turist", pronunciation: "turist", category: "Descriptive & Travel" },
    { id: 96, english: "Vacation", turkish: "Tatil", pronunciation: "veykeyşın", category: "Descriptive & Travel" },
    { id: 97, english: "How are you?", turkish: "Nasılsın?", pronunciation: "hau ar yu", category: "Descriptive & Travel" },
    { id: 98, english: "Nice to meet you", turkish: "Tanıştığıma memnun oldum", pronunciation: "nays tu mit yu", category: "Descriptive & Travel" },
    { id: 99, english: "Excuse me", turkish: "Affedersiniz", pronunciation: "ikskyuz mi", category: "Descriptive & Travel" },
    { id: 100, english: "Thank you", turkish: "Teşekkür ederim", pronunciation: "thænk yu", category: "Descriptive & Travel" },
    { id: 101, english: "You're welcome", turkish: "Bir şey değil", pronunciation: "yur welkım", category: "Descriptive & Travel" },
    { id: 102, english: "I'm sorry", turkish: "Özür dilerim", pronunciation: "aym sori", category: "Descriptive & Travel" },
    { id: 103, english: "Good morning", turkish: "Günaydın", pronunciation: "gud morning", category: "Descriptive & Travel" },
    { id: 104, english: "Good night", turkish: "İyi geceler", pronunciation: "gud nayt", category: "Descriptive & Travel" },
    { id: 105, english: "See you later", turkish: "Sonra görüşürüz", pronunciation: "si yu leytır", category: "Descriptive & Travel" },

    // Category 4: Grammar Structures (~10 phrases)
    { id: 106, english: "I would like to", turkish: "İsterdim", pronunciation: "ay wud layk tu", category: "Grammar Structures" },
    { id: 107, english: "Could you please", turkish: "Lütfen ... yapabilir misiniz", pronunciation: "kud yu pliz", category: "Grammar Structures" },
    { id: 108, english: "I am going to", turkish: "Yapacağım", pronunciation: "ay æm going tu", category: "Grammar Structures" },
    { id: 109, english: "Have you ever", turkish: "Hiç ... yaptın mı", pronunciation: "hæv yu evır", category: "Grammar Structures" },
    { id: 110, english: "Would you mind", turkish: "Sakıncası var mı", pronunciation: "wud yu maynd", category: "Grammar Structures" },
    { id: 111, english: "I used to", turkish: "Eskiden ... yapardım", pronunciation: "ay yuzd tu", category: "Grammar Structures" },
    { id: 112, english: "As soon as", turkish: "... yapar yapmaz", pronunciation: "æz sun æz", category: "Grammar Structures" },
    { id: 113, english: "In order to", turkish: "... için", pronunciation: "in ordır tu", category: "Grammar Structures" },
    { id: 114, english: "Even though", turkish: "Rağmen", pronunciation: "ivın tho", category: "Grammar Structures" },
    { id: 115, english: "Neither... nor", turkish: "Ne... ne de", pronunciation: "niydhır... nor", category: "Grammar Structures" }
  ];

  // Emoji options for profile
  const emojiOptions = ['😊', '🎉', '🌟', '🦋', '🌸', '💖', '🎨', '📚', '🎯', '✨', '🌈', '🎭', '🎪', '🎨', '🦄'];

  // Available badges
  const availableBadges = [
    { id: 'first_word', name: 'İlk Kelime', icon: '🎯', requirement: 'İlk kelimeyi öğren', earned: false },
    { id: 'ten_words', name: '10 Kelime', icon: '⭐', requirement: '10 kelime öğren', earned: false },
    { id: 'fifty_words', name: '50 Kelime Ustası', icon: '🏆', requirement: '50 kelime öğren', earned: false },
    { id: 'hundred_words', name: '100 Kelime Kahramanı', icon: '👑', requirement: '100 kelime öğren', earned: false },
    { id: 'streak_3', name: '3 Günlük Çalışma', icon: '🔥', requirement: '3 gün üst üste çalış', earned: false },
    { id: 'streak_7', name: 'Bir Hafta', icon: '💪', requirement: '7 gün üst üste çalış', earned: false },
    { id: 'perfect_set', name: 'Mükemmel Set', icon: '💯', requirement: 'Bir seti %100 doğru tamamla', earned: false },
    { id: 'level_5', name: 'Seviye 5', icon: '🌟', requirement: '5. seviyeye ulaş', earned: false },
    { id: 'speed_master', name: 'Hız Ustası', icon: '⚡', requirement: '50 kelimeyi 10 dakikada çalış', earned: false },
    { id: 'favorites_10', name: 'Favori Toplayıcı', icon: '❤️', requirement: '10 favori ekle', earned: false }
  ];

  // Sticker options for rewards
  const stickerOptions = ['🌟', '✨', '💫', '⭐', '🌈', '🦋', '🌸', '💖', '🎉', '🏆', '👑', '💎'];

  // State management
  const [screen, setScreen] = useState('welcome');
  const [profile, setProfile] = useState({ name: '', emoji: '' });
  const [vocabulary, setVocabulary] = useState(initialVocabulary);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [studyMode, setStudyMode] = useState(null); // 'en-tr', 'tr-en', 'shuffle'
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [stars, setStars] = useState(0);
  const [badges, setBadges] = useState(availableBadges);
  const [studyCards, setStudyCards] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [difficultWords, setDifficultWords] = useState([]);
  const [easyWords, setEasyWords] = useState([]);
  const [completedSets, setCompletedSets] = useState(0);
  const [recentSticker, setRecentSticker] = useState(null);
  const [showStickerPopup, setShowStickerPopup] = useState(false);

  // Analytics state
  const [analytics, setAnalytics] = useState({
    studySessions: 0,
    totalWordsStudied: 0,
    wordsMastered: 0,
    totalTimeStudied: 0,
    dailyStreak: 0,
    lastStudyDate: null,
    accuracyByCategory: {},
    sessionHistory: [],
    strugglingWords: []
  });

  // Load saved data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('vokabi_profile');
    const savedScore = localStorage.getItem('vokabi_score');
    const savedStreak = localStorage.getItem('vokabi_streak');
    const savedLevel = localStorage.getItem('vokabi_level');
    const savedStars = localStorage.getItem('vokabi_stars');
    const savedBadges = localStorage.getItem('vokabi_badges');
    const savedFavorites = localStorage.getItem('vokabi_favorites');
    const savedDifficult = localStorage.getItem('vokabi_difficult');
    const savedEasy = localStorage.getItem('vokabi_easy');
    const savedCompleted = localStorage.getItem('vokabi_completed');
    const savedAnalytics = localStorage.getItem('vokabi_analytics');

    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setProfile(profileData);
      setScreen('home');
    }
    if (savedScore) setScore(parseInt(savedScore));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedStars) setStars(parseInt(savedStars));
    if (savedBadges) setBadges(JSON.parse(savedBadges));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedDifficult) setDifficultWords(JSON.parse(savedDifficult));
    if (savedEasy) setEasyWords(JSON.parse(savedEasy));
    if (savedCompleted) setCompletedSets(parseInt(savedCompleted));
    if (savedAnalytics) setAnalytics(JSON.parse(savedAnalytics));
  }, []);

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

  // Check for badge achievements
  const checkBadges = useCallback(() => {
    const newBadges = [...badges];
    let badgeEarned = false;

    // First word
    if (!newBadges[0].earned && analytics.totalWordsStudied >= 1) {
      newBadges[0].earned = true;
      badgeEarned = true;
    }

    // 10 words
    if (!newBadges[1].earned && analytics.totalWordsStudied >= 10) {
      newBadges[1].earned = true;
      badgeEarned = true;
    }

    // 50 words
    if (!newBadges[2].earned && analytics.totalWordsStudied >= 50) {
      newBadges[2].earned = true;
      badgeEarned = true;
    }

    // 100 words
    if (!newBadges[3].earned && analytics.totalWordsStudied >= 100) {
      newBadges[3].earned = true;
      badgeEarned = true;
    }

    // 3 day streak
    if (!newBadges[4].earned && streak >= 3) {
      newBadges[4].earned = true;
      badgeEarned = true;
    }

    // 7 day streak
    if (!newBadges[5].earned && streak >= 7) {
      newBadges[5].earned = true;
      badgeEarned = true;
    }

    // Perfect set
    if (!newBadges[6].earned && completedSets >= 1) {
      newBadges[6].earned = true;
      badgeEarned = true;
    }

    // Level 5
    if (!newBadges[7].earned && level >= 5) {
      newBadges[7].earned = true;
      badgeEarned = true;
    }

    // 10 favorites
    if (!newBadges[9].earned && favorites.length >= 10) {
      newBadges[9].earned = true;
      badgeEarned = true;
    }

    if (badgeEarned) {
      setBadges(newBadges);
      showRandomSticker();
    }
  }, [badges, analytics.totalWordsStudied, streak, completedSets, level, favorites.length]);

  // Check badges when relevant stats change
  useEffect(() => {
    checkBadges();
  }, [checkBadges]);

  // Level up logic
  useEffect(() => {
    const newLevel = Math.floor(score / 200) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      showRandomSticker();
    }
  }, [score, level]);

  // Show random sticker reward
  const showRandomSticker = () => {
    const randomSticker = stickerOptions[Math.floor(Math.random() * stickerOptions.length)];
    setRecentSticker(randomSticker);
    setShowStickerPopup(true);
    setTimeout(() => setShowStickerPopup(false), 2000);
  };

  // Handle profile creation
  const handleCreateProfile = (name, emoji) => {
    setProfile({ name, emoji });
    setScreen('home');
  };

  // Start studying with instant flow
  const startStudying = (category, mode) => {
    setSelectedCategory(category);
    setStudyMode(mode);
    
    let categoryWords = vocabulary.filter(word => word.category === category);
    
    // Shuffle array
    categoryWords = categoryWords.sort(() => Math.random() - 0.5);
    
    setStudyCards(categoryWords);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setScreen('study');
    
    // Track session start
    updateAnalytics('sessionStart', { category });
  };

  // Speak word using Web Speech API
  const speakWord = (text, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle card answer
  const handleAnswer = (isCorrect) => {
    const currentCard = studyCards[currentCardIndex];
    
    if (isCorrect) {
      const bonusPoints = streak >= 5 ? 15 : 10;
      setScore(score + bonusPoints);
      setStreak(streak + 1);
      setStars(stars + 1);
      
      // Add to easy words
      if (!easyWords.includes(currentCard.id)) {
        setEasyWords([...easyWords, currentCard.id]);
      }
      
      // Remove from difficult words if present
      if (difficultWords.includes(currentCard.id)) {
        setDifficultWords(difficultWords.filter(id => id !== currentCard.id));
      }
    } else {
      setStreak(0);
      
      // Add to difficult words
      if (!difficultWords.includes(currentCard.id)) {
        setDifficultWords([...difficultWords, currentCard.id]);
      }
    }
    
    // Update analytics
    updateAnalytics('wordStudied', { 
      word: currentCard, 
      correct: isCorrect,
      category: selectedCategory
    });
    
    // Move to next card
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // Session completed
      setCompletedSets(completedSets + 1);
      updateAnalytics('sessionEnd', { category: selectedCategory });
      setScreen('home');
    }
  };

  // Toggle favorite
  const toggleFavorite = (wordId) => {
    if (favorites.includes(wordId)) {
      setFavorites(favorites.filter(id => id !== wordId));
    } else {
      setFavorites([...favorites, wordId]);
    }
  };

  // Update analytics
  const updateAnalytics = (action, data) => {
    const newAnalytics = { ...analytics };
    const today = new Date().toDateString();
    
    switch (action) {
      case 'sessionStart':
        newAnalytics.studySessions += 1;
        
        // Update daily streak
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
        
        // Track accuracy by category
        if (!newAnalytics.accuracyByCategory[data.category]) {
          newAnalytics.accuracyByCategory[data.category] = { correct: 0, total: 0 };
        }
        newAnalytics.accuracyByCategory[data.category].total += 1;
        if (data.correct) {
          newAnalytics.accuracyByCategory[data.category].correct += 1;
        }
        
        // Track struggling words
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

  // Get categories
  const categories = [...new Set(vocabulary.map(word => word.category))];

  // Render current card
  const renderCurrentCard = () => {
    if (!studyCards[currentCardIndex]) return null;
    
    const card = studyCards[currentCardIndex];
    let frontText, backText, showPronunciation;
    
    // Determine what to show based on study mode
    if (studyMode === 'shuffle') {
      const randomMode = Math.random() > 0.5 ? 'en-tr' : 'tr-en';
      if (randomMode === 'en-tr') {
        frontText = card.english;
        backText = card.turkish;
        showPronunciation = true;
      } else {
        frontText = card.turkish;
        backText = card.english;
        showPronunciation = false;
      }
    } else if (studyMode === 'en-tr') {
      frontText = card.english;
      backText = card.turkish;
      showPronunciation = true;
    } else {
      frontText = card.turkish;
      backText = card.english;
      showPronunciation = false;
    }
    
    return (
      <div className="relative w-full max-w-md mx-auto">
        {/* Card counter */}
        <div className="text-center mb-4 text-purple-600 font-semibold">
          {currentCardIndex + 1} / {studyCards.length}
        </div>
        
        {/* 3D Flip Card */}
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
            {/* Front of card */}
            <div 
              className="absolute w-full h-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-white text-4xl font-bold mb-4 text-center">
                {frontText}
              </div>
              {!isFlipped && showPronunciation && (
                <div className="text-pink-100 text-xl italic">
                  {card.pronunciation}
                </div>
              )}
              <div className="mt-8 text-white text-sm opacity-75">
                Çevirmek için tıkla 👆
              </div>
            </div>
            
            {/* Back of card */}
            <div 
              className="absolute w-full h-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-white text-4xl font-bold mb-4 text-center">
                {backText}
              </div>
              {isFlipped && !showPronunciation && (
                <div className="text-blue-100 text-xl italic">
                  {card.pronunciation}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <button
            type="button"
            onClick={() => speakWord(card.english, 'en-US')}
            className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
          >
            <Volume2 className="w-6 h-6 text-purple-600" />
          </button>
          
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
        
        {/* Answer buttons */}
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

  // Welcome Screen
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-8 animate-bounce">🌸</div>
          <h1 className="text-5xl font-bold text-white mb-4">vokabi</h1>
          <p className="text-xl text-white mb-8">İngilizce Kelime Öğrenme Oyunu</p>
          <button
            type="button"
            onClick={() => setScreen('profile')}
            className="bg-white text-purple-600 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
          >
            Başlayalım! 🚀
          </button>
        </div>
      </div>
    );
  }

  // Profile Creation Screen
  if (screen === 'profile') {
    const [tempName, setTempName] = useState('');
    const [tempEmoji, setTempEmoji] = useState('');

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
            Profil Oluştur
          </h2>
          
          <div className="mb-6">
            <label className="block text-purple-600 font-semibold mb-2">
              Adın ne?
            </label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500"
              placeholder="Adını yaz..."
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-purple-600 font-semibold mb-2">
              Bir emoji seç:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {emojiOptions.map((emoji, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => setTempEmoji(emoji)}
                  className={`text-4xl p-3 rounded-xl transition-all transform hover:scale-110 ${
                    tempEmoji === emoji 
                      ? 'bg-purple-200 ring-4 ring-purple-400' 
                      : 'hover:bg-purple-100'
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
              if (tempName && tempEmoji) {
                handleCreateProfile(tempName, tempEmoji);
              }
            }}
            disabled={!tempName || !tempEmoji}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Devam Et 🚀
          </button>
        </div>
      </div>
    );
  }

  // Home Screen
  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pb-20">
        {/* Header with stats */}
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
          
          {/* Stats row */}
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

        {/* Main content */}
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

          {/* Recent badges */}
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

        {/* Sticker popup */}
        {showStickerPopup && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="text-9xl animate-bounce">
              {recentSticker}
            </div>
          </div>
        )}

        {/* Bottom navigation */}
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

  // Study Screen
  if (screen === 'study') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
        {/* Header */}
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

        {/* Study content */}
        <div className="max-w-2xl mx-auto">
          {renderCurrentCard()}
        </div>
      </div>
    );
  }

  // Words Screen
  if (screen === 'words') {
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterType, setFilterType] = useState('all'); // all, favorites, difficult, easy
    
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
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 rounded-b-3xl shadow-lg mb-6">
          <h2 className="text-3xl font-bold text-white mb-4">Tüm Kelimeler</h2>
          
          {/* Filters */}
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

        {/* Words list */}
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

        {/* Bottom navigation */}
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

  // Stats Screen
  if (screen === 'stats') {
    const totalWords = vocabulary.length;
    const studiedWords = analytics.totalWordsStudied;
    const progressPercent = Math.round((studiedWords / totalWords) * 100);

    // Calculate overall accuracy
    let totalCorrect = 0;
    let totalAttempts = 0;
    Object.values(analytics.accuracyByCategory).forEach(cat => {
      totalCorrect += cat.correct;
      totalAttempts += cat.total;
    });
    const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    // Get top struggling words
    const topStrugglingWords = analytics.strugglingWords
      .sort((a, b) => b.mistakes - a.mistakes)
      .slice(0, 5);

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 rounded-b-3xl shadow-lg mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">İstatistikler</h2>
          <p className="text-purple-100">Gelişimini takip et 📊</p>
        </div>

        <div className="px-6 space-y-6">
          {/* Overview stats */}
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

          {/* Progress bar */}
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

          {/* Category accuracy */}
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

          {/* Struggling words */}
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

          {/* All badges */}
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

          {/* Recent sessions */}
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

        {/* Bottom navigation */}
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
              className="flex flex-col items-center gap-1 text-purple-600"
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