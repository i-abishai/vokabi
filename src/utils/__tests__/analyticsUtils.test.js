import {
  areConsecutiveDays,
  getYesterdayDateString,
  getTodayDateString,
  updateAnalyticsOnSessionStart,
  updateAnalyticsOnWordStudied,
  updateAnalyticsOnSessionEnd,
  calculateOverallAccuracy,
  getTopStrugglingWords,
  calculateCategoryAccuracy
} from '../analyticsUtils';

describe('analyticsUtils', () => {
  describe('Date helpers', () => {
    test('getTodayDateString returns today\'s date', () => {
      const today = new Date().toDateString();
      expect(getTodayDateString()).toBe(today);
    });

    test('getYesterdayDateString returns yesterday\'s date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(getYesterdayDateString()).toBe(yesterday.toDateString());
    });

    test('areConsecutiveDays returns false for null dates', () => {
      expect(areConsecutiveDays(null, null)).toBe(false);
      expect(areConsecutiveDays('2025-12-01', null)).toBe(false);
      expect(areConsecutiveDays(null, '2025-12-01')).toBe(false);
    });

    test('areConsecutiveDays returns true for consecutive dates', () => {
      expect(areConsecutiveDays('2025-12-01', '2025-12-02')).toBe(true);
      expect(areConsecutiveDays('2025-12-02', '2025-12-01')).toBe(true);
    });

    test('areConsecutiveDays returns false for non-consecutive dates', () => {
      expect(areConsecutiveDays('2025-12-01', '2025-12-03')).toBe(false);
      expect(areConsecutiveDays('2025-12-01', '2025-12-01')).toBe(false);
    });
  });

  describe('updateAnalyticsOnSessionStart', () => {
    const baseAnalytics = {
      studySessions: 0,
      dailyStreak: 0,
      lastStudyDate: null
    };

    test('increments study sessions', () => {
      const updated = updateAnalyticsOnSessionStart(baseAnalytics);
      expect(updated.studySessions).toBe(1);
    });

    test('sets daily streak to 1 on first session', () => {
      const updated = updateAnalyticsOnSessionStart(baseAnalytics);
      expect(updated.dailyStreak).toBe(1);
    });

    test('updates lastStudyDate to today', () => {
      const updated = updateAnalyticsOnSessionStart(baseAnalytics);
      expect(updated.lastStudyDate).toBe(getTodayDateString());
    });

    test('increments streak when studying on consecutive days', () => {
      const analytics = {
        ...baseAnalytics,
        dailyStreak: 2,
        lastStudyDate: getYesterdayDateString()
      };
      const updated = updateAnalyticsOnSessionStart(analytics);
      expect(updated.dailyStreak).toBe(3);
    });

    test('resets streak to 1 when study gap is more than 1 day', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const analytics = {
        ...baseAnalytics,
        dailyStreak: 5,
        lastStudyDate: twoDaysAgo.toDateString()
      };
      const updated = updateAnalyticsOnSessionStart(analytics);
      expect(updated.dailyStreak).toBe(1);
    });

    test('does not change streak or lastStudyDate for multiple sessions same day', () => {
      const today = getTodayDateString();
      const analytics = {
        ...baseAnalytics,
        studySessions: 2,
        dailyStreak: 3,
        lastStudyDate: today
      };
      const updated = updateAnalyticsOnSessionStart(analytics);
      expect(updated.dailyStreak).toBe(3);
      expect(updated.lastStudyDate).toBe(today);
      expect(updated.studySessions).toBe(3);
    });
  });

  describe('updateAnalyticsOnWordStudied', () => {
    const baseAnalytics = {
      totalWordsStudied: 0,
      accuracyByCategory: {},
      strugglingWords: []
    };

    const testWord = {
      id: 1,
      english: 'test',
      turkish: 'test',
      category: 'Academic'
    };

    test('increments totalWordsStudied', () => {
      const updated = updateAnalyticsOnWordStudied(baseAnalytics, testWord, true, 'Academic');
      expect(updated.totalWordsStudied).toBe(1);
    });

    test('creates category accuracy entry if not exists', () => {
      const updated = updateAnalyticsOnWordStudied(baseAnalytics, testWord, true, 'Academic');
      expect(updated.accuracyByCategory['Academic']).toEqual({ correct: 1, total: 1 });
    });

    test('updates existing category accuracy for correct answer', () => {
      const analytics = {
        ...baseAnalytics,
        accuracyByCategory: {
          'Academic': { correct: 5, total: 8 }
        }
      };
      const updated = updateAnalyticsOnWordStudied(analytics, testWord, true, 'Academic');
      expect(updated.accuracyByCategory['Academic']).toEqual({ correct: 6, total: 9 });
    });

    test('updates existing category accuracy for incorrect answer', () => {
      const analytics = {
        ...baseAnalytics,
        accuracyByCategory: {
          'Academic': { correct: 5, total: 8 }
        }
      };
      const updated = updateAnalyticsOnWordStudied(analytics, testWord, false, 'Academic');
      expect(updated.accuracyByCategory['Academic']).toEqual({ correct: 5, total: 9 });
    });

    test('adds word to struggling words on incorrect answer', () => {
      const updated = updateAnalyticsOnWordStudied(baseAnalytics, testWord, false, 'Academic');
      expect(updated.strugglingWords).toHaveLength(1);
      expect(updated.strugglingWords[0]).toEqual({
        ...testWord,
        mistakes: 1
      });
    });

    test('increments mistakes for existing struggling word', () => {
      const analytics = {
        ...baseAnalytics,
        strugglingWords: [{
          ...testWord,
          mistakes: 2
        }]
      };
      const updated = updateAnalyticsOnWordStudied(analytics, testWord, false, 'Academic');
      expect(updated.strugglingWords[0].mistakes).toBe(3);
    });

    test('does not add to struggling words on correct answer', () => {
      const updated = updateAnalyticsOnWordStudied(baseAnalytics, testWord, true, 'Academic');
      expect(updated.strugglingWords).toHaveLength(0);
    });
  });

  describe('updateAnalyticsOnSessionEnd', () => {
    const baseAnalytics = {
      sessionHistory: []
    };

    test('adds session to history', () => {
      const updated = updateAnalyticsOnSessionEnd(baseAnalytics, 'Academic', 10);
      expect(updated.sessionHistory).toHaveLength(1);
    });

    test('session includes correct data', () => {
      const updated = updateAnalyticsOnSessionEnd(baseAnalytics, 'Cultural', 15);
      const session = updated.sessionHistory[0];
      expect(session.category).toBe('Cultural');
      expect(session.wordsStudied).toBe(15);
      expect(session.date).toBeDefined();
    });

    test('preserves existing session history', () => {
      const analytics = {
        sessionHistory: [
          { date: '2025-12-01', category: 'Academic', wordsStudied: 5 }
        ]
      };
      const updated = updateAnalyticsOnSessionEnd(analytics, 'Cultural', 10);
      expect(updated.sessionHistory).toHaveLength(2);
      expect(updated.sessionHistory[0].category).toBe('Academic');
    });
  });

  describe('calculateOverallAccuracy', () => {
    test('returns 0 for empty accuracy data', () => {
      expect(calculateOverallAccuracy({})).toBe(0);
    });

    test('calculates accuracy for single category', () => {
      const accuracy = calculateOverallAccuracy({
        'Academic': { correct: 8, total: 10 }
      });
      expect(accuracy).toBe(80);
    });

    test('calculates accuracy across multiple categories', () => {
      const accuracy = calculateOverallAccuracy({
        'Academic': { correct: 8, total: 10 },
        'Cultural': { correct: 15, total: 20 }
      });
      // (8 + 15) / (10 + 20) = 23/30 = 76.67% -> 77%
      expect(accuracy).toBe(77);
    });

    test('rounds accuracy correctly', () => {
      const accuracy = calculateOverallAccuracy({
        'Academic': { correct: 2, total: 3 }
      });
      // 2/3 = 66.67% -> 67%
      expect(accuracy).toBe(67);
    });

    test('returns 100 for perfect accuracy', () => {
      const accuracy = calculateOverallAccuracy({
        'Academic': { correct: 10, total: 10 },
        'Cultural': { correct: 20, total: 20 }
      });
      expect(accuracy).toBe(100);
    });
  });

  describe('getTopStrugglingWords', () => {
    const strugglingWords = [
      { id: 1, english: 'word1', mistakes: 5 },
      { id: 2, english: 'word2', mistakes: 3 },
      { id: 3, english: 'word3', mistakes: 8 },
      { id: 4, english: 'word4', mistakes: 2 },
      { id: 5, english: 'word5', mistakes: 7 },
      { id: 6, english: 'word6', mistakes: 1 }
    ];

    test('returns empty array for empty input', () => {
      expect(getTopStrugglingWords([])).toEqual([]);
    });

    test('returns top 5 words by default', () => {
      const top = getTopStrugglingWords(strugglingWords);
      expect(top).toHaveLength(5);
    });

    test('sorts words by mistakes in descending order', () => {
      const top = getTopStrugglingWords(strugglingWords);
      expect(top[0].mistakes).toBe(8);
      expect(top[1].mistakes).toBe(7);
      expect(top[2].mistakes).toBe(5);
      expect(top[3].mistakes).toBe(3);
      expect(top[4].mistakes).toBe(2);
    });

    test('respects custom limit', () => {
      const top = getTopStrugglingWords(strugglingWords, 3);
      expect(top).toHaveLength(3);
      expect(top[0].mistakes).toBe(8);
      expect(top[1].mistakes).toBe(7);
      expect(top[2].mistakes).toBe(5);
    });

    test('returns all words if fewer than limit', () => {
      const few = [
        { id: 1, english: 'word1', mistakes: 3 },
        { id: 2, english: 'word2', mistakes: 5 }
      ];
      const top = getTopStrugglingWords(few, 5);
      expect(top).toHaveLength(2);
    });
  });

  describe('calculateCategoryAccuracy', () => {
    test('returns 0 for undefined category data', () => {
      expect(calculateCategoryAccuracy(undefined)).toBe(0);
    });

    test('returns 0 for category with no attempts', () => {
      expect(calculateCategoryAccuracy({ correct: 0, total: 0 })).toBe(0);
    });

    test('calculates accuracy correctly', () => {
      expect(calculateCategoryAccuracy({ correct: 8, total: 10 })).toBe(80);
      expect(calculateCategoryAccuracy({ correct: 15, total: 20 })).toBe(75);
    });

    test('rounds to nearest integer', () => {
      expect(calculateCategoryAccuracy({ correct: 2, total: 3 })).toBe(67);
    });

    test('returns 100 for perfect score', () => {
      expect(calculateCategoryAccuracy({ correct: 10, total: 10 })).toBe(100);
    });

    test('returns 0 for all incorrect', () => {
      expect(calculateCategoryAccuracy({ correct: 0, total: 10 })).toBe(0);
    });
  });
});
