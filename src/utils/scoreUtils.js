/**
 * Calculate bonus points based on current streak
 * @param {number} streak - Current streak count
 * @returns {number} Bonus points to award
 */
export const calculateBonusPoints = (streak) => {
  return streak >= 5 ? 15 : 10;
};

/**
 * Calculate level based on score
 * @param {number} score - Current score
 * @returns {number} Current level (minimum 1)
 */
export const calculateLevel = (score) => {
  return Math.floor(score / 200) + 1;
};

/**
 * Check if user should level up
 * @param {number} score - Current score
 * @param {number} currentLevel - Current level
 * @returns {boolean} True if user should level up
 */
export const shouldLevelUp = (score, currentLevel) => {
  const newLevel = calculateLevel(score);
  return newLevel > currentLevel;
};

/**
 * Calculate progress percentage toward next level
 * @param {number} score - Current score
 * @returns {number} Progress percentage (0-100)
 */
export const getLevelProgress = (score) => {
  const pointsInCurrentLevel = score % 200;
  return Math.round((pointsInCurrentLevel / 200) * 100);
};

/**
 * Calculate points needed for next level
 * @param {number} score - Current score
 * @returns {number} Points needed
 */
export const getPointsToNextLevel = (score) => {
  const pointsInCurrentLevel = score % 200;
  return 200 - pointsInCurrentLevel;
};
