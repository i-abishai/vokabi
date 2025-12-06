import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('Integration Tests - User Flows', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('User flow: Complete onboarding from welcome to home', () => {
    render(<App />);

    // Should start on welcome screen
    expect(screen.getByText('vokabi')).toBeInTheDocument();
    expect(screen.getByText(/İngilizce Kelime Öğrenme Oyunu/i)).toBeInTheDocument();

    // Click start button
    const startButton = screen.getByText(/Başlayalım!/i);
    fireEvent.click(startButton);

    // Should navigate to profile screen
    expect(screen.getByText('Profil Oluştur')).toBeInTheDocument();

    // Fill in name
    const nameInput = screen.getByPlaceholderText(/Adını yaz.../i);
    fireEvent.change(nameInput, { target: { value: 'Test User' } });

    // Select emoji (first one)
    const emojiButtons = screen.getAllByRole('button');
    const firstEmoji = emojiButtons.find(btn => btn.textContent === '😊');
    fireEvent.click(firstEmoji);

    // Click continue
    const continueButton = screen.getByText(/Devam Et/i);
    fireEvent.click(continueButton);

    // Should navigate to home screen
    expect(screen.getByText('Merhaba, Test User!')).toBeInTheDocument();
  });

  test('User flow: Navigate between screens using bottom navigation', () => {
    // Setup: Create profile first
    localStorage.setItem('vokabi_profile', JSON.stringify({ name: 'Test', emoji: '😊' }));
    render(<App />);

    // Should start on home screen (because profile exists)
    expect(screen.getByText('Merhaba, Test!')).toBeInTheDocument();

    // Navigate to Words screen
    const wordsButton = screen.getAllByText('Kelimeler')[0];
    fireEvent.click(wordsButton);
    expect(screen.getByText('Tüm Kelimeler')).toBeInTheDocument();

    // Navigate to Stats screen
    const statsButtons = screen.getAllByText('İstatistikler');
    fireEvent.click(statsButtons[0]);
    expect(screen.getAllByText('İstatistikler').length).toBeGreaterThan(0);
    expect(screen.getByText('Gelişimini takip et 📊')).toBeInTheDocument();

    // Navigate back to Home screen
    const homeButtons = screen.getAllByText('Ana Sayfa');
    fireEvent.click(homeButtons[0]);
    expect(screen.getByText('Merhaba, Test!')).toBeInTheDocument();
  });

  test('User flow: Word management - toggle favorite and view in favorites filter', () => {
    localStorage.setItem('vokabi_profile', JSON.stringify({ name: 'Test', emoji: '😊' }));
    render(<App />);

    // Navigate to Words screen
    const wordsButton = screen.getAllByText('Kelimeler')[0];
    fireEvent.click(wordsButton);

    // Find and favorite a word (first word in list)
    const heartButtons = screen.getAllByRole('button');
    const firstHeartButton = heartButtons.find(btn => {
      const svg = btn.querySelector('svg');
      return svg && svg.classList.contains('lucide-heart');
    });

    if (firstHeartButton) {
      fireEvent.click(firstHeartButton);

      // Filter by favorites
      const favoritesFilter = screen.getByText(/Favoriler \(1\)/i);
      fireEvent.click(favoritesFilter);

      // Should see favorited word
      expect(screen.queryByText('Kelime bulunamadı')).not.toBeInTheDocument();
    }
  });

  test('User flow: Stats persistence - score is saved and loaded', () => {
    // Set initial score
    localStorage.setItem('vokabi_profile', JSON.stringify({ name: 'Test', emoji: '😊' }));
    localStorage.setItem('vokabi_score', '500');
    localStorage.setItem('vokabi_level', '3');
    localStorage.setItem('vokabi_streak', '5');

    render(<App />);

    // Should display saved score
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Seviye 3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('User flow: Analytics are initialized correctly', () => {
    localStorage.setItem('vokabi_profile', JSON.stringify({ name: 'Test', emoji: '😊' }));

    const analytics = {
      studySessions: 10,
      totalWordsStudied: 50,
      dailyStreak: 3,
      accuracyByCategory: {},
      sessionHistory: [],
      strugglingWords: []
    };
    localStorage.setItem('vokabi_analytics', JSON.stringify(analytics));

    render(<App />);

    // Navigate to Stats
    const statsButtons = screen.getAllByText('İstatistikler');
    fireEvent.click(statsButtons[0]);

    // Verify analytics are displayed
    expect(screen.getByText('50')).toBeInTheDocument(); // total words studied
    expect(screen.getByText('10')).toBeInTheDocument(); // study sessions
  });

  test('User flow: Category filtering in Words screen', () => {
    localStorage.setItem('vokabi_profile', JSON.stringify({ name: 'Test', emoji: '😊' }));
    render(<App />);

    // Navigate to Words screen
    const wordsButton = screen.getAllByText('Kelimeler')[0];
    fireEvent.click(wordsButton);

    // Should show "Tümü" filter by default
    expect(screen.getByText('Tümü')).toBeInTheDocument();

    // Click on a category filter
    const categoryButtons = screen.getAllByRole('button');
    const academicButton = categoryButtons.find(btn => btn.textContent.includes('Academic'));

    if (academicButton) {
      fireEvent.click(academicButton);

      // Should still show words (filtered by category)
      expect(screen.queryByText('Kelime bulunamadı')).not.toBeInTheDocument();
    }
  });

  test('User flow: Badge system displays correctly', () => {
    localStorage.setItem('vokabi_profile', JSON.stringify({ name: 'Test', emoji: '😊' }));

    const badges = [
      { id: 'first_word', name: 'İlk Kelime', icon: '🎯', requirement: 'İlk kelimeyi öğren', earned: true },
      { id: 'ten_words', name: '10 Kelime', icon: '⭐', requirement: '10 kelime öğren', earned: false }
    ];
    localStorage.setItem('vokabi_badges', JSON.stringify(badges));

    render(<App />);

    // Home screen should show first 5 badges
    expect(screen.getByText('Rozetler')).toBeInTheDocument();
    expect(screen.getByText('İlk Kelime')).toBeInTheDocument();

    // Navigate to Stats to see all badges
    const statsButtons = screen.getAllByText('İstatistikler');
    fireEvent.click(statsButtons[0]);

    expect(screen.getByText('Tüm Rozetler')).toBeInTheDocument();
  });

  test('User flow: Progress bars display correctly in Stats', () => {
    localStorage.setItem('vokabi_profile', JSON.stringify({ name: 'Test', emoji: '😊' }));

    const analytics = {
      studySessions: 5,
      totalWordsStudied: 25,
      dailyStreak: 2,
      accuracyByCategory: {
        'Academic & General': { correct: 15, total: 20 }
      },
      sessionHistory: [],
      strugglingWords: []
    };
    localStorage.setItem('vokabi_analytics', JSON.stringify(analytics));

    render(<App />);

    // Navigate to Stats
    const statsButtons = screen.getAllByText('İstatistikler');
    fireEvent.click(statsButtons[0]);

    // Should show progress section
    expect(screen.getByText('Genel İlerleme')).toBeInTheDocument();
    expect(screen.getByText(/25 \/ 115 kelime çalışıldı/i)).toBeInTheDocument();

    // Should show category accuracy
    expect(screen.getByText('Konulara Göre Başarı')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument(); // 15/20 = 75%
  });
});
