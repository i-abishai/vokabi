/**
 * Check and update badge achievements
 * @param {Array} badges - Current badges array
 * @param {Object} stats - Statistics object containing totalWordsStudied, streak, completedSets, level, favoritesCount
 * @returns {Object} { updatedBadges, newBadgesEarned }
 */
export const checkBadges = (badges, stats) => {
  const { totalWordsStudied, streak, completedSets, level, favoritesCount } = stats;
  const updatedBadges = [...badges];
  let newBadgesEarned = false;

  // Badge 0: First Word (1 word studied)
  if (!updatedBadges[0]?.earned && totalWordsStudied >= 1) {
    updatedBadges[0].earned = true;
    newBadgesEarned = true;
  }

  // Badge 1: 10 Words
  if (!updatedBadges[1]?.earned && totalWordsStudied >= 10) {
    updatedBadges[1].earned = true;
    newBadgesEarned = true;
  }

  // Badge 2: 50 Words Master
  if (!updatedBadges[2]?.earned && totalWordsStudied >= 50) {
    updatedBadges[2].earned = true;
    newBadgesEarned = true;
  }

  // Badge 3: 100 Words Hero
  if (!updatedBadges[3]?.earned && totalWordsStudied >= 100) {
    updatedBadges[3].earned = true;
    newBadgesEarned = true;
  }

  // Badge 4: 3 Day Streak
  if (!updatedBadges[4]?.earned && streak >= 3) {
    updatedBadges[4].earned = true;
    newBadgesEarned = true;
  }

  // Badge 5: 7 Day Streak (One Week)
  if (!updatedBadges[5]?.earned && streak >= 7) {
    updatedBadges[5].earned = true;
    newBadgesEarned = true;
  }

  // Badge 6: Perfect Set (100% completion)
  if (!updatedBadges[6]?.earned && completedSets >= 1) {
    updatedBadges[6].earned = true;
    newBadgesEarned = true;
  }

  // Badge 7: Level 5
  if (!updatedBadges[7]?.earned && level >= 5) {
    updatedBadges[7].earned = true;
    newBadgesEarned = true;
  }

  // Badge 8: Speed Master (index 8 is not checked in original code)
  // This badge requires special logic for timing that's not tracked yet

  // Badge 9: Favorite Collector (10 favorites)
  if (!updatedBadges[9]?.earned && favoritesCount >= 10) {
    updatedBadges[9].earned = true;
    newBadgesEarned = true;
  }

  return {
    updatedBadges,
    newBadgesEarned
  };
};

/**
 * Get count of earned badges
 * @param {Array} badges - Badges array
 * @returns {number} Count of earned badges
 */
export const getEarnedBadgesCount = (badges) => {
  return badges.filter(badge => badge.earned).length;
};

/**
 * Get specific badge by id
 * @param {Array} badges - Badges array
 * @param {string} badgeId - Badge ID to find
 * @returns {Object|undefined} Badge object or undefined
 */
export const getBadgeById = (badges, badgeId) => {
  return badges.find(badge => badge.id === badgeId);
};

/**
 * Check if a specific badge is earned
 * @param {Array} badges - Badges array
 * @param {string} badgeId - Badge ID to check
 * @returns {boolean} True if badge is earned
 */
export const isBadgeEarned = (badges, badgeId) => {
  const badge = getBadgeById(badges, badgeId);
  return badge ? badge.earned : false;
};

/**
 * Get progress toward a specific badge
 * @param {string} badgeId - Badge ID
 * @param {Object} stats - Current statistics
 * @returns {Object} { current, required, percentage }
 */
export const getBadgeProgress = (badgeId, stats) => {
  const { totalWordsStudied, streak, completedSets, level, favoritesCount } = stats;

  const progressMap = {
    'first_word': { current: totalWordsStudied, required: 1 },
    'ten_words': { current: totalWordsStudied, required: 10 },
    'fifty_words': { current: totalWordsStudied, required: 50 },
    'hundred_words': { current: totalWordsStudied, required: 100 },
    'streak_3': { current: streak, required: 3 },
    'streak_7': { current: streak, required: 7 },
    'perfect_set': { current: completedSets, required: 1 },
    'level_5': { current: level, required: 5 },
    'favorites_10': { current: favoritesCount, required: 10 }
  };

  const progress = progressMap[badgeId];
  if (!progress) {
    return { current: 0, required: 1, percentage: 0 };
  }

  const percentage = Math.min(Math.round((progress.current / progress.required) * 100), 100);

  return {
    current: progress.current,
    required: progress.required,
    percentage
  };
};
