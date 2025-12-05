import {
  STORAGE_KEYS,
  getProfile,
  saveProfile,
  getScore,
  saveScore,
  getStreak,
  saveStreak,
  getLevel,
  saveLevel,
  getStars,
  saveStars,
  getBadges,
  saveBadges,
  getFavorites,
  saveFavorites,
  getDifficultWords,
  saveDifficultWords,
  getEasyWords,
  saveEasyWords,
  getCompletedSets,
  saveCompletedSets,
  getAnalytics,
  saveAnalytics,
  clearAllData
} from '../storageUtils';

describe('storageUtils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Profile operations', () => {
    test('getProfile returns default profile when nothing is saved', () => {
      const profile = getProfile();
      expect(profile).toEqual({ name: '', emoji: '' });
    });

    test('saveProfile and getProfile work correctly', () => {
      const testProfile = { name: 'Test User', emoji: '😊' };
      saveProfile(testProfile);
      const retrieved = getProfile();
      expect(retrieved).toEqual(testProfile);
    });

    test('saveProfile overwrites existing profile', () => {
      saveProfile({ name: 'First', emoji: '🎉' });
      saveProfile({ name: 'Second', emoji: '🌟' });
      const retrieved = getProfile();
      expect(retrieved).toEqual({ name: 'Second', emoji: '🌟' });
    });
  });

  describe('Score operations', () => {
    test('getScore returns 0 when nothing is saved', () => {
      expect(getScore()).toBe(0);
    });

    test('saveScore and getScore work correctly', () => {
      saveScore(100);
      expect(getScore()).toBe(100);
    });

    test('saveScore handles string conversion', () => {
      saveScore(250);
      const stored = localStorage.getItem(STORAGE_KEYS.SCORE);
      expect(stored).toBe('250');
      expect(getScore()).toBe(250);
    });
  });

  describe('Streak operations', () => {
    test('getStreak returns 0 when nothing is saved', () => {
      expect(getStreak()).toBe(0);
    });

    test('saveStreak and getStreak work correctly', () => {
      saveStreak(5);
      expect(getStreak()).toBe(5);
    });

    test('streak can be reset to 0', () => {
      saveStreak(10);
      saveStreak(0);
      expect(getStreak()).toBe(0);
    });
  });

  describe('Level operations', () => {
    test('getLevel returns 1 (not 0) when nothing is saved', () => {
      expect(getLevel()).toBe(1);
    });

    test('saveLevel and getLevel work correctly', () => {
      saveLevel(3);
      expect(getLevel()).toBe(3);
    });

    test('level can be increased multiple times', () => {
      saveLevel(1);
      expect(getLevel()).toBe(1);
      saveLevel(2);
      expect(getLevel()).toBe(2);
      saveLevel(5);
      expect(getLevel()).toBe(5);
    });
  });

  describe('Stars operations', () => {
    test('getStars returns 0 when nothing is saved', () => {
      expect(getStars()).toBe(0);
    });

    test('saveStars and getStars work correctly', () => {
      saveStars(15);
      expect(getStars()).toBe(15);
    });

    test('stars can accumulate', () => {
      saveStars(10);
      const current = getStars();
      saveStars(current + 5);
      expect(getStars()).toBe(15);
    });
  });

  describe('Badges operations', () => {
    const defaultBadges = [
      { id: 'test1', name: 'Test Badge 1', earned: false },
      { id: 'test2', name: 'Test Badge 2', earned: false }
    ];

    test('getBadges returns default badges when nothing is saved', () => {
      const badges = getBadges(defaultBadges);
      expect(badges).toEqual(defaultBadges);
    });

    test('saveBadges and getBadges work correctly', () => {
      const updatedBadges = [
        { id: 'test1', name: 'Test Badge 1', earned: true },
        { id: 'test2', name: 'Test Badge 2', earned: false }
      ];
      saveBadges(updatedBadges);
      const retrieved = getBadges(defaultBadges);
      expect(retrieved).toEqual(updatedBadges);
    });

    test('badges progress is persisted', () => {
      const badges = [...defaultBadges];
      badges[0].earned = true;
      saveBadges(badges);
      const retrieved = getBadges(defaultBadges);
      expect(retrieved[0].earned).toBe(true);
      expect(retrieved[1].earned).toBe(false);
    });
  });

  describe('Favorites operations', () => {
    test('getFavorites returns empty array when nothing is saved', () => {
      expect(getFavorites()).toEqual([]);
    });

    test('saveFavorites and getFavorites work correctly', () => {
      const favorites = [1, 5, 10];
      saveFavorites(favorites);
      expect(getFavorites()).toEqual(favorites);
    });

    test('favorites can be added and removed', () => {
      saveFavorites([1, 2, 3]);
      let favorites = getFavorites();
      favorites.push(4);
      saveFavorites(favorites);
      expect(getFavorites()).toEqual([1, 2, 3, 4]);

      favorites = getFavorites().filter(id => id !== 2);
      saveFavorites(favorites);
      expect(getFavorites()).toEqual([1, 3, 4]);
    });
  });

  describe('Difficult words operations', () => {
    test('getDifficultWords returns empty array when nothing is saved', () => {
      expect(getDifficultWords()).toEqual([]);
    });

    test('saveDifficultWords and getDifficultWords work correctly', () => {
      const difficultWords = [3, 7, 12];
      saveDifficultWords(difficultWords);
      expect(getDifficultWords()).toEqual(difficultWords);
    });

    test('word can move from difficult to easy', () => {
      saveDifficultWords([5, 10, 15]);
      const difficult = getDifficultWords().filter(id => id !== 10);
      saveDifficultWords(difficult);
      expect(getDifficultWords()).toEqual([5, 15]);
    });
  });

  describe('Easy words operations', () => {
    test('getEasyWords returns empty array when nothing is saved', () => {
      expect(getEasyWords()).toEqual([]);
    });

    test('saveEasyWords and getEasyWords work correctly', () => {
      const easyWords = [1, 2, 4, 8];
      saveEasyWords(easyWords);
      expect(getEasyWords()).toEqual(easyWords);
    });
  });

  describe('Completed sets operations', () => {
    test('getCompletedSets returns 0 when nothing is saved', () => {
      expect(getCompletedSets()).toBe(0);
    });

    test('saveCompletedSets and getCompletedSets work correctly', () => {
      saveCompletedSets(3);
      expect(getCompletedSets()).toBe(3);
    });

    test('completed sets can increment', () => {
      saveCompletedSets(5);
      const current = getCompletedSets();
      saveCompletedSets(current + 1);
      expect(getCompletedSets()).toBe(6);
    });
  });

  describe('Analytics operations', () => {
    const defaultAnalytics = {
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

    test('getAnalytics returns default analytics when nothing is saved', () => {
      const analytics = getAnalytics();
      expect(analytics).toEqual(defaultAnalytics);
    });

    test('saveAnalytics and getAnalytics work correctly', () => {
      const testAnalytics = {
        ...defaultAnalytics,
        studySessions: 5,
        totalWordsStudied: 50,
        dailyStreak: 3
      };
      saveAnalytics(testAnalytics);
      const retrieved = getAnalytics();
      expect(retrieved).toEqual(testAnalytics);
    });

    test('analytics with complex nested data is preserved', () => {
      const complexAnalytics = {
        ...defaultAnalytics,
        accuracyByCategory: {
          'Academic': { correct: 10, total: 15 },
          'Cultural': { correct: 8, total: 10 }
        },
        sessionHistory: [
          { date: '2025-12-01', category: 'Academic', wordsStudied: 10 }
        ],
        strugglingWords: [
          { id: 1, english: 'test', turkish: 'test', mistakes: 3 }
        ]
      };
      saveAnalytics(complexAnalytics);
      const retrieved = getAnalytics();
      expect(retrieved).toEqual(complexAnalytics);
    });
  });

  describe('clearAllData', () => {
    test('clearAllData removes all storage keys', () => {
      // Set some data
      saveProfile({ name: 'Test', emoji: '🎉' });
      saveScore(100);
      saveStreak(5);
      saveFavorites([1, 2, 3]);
      saveAnalytics(getAnalytics());

      // Verify data exists
      expect(getProfile().name).toBe('Test');
      expect(getScore()).toBe(100);

      // Clear all data
      clearAllData();

      // Verify all data is cleared
      expect(getProfile()).toEqual({ name: '', emoji: '' });
      expect(getScore()).toBe(0);
      expect(getStreak()).toBe(0);
      expect(getLevel()).toBe(1);
      expect(getFavorites()).toEqual([]);
    });
  });

  describe('Data persistence across operations', () => {
    test('multiple save operations maintain independence', () => {
      saveProfile({ name: 'User1', emoji: '😊' });
      saveScore(50);
      saveFavorites([1, 2]);

      // Each should maintain its own data
      expect(getProfile().name).toBe('User1');
      expect(getScore()).toBe(50);
      expect(getFavorites()).toEqual([1, 2]);

      // Updating one shouldn't affect others
      saveScore(100);
      expect(getProfile().name).toBe('User1');
      expect(getFavorites()).toEqual([1, 2]);
    });
  });
});
