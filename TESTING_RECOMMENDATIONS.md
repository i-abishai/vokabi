# Testing Recommendations for Vokabi

## Overview

This document provides actionable recommendations for improving test coverage across the Vokabi application.

---

## Current State Summary

### ✅ What's Already Tested (Phase 1 Complete)

**Business Logic - 120 Tests**
- ✅ LocalStorage operations (30 tests)
- ✅ Score and level calculations (21 tests)
- ✅ Analytics tracking (40 tests)
- ✅ Badge achievement system (29 tests)
- ✅ All utility functions have >90% coverage

### ❌ What Needs Testing

**UI Components - 0 Tests**
- ❌ Screen components (Welcome, Home, Study, Words, Stats)
- ❌ Card flipping mechanics
- ❌ Navigation system
- ❌ Filter and search functionality
- ❌ User interactions

**Integration - 0 Tests**
- ❌ Complete user flows
- ❌ Data persistence across sessions
- ❌ State management
- ❌ Screen transitions

---

## Priority 1: Critical Business Logic (DONE ✅)

All business logic is now thoroughly tested! This includes:
- Data persistence
- Scoring system
- Analytics
- Badge achievements

**No action needed** - this is complete.

---

## Priority 2: Component Testing (RECOMMENDED NEXT)

### Why This Matters
Component tests ensure your UI works correctly and catch visual regressions.

### Recommended Approach

#### Option A: Test Current Monolithic App.js
**Pros:** Quick to implement
**Cons:** Hard to maintain, tests will be slow

```javascript
// Not recommended but works
test('renders welcome screen by default', () => {
  render(<App />);
  expect(screen.getByText(/vokabi/i)).toBeInTheDocument();
  expect(screen.getByText(/Başlayalım/i)).toBeInTheDocument();
});
```

#### Option B: Extract Components First (RECOMMENDED)
**Pros:** Better architecture, easier to test, more maintainable
**Cons:** Requires refactoring effort

**Step 1: Extract Components**
```
src/components/
├── WelcomeScreen.js
├── ProfileScreen.js
├── HomeScreen.js
├── StudyScreen.js
├── WordsScreen.js
└── StatsScreen.js
```

**Step 2: Write Component Tests**
```javascript
// HomeScreen.test.js
import { render, screen } from '@testing-library/react';
import HomeScreen from '../HomeScreen';

test('displays user profile information', () => {
  const profile = { name: 'Test User', emoji: '😊', level: 3 };
  render(<HomeScreen profile={profile} />);

  expect(screen.getByText('Test User')).toBeInTheDocument();
  expect(screen.getByText('😊')).toBeInTheDocument();
  expect(screen.getByText(/Seviye 3/i)).toBeInTheDocument();
});

test('displays stats cards', () => {
  const stats = { score: 150, streak: 5, stars: 20 };
  render(<HomeScreen stats={stats} />);

  expect(screen.getByText('150')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(screen.getByText('20')).toBeInTheDocument();
});
```

### Components to Test

#### 1. WelcomeScreen
**Tests to Write: ~3**
```javascript
- renders title and description
- renders start button
- calls onStart when button clicked
```

#### 2. ProfileScreen
**Tests to Write: ~5**
```javascript
- renders name input
- renders emoji selector
- enables submit button when name and emoji selected
- disables submit button when fields empty
- calls onSubmit with correct data
```

#### 3. HomeScreen
**Tests to Write: ~8**
```javascript
- displays user profile
- displays score, streak, stars
- renders all categories
- renders study mode buttons
- calls onStudyStart with correct mode
- displays earned badges
- renders navigation buttons
- handles empty categories gracefully
```

#### 4. StudyScreen
**Tests to Write: ~12**
```javascript
- renders flashcard with word
- shows pronunciation for English words
- hides pronunciation for Turkish words
- flips card when clicked
- shows audio button for English words
- plays audio when button clicked
- shows favorite button
- toggles favorite status
- shows answer buttons when flipped
- calls onAnswer with correct/incorrect
- displays progress (X / Y)
- shows back button
```

#### 5. WordsScreen
**Tests to Write: ~10**
```javascript
- renders all words by default
- filters by category
- filters by favorites
- filters by difficult words
- filters by easy words
- displays word pronunciation
- shows favorite icon for favorited words
- plays audio when speaker clicked
- shows "no words" message when filter returns empty
- displays word tags (difficult/easy)
```

#### 6. StatsScreen
**Tests to Write: ~8**
```javascript
- displays study sessions count
- displays overall accuracy
- displays daily streak
- calculates progress percentage correctly
- renders category accuracy bars
- displays struggling words list
- shows all badges
- renders recent sessions history
```

**Total Component Tests Recommended: ~46**

---

## Priority 3: Integration Testing

### User Flow Tests

#### Flow 1: New User Onboarding
```javascript
test('new user can create profile and start studying', () => {
  render(<App />);

  // Welcome screen
  expect(screen.getByText(/vokabi/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Başlayalım/i));

  // Profile screen
  fireEvent.change(screen.getByPlaceholderText(/Adını yaz/i), {
    target: { value: 'Test User' }
  });
  fireEvent.click(screen.getAllByRole('button')[0]); // Select emoji
  fireEvent.click(screen.getByText(/Devam Et/i));

  // Home screen
  expect(screen.getByText('Test User')).toBeInTheDocument();
  expect(screen.getByText(/Konu Seç/i)).toBeInTheDocument();
});
```

#### Flow 2: Complete Study Session
```javascript
test('completing study session updates score and analytics', () => {
  render(<App />);
  // ... navigate to study session
  // ... complete all cards
  // ... verify score updated
  // ... verify analytics updated
  // ... verify badge earned if applicable
});
```

#### Flow 3: Filter and Find Words
```javascript
test('user can filter words by category and type', () => {
  render(<App />);
  // ... navigate to words screen
  // ... apply category filter
  // ... apply favorites filter
  // ... verify correct words shown
});
```

**Integration Tests Recommended: ~8-10**

---

## Priority 4: Edge Cases & Error Handling

### Tests to Write

#### Empty State Tests
```javascript
test('handles no profile gracefully', () => {
  localStorage.clear();
  render(<App />);
  expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
});

test('displays message when no favorites exist', () => {
  render(<WordsScreen favorites={[]} />);
  fireEvent.click(screen.getByText(/Favoriler/i));
  expect(screen.getByText(/Kelime bulunamadı/i)).toBeInTheDocument();
});
```

#### Boundary Tests
```javascript
test('handles very long names correctly', () => {
  const longName = 'A'.repeat(100);
  render(<ProfileScreen />);
  fireEvent.change(screen.getByPlaceholderText(/Adını yaz/i), {
    target: { value: longName }
  });
  // Verify it renders or truncates appropriately
});

test('handles maximum level correctly', () => {
  const score = 10000; // Level 51
  const level = calculateLevel(score);
  expect(level).toBe(51);
});
```

#### Speech Synthesis Tests
```javascript
test('handles speech synthesis not available', () => {
  delete window.speechSynthesis;
  render(<StudyScreen />);
  // Should not crash, audio button should not appear
});
```

**Edge Case Tests Recommended: ~15**

---

## Priority 5: Performance & Load Testing

### Performance Tests

```javascript
test('renders large vocabulary list efficiently', () => {
  const startTime = performance.now();
  render(<WordsScreen words={initialVocabulary} />);
  const endTime = performance.now();

  expect(endTime - startTime).toBeLessThan(1000); // <1 second
});

test('analytics calculations are fast', () => {
  const largeHistory = Array(1000).fill({ /* session data */ });
  const startTime = performance.now();
  calculateOverallAccuracy(largeHistory);
  const endTime = performance.now();

  expect(endTime - startTime).toBeLessThan(100); // <100ms
});
```

**Performance Tests Recommended: ~5**

---

## Implementation Timeline

### Week 1: Component Extraction
- Days 1-2: Extract screen components
- Days 3-5: Write component tests (~46 tests)

### Week 2: Integration & Polish
- Days 1-2: Write integration tests (~10 tests)
- Days 3-4: Write edge case tests (~15 tests)
- Day 5: Performance tests and optimization (~5 tests)

**Total New Tests:** ~76
**Total Tests After Complete:** ~196 tests
**Estimated Coverage:** 75-85%

---

## Quick Wins (Do These First)

### 1. Update App.test.js (5 minutes)
```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  render(<App />);
  expect(screen.getByText(/vokabi/i)).toBeInTheDocument();
});
```

### 2. Add Basic Smoke Tests (10 minutes)
```javascript
test('all screens render without errors', () => {
  const screens = ['welcome', 'profile', 'home', 'study', 'words', 'stats'];
  screens.forEach(screen => {
    // Test each screen renders
  });
});
```

### 3. Test Navigation (15 minutes)
```javascript
test('navigation between screens works', () => {
  render(<App />);
  // Test all navigation paths
});
```

---

## Testing Tools & Setup

### Already Configured ✅
- Jest
- React Testing Library
- @testing-library/jest-dom
- @testing-library/user-event

### Might Want to Add
- `@testing-library/react-hooks` - for testing custom hooks
- `jest-localstorage-mock` - better localStorage mocking
- `msw` - if you add API calls in future

---

## Code Coverage Goals

### Current Coverage
```
Statements   : 90% (utilities only)
Branches     : 85% (utilities only)
Functions    : 95% (utilities only)
Lines        : 90% (utilities only)
```

### Target Coverage (After Component Tests)
```
Statements   : 75%
Branches     : 70%
Functions    : 80%
Lines        : 75%
```

### How to Check Coverage
```bash
npm test -- --coverage --watchAll=false
```

This generates a coverage report in `coverage/lcov-report/index.html`

---

## Common Testing Patterns for Your App

### Pattern 1: Testing State Updates
```javascript
test('score increases when answer is correct', () => {
  const { result } = renderHook(() => useState(0));
  const [score, setScore] = result.current;

  act(() => {
    setScore(score + 10);
  });

  expect(result.current[0]).toBe(10);
});
```

### Pattern 2: Testing User Interactions
```javascript
test('button click triggers callback', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick} />);

  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Pattern 3: Testing Conditional Rendering
```javascript
test('shows answer buttons only when card is flipped', () => {
  render(<StudyScreen />);

  expect(screen.queryByText(/Bildim/i)).not.toBeInTheDocument();

  fireEvent.click(screen.getByTestId('flashcard'));

  expect(screen.getByText(/Bildim/i)).toBeInTheDocument();
});
```

---

## Resources

### Documentation
- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Docs](https://jestjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Example Test Files
See existing test files in `src/utils/__tests__/` for patterns and examples.

---

## Summary

**Phase 1 (DONE):** ✅ Business logic tested (120 tests)
**Phase 2 (NEXT):** Extract components and test (~46 tests)
**Phase 3 (AFTER):** Integration tests (~10 tests)
**Phase 4 (POLISH):** Edge cases (~15 tests)
**Phase 5 (OPTIONAL):** Performance tests (~5 tests)

**Total Investment:** 1-2 weeks
**Total Benefit:** Confidence to refactor, catch bugs early, documentation, easier maintenance

**Recommendation:** Start with component extraction (Option B) for best long-term results.
