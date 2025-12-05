import {
  calculateBonusPoints,
  calculateLevel,
  shouldLevelUp,
  getLevelProgress,
  getPointsToNextLevel
} from '../scoreUtils';

describe('scoreUtils', () => {
  describe('calculateBonusPoints', () => {
    test('returns 10 points when streak is less than 5', () => {
      expect(calculateBonusPoints(0)).toBe(10);
      expect(calculateBonusPoints(1)).toBe(10);
      expect(calculateBonusPoints(4)).toBe(10);
    });

    test('returns 15 points when streak is 5 or more', () => {
      expect(calculateBonusPoints(5)).toBe(15);
      expect(calculateBonusPoints(10)).toBe(15);
      expect(calculateBonusPoints(100)).toBe(15);
    });
  });

  describe('calculateLevel', () => {
    test('level 1 for scores 0-199', () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(50)).toBe(1);
      expect(calculateLevel(199)).toBe(1);
    });

    test('level 2 for scores 200-399', () => {
      expect(calculateLevel(200)).toBe(2);
      expect(calculateLevel(350)).toBe(2);
      expect(calculateLevel(399)).toBe(2);
    });

    test('level 3 for scores 400-599', () => {
      expect(calculateLevel(400)).toBe(3);
      expect(calculateLevel(500)).toBe(3);
      expect(calculateLevel(599)).toBe(3);
    });

    test('level 5 for scores 800-999', () => {
      expect(calculateLevel(800)).toBe(5);
      expect(calculateLevel(900)).toBe(5);
      expect(calculateLevel(999)).toBe(5);
    });

    test('level 10 for score 1800', () => {
      expect(calculateLevel(1800)).toBe(10);
    });
  });

  describe('shouldLevelUp', () => {
    test('returns false when level has not changed', () => {
      expect(shouldLevelUp(100, 1)).toBe(false);
      expect(shouldLevelUp(199, 1)).toBe(false);
      expect(shouldLevelUp(250, 2)).toBe(false);
    });

    test('returns true when score reaches next level threshold', () => {
      expect(shouldLevelUp(200, 1)).toBe(true);
      expect(shouldLevelUp(400, 2)).toBe(true);
      expect(shouldLevelUp(600, 3)).toBe(true);
    });

    test('returns true when score exceeds current level', () => {
      expect(shouldLevelUp(250, 1)).toBe(true);
      expect(shouldLevelUp(450, 2)).toBe(true);
      expect(shouldLevelUp(1000, 4)).toBe(true);
    });

    test('returns false when on exact level boundary', () => {
      expect(shouldLevelUp(200, 2)).toBe(false);
      expect(shouldLevelUp(400, 3)).toBe(false);
    });
  });

  describe('getLevelProgress', () => {
    test('returns 0% at start of level', () => {
      expect(getLevelProgress(0)).toBe(0);
      expect(getLevelProgress(200)).toBe(0);
      expect(getLevelProgress(400)).toBe(0);
    });

    test('returns 50% at halfway through level', () => {
      expect(getLevelProgress(100)).toBe(50);
      expect(getLevelProgress(300)).toBe(50);
      expect(getLevelProgress(500)).toBe(50);
    });

    test('returns 99% near end of level (199 points)', () => {
      expect(getLevelProgress(199)).toBe(100);
      expect(getLevelProgress(399)).toBe(100);
    });

    test('calculates correct percentages for various scores', () => {
      expect(getLevelProgress(50)).toBe(25);  // 50/200 = 25%
      expect(getLevelProgress(150)).toBe(75); // 150/200 = 75%
      expect(getLevelProgress(250)).toBe(25); // 50/200 = 25%
    });
  });

  describe('getPointsToNextLevel', () => {
    test('returns 200 at start of level', () => {
      expect(getPointsToNextLevel(0)).toBe(200);
      expect(getPointsToNextLevel(200)).toBe(200);
      expect(getPointsToNextLevel(400)).toBe(200);
    });

    test('returns 1 when one point away from level up', () => {
      expect(getPointsToNextLevel(199)).toBe(1);
      expect(getPointsToNextLevel(399)).toBe(1);
      expect(getPointsToNextLevel(599)).toBe(1);
    });

    test('returns 100 at halfway through level', () => {
      expect(getPointsToNextLevel(100)).toBe(100);
      expect(getPointsToNextLevel(300)).toBe(100);
      expect(getPointsToNextLevel(500)).toBe(100);
    });

    test('calculates correct points needed for various scores', () => {
      expect(getPointsToNextLevel(50)).toBe(150);
      expect(getPointsToNextLevel(250)).toBe(150);
      expect(getPointsToNextLevel(150)).toBe(50);
    });
  });

  describe('integration tests', () => {
    test('level and progress calculations are consistent', () => {
      const score = 350;
      const level = calculateLevel(score);
      const progress = getLevelProgress(score);
      const pointsNeeded = getPointsToNextLevel(score);

      expect(level).toBe(2);
      expect(progress).toBe(75);
      expect(pointsNeeded).toBe(50);
    });

    test('points to next level + progress equals 200', () => {
      const scores = [0, 50, 100, 150, 199, 250, 350, 450];
      scores.forEach(score => {
        const pointsInLevel = score % 200;
        const pointsNeeded = getPointsToNextLevel(score);
        expect(pointsInLevel + pointsNeeded).toBe(200);
      });
    });
  });
});
