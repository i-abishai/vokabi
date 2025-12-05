/**
 * Check if two dates are consecutive days
 * @param {string} dateStr1 - First date string
 * @param {string} dateStr2 - Second date string
 * @returns {boolean} True if dates are consecutive
 */
export const areConsecutiveDays = (dateStr1, dateStr2) => {
  if (!dateStr1 || !dateStr2) return false;

  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);

  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 1;
};

/**
 * Get yesterday's date as a string
 * @returns {string} Yesterday's date as toDateString()
 */
export const getYesterdayDateString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toDateString();
};

/**
 * Get today's date as a string
 * @returns {string} Today's date as toDateString()
 */
export const getTodayDateString = () => {
  return new Date().toDateString();
};

/**
 * Update analytics for session start
 * @param {Object} analytics - Current analytics object
 * @returns {Object} Updated analytics object
 */
export const updateAnalyticsOnSessionStart = (analytics) => {
  const newAnalytics = { ...analytics };
  const today = getTodayDateString();

  newAnalytics.studySessions += 1;

  if (newAnalytics.lastStudyDate !== today) {
    const yesterday = getYesterdayDateString();

    if (newAnalytics.lastStudyDate === yesterday) {
      newAnalytics.dailyStreak += 1;
    } else if (newAnalytics.lastStudyDate !== today) {
      newAnalytics.dailyStreak = 1;
    }

    newAnalytics.lastStudyDate = today;
  }

  return newAnalytics;
};

/**
 * Update analytics for a studied word
 * @param {Object} analytics - Current analytics object
 * @param {Object} word - Word that was studied
 * @param {boolean} correct - Whether answer was correct
 * @param {string} category - Category of the word
 * @returns {Object} Updated analytics object
 */
export const updateAnalyticsOnWordStudied = (analytics, word, correct, category) => {
  const newAnalytics = { ...analytics };

  newAnalytics.totalWordsStudied += 1;

  // Update category accuracy
  if (!newAnalytics.accuracyByCategory[category]) {
    newAnalytics.accuracyByCategory[category] = { correct: 0, total: 0 };
  }
  newAnalytics.accuracyByCategory[category].total += 1;
  if (correct) {
    newAnalytics.accuracyByCategory[category].correct += 1;
  }

  // Track struggling words
  if (!correct) {
    const existingWord = newAnalytics.strugglingWords.find(w => w.id === word.id);
    if (existingWord) {
      existingWord.mistakes += 1;
    } else {
      newAnalytics.strugglingWords.push({
        ...word,
        mistakes: 1
      });
    }
  }

  return newAnalytics;
};

/**
 * Update analytics for session end
 * @param {Object} analytics - Current analytics object
 * @param {string} category - Category that was studied
 * @param {number} wordsStudied - Number of words studied in session
 * @returns {Object} Updated analytics object
 */
export const updateAnalyticsOnSessionEnd = (analytics, category, wordsStudied) => {
  const newAnalytics = { ...analytics };

  newAnalytics.sessionHistory.push({
    date: new Date().toISOString(),
    category,
    wordsStudied
  });

  return newAnalytics;
};

/**
 * Calculate overall accuracy percentage
 * @param {Object} accuracyByCategory - Category accuracy data
 * @returns {number} Overall accuracy percentage (0-100)
 */
export const calculateOverallAccuracy = (accuracyByCategory) => {
  let totalCorrect = 0;
  let totalAttempts = 0;

  Object.values(accuracyByCategory).forEach(cat => {
    totalCorrect += cat.correct;
    totalAttempts += cat.total;
  });

  return totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
};

/**
 * Get top struggling words
 * @param {Array} strugglingWords - Array of words with mistake counts
 * @param {number} limit - Maximum number of words to return
 * @returns {Array} Top struggling words sorted by mistakes
 */
export const getTopStrugglingWords = (strugglingWords, limit = 5) => {
  return strugglingWords
    .sort((a, b) => b.mistakes - a.mistakes)
    .slice(0, limit);
};

/**
 * Calculate category accuracy percentage
 * @param {Object} categoryData - Category accuracy data { correct, total }
 * @returns {number} Accuracy percentage (0-100)
 */
export const calculateCategoryAccuracy = (categoryData) => {
  if (!categoryData || categoryData.total === 0) return 0;
  return Math.round((categoryData.correct / categoryData.total) * 100);
};
