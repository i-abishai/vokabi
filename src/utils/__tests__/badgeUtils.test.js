import {
  checkBadges,
  getEarnedBadgesCount,
  getBadgeById,
  isBadgeEarned,
  getBadgeProgress
} from '../badgeUtils';

describe('badgeUtils', () => {
  const createBadges = () => [
    { id: 'first_word', name: 'İlk Kelime', earned: false },
    { id: 'ten_words', name: '10 Kelime', earned: false },
    { id: 'fifty_words', name: '50 Kelime Ustası', earned: false },
    { id: 'hundred_words', name: '100 Kelime Kahramanı', earned: false },
    { id: 'streak_3', name: '3 Günlük Çalışma', earned: false },
    { id: 'streak_7', name: 'Bir Hafta', earned: false },
    { id: 'perfect_set', name: 'Mükemmel Set', earned: false },
    { id: 'level_5', name: 'Seviye 5', earned: false },
    { id: 'speed_master', name: 'Hız Ustası', earned: false },
    { id: 'favorites_10', name: 'Favori Toplayıcı', earned: false }
  ];

  describe('checkBadges', () => {
    test('earns first_word badge when 1 word is studied', () => {
      const badges = createBadges();
      const stats = {
        totalWordsStudied: 1,
        streak: 0,
        completedSets: 0,
        level: 1,
        favoritesCount: 0
      };

      const result = checkBadges(badges, stats);
      expect(result.updatedBadges[0].earned).toBe(true);
      expect(result.newBadgesEarned).toBe(true);
    });

    test('earns ten_words badge when 10 words are studied', () => {
      const badges = createBadges();
      const stats = {
        totalWordsStudied: 10,
        streak: 0,
        completedSets: 0,
        level: 1,
        favoritesCount: 0
      };

      const result = checkBadges(badges, stats);
      expect(result.updatedBadges[1].earned).toBe(true);
      expect(result.newBadgesEarned).toBe(true);
    });

    test('earns fifty_words badge when 50 words are studied', () => {
      const badges = createBadges();
      const stats = {
        totalWordsStudied: 50,
        streak: 0,
        completedSets: 0,
        level: 1,
        favoritesCount: 0
      };

      const result = checkBadges(badges, stats);
      expect(result.updatedBadges[2].earned).toBe(true);
    });

    test('earns hundred_words badge when 100 words are studied', () => {
      const badges = createBadges();
      const stats = {
        totalWordsStudied: 100,
        streak: 0,
        completedSets: 0,
        level: 1,
        favoritesCount: 0
      };

      const result = checkBadges(badges, stats);
      expect(result.updatedBadges[3].earned).toBe(true);
    });

    test('earns streak_3 badge when streak is 3', () => {
      const badges = createBadges();
      const stats = {
        totalWordsStudied: 0,
        streak: 3,
        completedSets: 0,
        level: 1,
        favoritesCount: 0
      };

      const result = checkBadges(badges, stats);
      expect(result.updatedBadges[4].earned).toBe(true);
      expect(result.newBadgesEarned).toBe(true);
    });

    test('earns streak_7 badge when streak is 7', () => {
      const badges = createBadges();
      const stats = {
        totalWordsStudied: 0,
        streak: 7,
        completedSets: 0,
        level: 1,
        favoritesCount: 0
      };

      const result = checkBadges(badges, stats);
      expect(result.updatedBadges[5].earned).toBe(true);
    });

    test('earns perfect_set badge when 1 set is completed', () => {
      const badges = createBadges();
      const stats = {
        totalWordsStudied: 0,
        streak: 0,
        completedSets: 1,
        level: 1,
        favoritesCount: 0
      };

      const result = checkBadges(badges, stats);
      expect(result.updatedBadges[6].earned).toBe(true);
      expect(result.newBadgesEarned).toBe(true);
    });

    test('earns level_5 badge when level is 5', () => {
      const badges = createBadges();
      const stats = {
        totalWordsStudied: 0,
        streak: 0,
        completedSets: 0,
        level: 5,
        favoritesCount: 0
      };

      const result = checkBadges(badges, stats);
      expect(result.updatedBadges[7].earned).toBe(true);
      expect(result.newBadgesEarned).toBe(true);
    });

    test('earns favorites_10 badge when 10 favorites are added', () => {
      const badges = createBadges();
      const stats = {
        totalWordsStudied: 0,
        streak: 0,
        completedSets: 0,
        level: 1,
        favoritesCount: 10
      };

      const result = checkBadges(badges, stats);
      expect(result.updatedBadges[9].earned).toBe(true);
      expect(result.newBadgesEarned).toBe(true);
    });

    test('earns multiple badges at once', () => {
      const badges = createBadges();
      const stats = {
        totalWordsStudied: 100,
        streak: 7,
        completedSets: 2,
        level: 5,
        favoritesCount: 15
      };

      const result = checkBadges(badges, stats);
      expect(result.updatedBadges[0].earned).toBe(true); // first_word
      expect(result.updatedBadges[1].earned).toBe(true); // ten_words
      expect(result.updatedBadges[2].earned).toBe(true); // fifty_words
      expect(result.updatedBadges[3].earned).toBe(true); // hundred_words
      expect(result.updatedBadges[4].earned).toBe(true); // streak_3
      expect(result.updatedBadges[5].earned).toBe(true); // streak_7
      expect(result.updatedBadges[6].earned).toBe(true); // perfect_set
      expect(result.updatedBadges[7].earned).toBe(true); // level_5
      expect(result.updatedBadges[9].earned).toBe(true); // favorites_10
      expect(result.newBadgesEarned).toBe(true);
    });

    test('does not re-earn already earned badges', () => {
      const badges = createBadges();
      badges[0].earned = true;

      const stats = {
        totalWordsStudied: 10,
        streak: 0,
        completedSets: 0,
        level: 1,
        favoritesCount: 0
      };

      const result = checkBadges(badges, stats);
      // Only ten_words should be newly earned
      expect(result.updatedBadges[0].earned).toBe(true);
      expect(result.updatedBadges[1].earned).toBe(true);
    });

    test('returns false for newBadgesEarned when no new badges', () => {
      const badges = createBadges();
      const stats = {
        totalWordsStudied: 0,
        streak: 0,
        completedSets: 0,
        level: 1,
        favoritesCount: 0
      };

      const result = checkBadges(badges, stats);
      expect(result.newBadgesEarned).toBe(false);
    });

    test('handles edge case where stats exactly meet requirements', () => {
      const badges = createBadges();
      const stats = {
        totalWordsStudied: 50,
        streak: 3,
        completedSets: 1,
        level: 5,
        favoritesCount: 10
      };

      const result = checkBadges(badges, stats);
      expect(result.updatedBadges[2].earned).toBe(true); // fifty_words
      expect(result.updatedBadges[4].earned).toBe(true); // streak_3
      expect(result.updatedBadges[6].earned).toBe(true); // perfect_set
      expect(result.updatedBadges[7].earned).toBe(true); // level_5
      expect(result.updatedBadges[9].earned).toBe(true); // favorites_10
    });
  });

  describe('getEarnedBadgesCount', () => {
    test('returns 0 for no earned badges', () => {
      const badges = createBadges();
      expect(getEarnedBadgesCount(badges)).toBe(0);
    });

    test('returns correct count for some earned badges', () => {
      const badges = createBadges();
      badges[0].earned = true;
      badges[1].earned = true;
      badges[4].earned = true;
      expect(getEarnedBadgesCount(badges)).toBe(3);
    });

    test('returns correct count for all earned badges', () => {
      const badges = createBadges();
      badges.forEach(badge => badge.earned = true);
      expect(getEarnedBadgesCount(badges)).toBe(10);
    });
  });

  describe('getBadgeById', () => {
    test('returns badge when id exists', () => {
      const badges = createBadges();
      const badge = getBadgeById(badges, 'first_word');
      expect(badge).toBeDefined();
      expect(badge.id).toBe('first_word');
    });

    test('returns undefined when id does not exist', () => {
      const badges = createBadges();
      const badge = getBadgeById(badges, 'nonexistent');
      expect(badge).toBeUndefined();
    });
  });

  describe('isBadgeEarned', () => {
    test('returns true for earned badge', () => {
      const badges = createBadges();
      badges[0].earned = true;
      expect(isBadgeEarned(badges, 'first_word')).toBe(true);
    });

    test('returns false for unearned badge', () => {
      const badges = createBadges();
      expect(isBadgeEarned(badges, 'first_word')).toBe(false);
    });

    test('returns false for nonexistent badge', () => {
      const badges = createBadges();
      expect(isBadgeEarned(badges, 'nonexistent')).toBe(false);
    });
  });

  describe('getBadgeProgress', () => {
    const stats = {
      totalWordsStudied: 25,
      streak: 5,
      completedSets: 2,
      level: 3,
      favoritesCount: 7
    };

    test('calculates progress for first_word badge', () => {
      const progress = getBadgeProgress('first_word', stats);
      expect(progress).toEqual({
        current: 25,
        required: 1,
        percentage: 100
      });
    });

    test('calculates progress for ten_words badge', () => {
      const progress = getBadgeProgress('ten_words', stats);
      expect(progress).toEqual({
        current: 25,
        required: 10,
        percentage: 100
      });
    });

    test('calculates progress for fifty_words badge', () => {
      const progress = getBadgeProgress('fifty_words', stats);
      expect(progress).toEqual({
        current: 25,
        required: 50,
        percentage: 50
      });
    });

    test('calculates progress for hundred_words badge', () => {
      const progress = getBadgeProgress('hundred_words', stats);
      expect(progress).toEqual({
        current: 25,
        required: 100,
        percentage: 25
      });
    });

    test('calculates progress for streak_3 badge', () => {
      const progress = getBadgeProgress('streak_3', stats);
      expect(progress).toEqual({
        current: 5,
        required: 3,
        percentage: 100
      });
    });

    test('calculates progress for streak_7 badge', () => {
      const progress = getBadgeProgress('streak_7', stats);
      expect(progress).toEqual({
        current: 5,
        required: 7,
        percentage: 71
      });
    });

    test('calculates progress for perfect_set badge', () => {
      const progress = getBadgeProgress('perfect_set', stats);
      expect(progress).toEqual({
        current: 2,
        required: 1,
        percentage: 100
      });
    });

    test('calculates progress for level_5 badge', () => {
      const progress = getBadgeProgress('level_5', stats);
      expect(progress).toEqual({
        current: 3,
        required: 5,
        percentage: 60
      });
    });

    test('calculates progress for favorites_10 badge', () => {
      const progress = getBadgeProgress('favorites_10', stats);
      expect(progress).toEqual({
        current: 7,
        required: 10,
        percentage: 70
      });
    });

    test('returns default values for unknown badge', () => {
      const progress = getBadgeProgress('unknown_badge', stats);
      expect(progress).toEqual({
        current: 0,
        required: 1,
        percentage: 0
      });
    });

    test('caps percentage at 100', () => {
      const highStats = {
        totalWordsStudied: 200,
        streak: 0,
        completedSets: 0,
        level: 1,
        favoritesCount: 0
      };
      const progress = getBadgeProgress('fifty_words', highStats);
      expect(progress.percentage).toBe(100);
    });
  });
});
