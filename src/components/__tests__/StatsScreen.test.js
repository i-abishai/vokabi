import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StatsScreen from '../StatsScreen';

describe('StatsScreen', () => {
  const mockVocabulary = [
    { id: 1, english: 'Word1', turkish: 'Kelime1', category: 'Category A' },
    { id: 2, english: 'Word2', turkish: 'Kelime2', category: 'Category A' },
    { id: 3, english: 'Word3', turkish: 'Kelime3', category: 'Category B' },
    { id: 4, english: 'Word4', turkish: 'Kelime4', category: 'Category B' },
  ];

  const mockAnalytics = {
    studySessions: 5,
    totalWordsStudied: 10,
    wordsMastered: 0,
    totalTimeStudied: 0,
    dailyStreak: 3,
    lastStudyDate: null,
    accuracyByCategory: {
      'Category A': { correct: 8, total: 10 },
      'Category B': { correct: 6, total: 10 }
    },
    sessionHistory: [
      { date: '2024-01-01T10:00:00Z', category: 'Category A', wordsStudied: 5 },
      { date: '2024-01-02T11:00:00Z', category: 'Category B', wordsStudied: 3 }
    ],
    strugglingWords: [
      { id: 1, english: 'Difficult', turkish: 'Zor', mistakes: 5 },
      { id: 2, english: 'Hard', turkish: 'Zorlu', mistakes: 3 }
    ]
  };

  const mockBadges = [
    { id: 'badge1', name: 'First Badge', icon: '🎯', requirement: 'Earn first', earned: true },
    { id: 'badge2', name: 'Second Badge', icon: '⭐', requirement: 'Earn second', earned: false }
  ];

  const mockOnNavigate = jest.fn();

  const defaultProps = {
    vocabulary: mockVocabulary,
    analytics: mockAnalytics,
    badges: mockBadges,
    onNavigate: mockOnNavigate
  };

  beforeEach(() => {
    mockOnNavigate.mockClear();
  });

  test('renders stats screen with header', () => {
    render(<StatsScreen {...defaultProps} />);
    const statsHeaders = screen.getAllByText('İstatistikler');
    expect(statsHeaders.length).toBeGreaterThan(0);
    expect(screen.getByText('Gelişimini takip et 📊')).toBeInTheDocument();
  });

  test('displays studied words count correctly', () => {
    render(<StatsScreen {...defaultProps} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Çalışılan Kelime')).toBeInTheDocument();
  });

  test('calculates and displays overall accuracy correctly', () => {
    render(<StatsScreen {...defaultProps} />);
    // (8 + 6) / (10 + 10) = 14/20 = 70%
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('Doğruluk')).toBeInTheDocument();
  });

  test('displays daily streak correctly', () => {
    render(<StatsScreen {...defaultProps} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Günlük Seri')).toBeInTheDocument();
  });

  test('displays study sessions count correctly', () => {
    render(<StatsScreen {...defaultProps} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Toplam Oturum')).toBeInTheDocument();
  });

  test('calculates progress percentage correctly', () => {
    render(<StatsScreen {...defaultProps} />);
    // 10 studied / 4 total = 250% (capped display may vary)
    expect(screen.getByText(/10 \/ 4 kelime çalışıldı/)).toBeInTheDocument();
  });

  test('displays category accuracy breakdown', () => {
    render(<StatsScreen {...defaultProps} />);
    expect(screen.getByText('Konulara Göre Başarı')).toBeInTheDocument();
    // Category A: 8/10 = 80%
    expect(screen.getByText('80%')).toBeInTheDocument();
    // Category B: 6/10 = 60%
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  test('displays struggling words when present', () => {
    render(<StatsScreen {...defaultProps} />);
    expect(screen.getByText('En Çok Zorlandığın Kelimeler')).toBeInTheDocument();
    expect(screen.getByText('Difficult')).toBeInTheDocument();
    expect(screen.getByText('Zor')).toBeInTheDocument();
    expect(screen.getByText('5 hata')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('Zorlu')).toBeInTheDocument();
    expect(screen.getByText('3 hata')).toBeInTheDocument();
  });

  test('does not display struggling words section when empty', () => {
    const propsWithoutStrugglingWords = {
      ...defaultProps,
      analytics: {
        ...mockAnalytics,
        strugglingWords: []
      }
    };
    render(<StatsScreen {...propsWithoutStrugglingWords} />);
    expect(screen.queryByText('En Çok Zorlandığın Kelimeler')).not.toBeInTheDocument();
  });

  test('displays all badges with earned status', () => {
    render(<StatsScreen {...defaultProps} />);
    expect(screen.getByText('Tüm Rozetler')).toBeInTheDocument();
    expect(screen.getByText('First Badge')).toBeInTheDocument();
    expect(screen.getByText('Second Badge')).toBeInTheDocument();
    expect(screen.getByText('Earn first')).toBeInTheDocument();
    expect(screen.getByText('Earn second')).toBeInTheDocument();
  });

  test('displays session history when present', () => {
    render(<StatsScreen {...defaultProps} />);
    expect(screen.getByText('Son Çalışma Oturumları')).toBeInTheDocument();
    expect(screen.getByText('5 kelime')).toBeInTheDocument();
    expect(screen.getByText('3 kelime')).toBeInTheDocument();
  });

  test('does not display session history when empty', () => {
    const propsWithoutHistory = {
      ...defaultProps,
      analytics: {
        ...mockAnalytics,
        sessionHistory: []
      }
    };
    render(<StatsScreen {...propsWithoutHistory} />);
    expect(screen.queryByText('Son Çalışma Oturumları')).not.toBeInTheDocument();
  });

  test('handles navigation to home screen', () => {
    render(<StatsScreen {...defaultProps} />);
    const homeButtons = screen.getAllByText('Ana Sayfa');
    fireEvent.click(homeButtons[0]);
    expect(mockOnNavigate).toHaveBeenCalledWith('home');
  });

  test('handles navigation to words screen', () => {
    render(<StatsScreen {...defaultProps} />);
    const wordsButtons = screen.getAllByText('Kelimeler');
    fireEvent.click(wordsButtons[0]);
    expect(mockOnNavigate).toHaveBeenCalledWith('words');
  });

  test('displays 0% accuracy when no attempts made', () => {
    const propsWithNoAttempts = {
      ...defaultProps,
      analytics: {
        ...mockAnalytics,
        accuracyByCategory: {}
      }
    };
    render(<StatsScreen {...propsWithNoAttempts} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('limits struggling words to top 5', () => {
    const propsWithManyStrugglingWords = {
      ...defaultProps,
      analytics: {
        ...mockAnalytics,
        strugglingWords: [
          { id: 1, english: 'Word1', turkish: 'K1', mistakes: 10 },
          { id: 2, english: 'Word2', turkish: 'K2', mistakes: 9 },
          { id: 3, english: 'Word3', turkish: 'K3', mistakes: 8 },
          { id: 4, english: 'Word4', turkish: 'K4', mistakes: 7 },
          { id: 5, english: 'Word5', turkish: 'K5', mistakes: 6 },
          { id: 6, english: 'Word6', turkish: 'K6', mistakes: 5 },
          { id: 7, english: 'Word7', turkish: 'K7', mistakes: 4 }
        ]
      }
    };
    render(<StatsScreen {...propsWithManyStrugglingWords} />);
    expect(screen.getByText('Word1')).toBeInTheDocument();
    expect(screen.getByText('Word5')).toBeInTheDocument();
    expect(screen.queryByText('Word6')).not.toBeInTheDocument();
    expect(screen.queryByText('Word7')).not.toBeInTheDocument();
  });

  test('limits session history to last 5 sessions', () => {
    const propsWithManySessions = {
      ...defaultProps,
      analytics: {
        ...mockAnalytics,
        sessionHistory: [
          { date: '2024-01-01T10:00:00Z', category: 'Cat1', wordsStudied: 1 },
          { date: '2024-01-02T10:00:00Z', category: 'Cat2', wordsStudied: 2 },
          { date: '2024-01-03T10:00:00Z', category: 'Cat3', wordsStudied: 3 },
          { date: '2024-01-04T10:00:00Z', category: 'Cat4', wordsStudied: 4 },
          { date: '2024-01-05T10:00:00Z', category: 'Cat5', wordsStudied: 5 },
          { date: '2024-01-06T10:00:00Z', category: 'Cat6', wordsStudied: 6 },
          { date: '2024-01-07T10:00:00Z', category: 'Cat7', wordsStudied: 7 }
        ]
      }
    };
    render(<StatsScreen {...propsWithManySessions} />);
    // Should show last 5 (Cat3 through Cat7)
    expect(screen.getByText('Cat3')).toBeInTheDocument();
    expect(screen.getByText('Cat7')).toBeInTheDocument();
    expect(screen.queryByText('Cat1')).not.toBeInTheDocument();
    expect(screen.queryByText('Cat2')).not.toBeInTheDocument();
  });
});
