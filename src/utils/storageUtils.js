// Storage keys
export const STORAGE_KEYS = {
  PROFILE: 'vokabi_profile',
  SCORE: 'vokabi_score',
  STREAK: 'vokabi_streak',
  LEVEL: 'vokabi_level',
  STARS: 'vokabi_stars',
  BADGES: 'vokabi_badges',
  FAVORITES: 'vokabi_favorites',
  DIFFICULT: 'vokabi_difficult',
  EASY: 'vokabi_easy',
  COMPLETED: 'vokabi_completed',
  ANALYTICS: 'vokabi_analytics'
};

// Profile operations
export const getProfile = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return saved ? JSON.parse(saved) : { name: '', emoji: '' };
};

export const saveProfile = (profile) => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

// Score operations
export const getScore = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.SCORE);
  return saved ? parseInt(saved) : 0;
};

export const saveScore = (score) => {
  localStorage.setItem(STORAGE_KEYS.SCORE, score.toString());
};

// Streak operations
export const getStreak = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.STREAK);
  return saved ? parseInt(saved) : 0;
};

export const saveStreak = (streak) => {
  localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
};

// Level operations
export const getLevel = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.LEVEL);
  return saved ? parseInt(saved) : 1;
};

export const saveLevel = (level) => {
  localStorage.setItem(STORAGE_KEYS.LEVEL, level.toString());
};

// Stars operations
export const getStars = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.STARS);
  return saved ? parseInt(saved) : 0;
};

export const saveStars = (stars) => {
  localStorage.setItem(STORAGE_KEYS.STARS, stars.toString());
};

// Badges operations
export const getBadges = (defaultBadges) => {
  const saved = localStorage.getItem(STORAGE_KEYS.BADGES);
  return saved ? JSON.parse(saved) : defaultBadges;
};

export const saveBadges = (badges) => {
  localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
};

// Favorites operations
export const getFavorites = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  return saved ? JSON.parse(saved) : [];
};

export const saveFavorites = (favorites) => {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
};

// Difficult words operations
export const getDifficultWords = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.DIFFICULT);
  return saved ? JSON.parse(saved) : [];
};

export const saveDifficultWords = (difficultWords) => {
  localStorage.setItem(STORAGE_KEYS.DIFFICULT, JSON.stringify(difficultWords));
};

// Easy words operations
export const getEasyWords = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.EASY);
  return saved ? JSON.parse(saved) : [];
};

export const saveEasyWords = (easyWords) => {
  localStorage.setItem(STORAGE_KEYS.EASY, JSON.stringify(easyWords));
};

// Completed sets operations
export const getCompletedSets = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED);
  return saved ? parseInt(saved) : 0;
};

export const saveCompletedSets = (completedSets) => {
  localStorage.setItem(STORAGE_KEYS.COMPLETED, completedSets.toString());
};

// Analytics operations
export const getAnalytics = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
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
};

export const saveAnalytics = (analytics) => {
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
};

// Clear all data
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
