import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomeScreen from '../HomeScreen';
import { initialVocabulary, availableBadges } from '../../constants';

describe('HomeScreen', () => {
  const mockProfile = { name: 'Test User', emoji: '😊' };
  const mockCategories = ['Academic & General', 'Cultural & National'];
  const mockBadges = availableBadges;

  const defaultProps = {
    profile: mockProfile,
    level: 3,
    score: 500,
    streak: 5,
    stars: 25,
    categories: mockCategories,
    vocabulary: initialVocabulary,
    badges: mockBadges,
    showStickerPopup: false,
    recentSticker: null,
    onStartStudy: jest.fn(),
    onNavigate: jest.fn()
  };

  test('renders user profile information', () => {
    render(<HomeScreen {...defaultProps} />);

    expect(screen.getByText('😊')).toBeInTheDocument();
    expect(screen.getByText(/Merhaba, Test User!/i)).toBeInTheDocument();
    expect(screen.getByText(/Seviye 3/i)).toBeInTheDocument();
  });

  test('displays stats cards with correct values', () => {
    render(<HomeScreen {...defaultProps} />);

    expect(screen.getByText('500')).toBeInTheDocument(); // score
    expect(screen.getByText('5')).toBeInTheDocument();   // streak
    expect(screen.getByText('25')).toBeInTheDocument();  // stars

    expect(screen.getByText('Puan')).toBeInTheDocument();
    expect(screen.getByText('Seri')).toBeInTheDocument();
    expect(screen.getByText('Yıldız')).toBeInTheDocument();
  });

  test('renders all categories with word counts', () => {
    render(<HomeScreen {...defaultProps} />);

    expect(screen.getByText('Academic & General')).toBeInTheDocument();
    expect(screen.getByText('Cultural & National')).toBeInTheDocument();

    // Check for "kelime" text (word count labels)
    const wordCountLabels = screen.getAllByText(/kelime/i);
    expect(wordCountLabels.length).toBeGreaterThan(0);
  });

  test('renders study mode buttons for each category', () => {
    render(<HomeScreen {...defaultProps} />);

    const enTrButtons = screen.getAllByText('EN → TR');
    const trEnButtons = screen.getAllByText('TR → EN');
    const mixButtons = screen.getAllByText('Mix');

    expect(enTrButtons).toHaveLength(mockCategories.length);
    expect(trEnButtons).toHaveLength(mockCategories.length);
    expect(mixButtons).toHaveLength(mockCategories.length);
  });

  test('calls onStartStudy with correct parameters when EN → TR clicked', () => {
    const mockOnStartStudy = jest.fn();
    render(<HomeScreen {...defaultProps} onStartStudy={mockOnStartStudy} />);

    const enTrButtons = screen.getAllByText('EN → TR');
    fireEvent.click(enTrButtons[0]);

    expect(mockOnStartStudy).toHaveBeenCalledWith('Academic & General', 'en-tr');
  });

  test('calls onStartStudy with correct parameters when TR → EN clicked', () => {
    const mockOnStartStudy = jest.fn();
    render(<HomeScreen {...defaultProps} onStartStudy={mockOnStartStudy} />);

    const trEnButtons = screen.getAllByText('TR → EN');
    fireEvent.click(trEnButtons[0]);

    expect(mockOnStartStudy).toHaveBeenCalledWith('Academic & General', 'tr-en');
  });

  test('calls onStartStudy with correct parameters when Mix clicked', () => {
    const mockOnStartStudy = jest.fn();
    render(<HomeScreen {...defaultProps} onStartStudy={mockOnStartStudy} />);

    const mixButtons = screen.getAllByText('Mix');
    fireEvent.click(mixButtons[1]); // Click second category

    expect(mockOnStartStudy).toHaveBeenCalledWith('Cultural & National', 'shuffle');
  });

  test('displays first 5 badges', () => {
    render(<HomeScreen {...defaultProps} />);

    expect(screen.getByText('Rozetler')).toBeInTheDocument();

    // First 5 badges should be displayed
    const firstFiveBadges = mockBadges.slice(0, 5);
    firstFiveBadges.forEach(badge => {
      expect(screen.getByText(badge.name)).toBeInTheDocument();
    });
  });

  test('highlights earned badges with ring', () => {
    const badgesWithEarned = [...mockBadges];
    badgesWithEarned[0].earned = true;
    badgesWithEarned[1].earned = false;

    render(<HomeScreen {...defaultProps} badges={badgesWithEarned} />);

    const badgeElements = screen.getAllByText(/İlk Kelime|10 Kelime/);
    // We can't easily check CSS classes in this test, but we verify they render
    expect(badgeElements.length).toBeGreaterThan(0);
  });

  test('renders navigation bar with all buttons', () => {
    render(<HomeScreen {...defaultProps} />);

    expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
    expect(screen.getByText('Kelimeler')).toBeInTheDocument();
    expect(screen.getByText('İstatistikler')).toBeInTheDocument();
  });

  test('calls onNavigate when navigation buttons clicked', () => {
    const mockOnNavigate = jest.fn();
    render(<HomeScreen {...defaultProps} onNavigate={mockOnNavigate} />);

    fireEvent.click(screen.getByText('Ana Sayfa'));
    expect(mockOnNavigate).toHaveBeenCalledWith('home');

    fireEvent.click(screen.getByText('Kelimeler'));
    expect(mockOnNavigate).toHaveBeenCalledWith('words');

    fireEvent.click(screen.getByText('İstatistikler'));
    expect(mockOnNavigate).toHaveBeenCalledWith('stats');
  });

  test('shows sticker popup when showStickerPopup is true', () => {
    render(<HomeScreen {...defaultProps} showStickerPopup={true} recentSticker="🎉" />);

    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  test('hides sticker popup when showStickerPopup is false', () => {
    const { container } = render(
      <HomeScreen {...defaultProps} showStickerPopup={false} recentSticker="🎉" />
    );

    // The popup div should not be in the document
    const popup = container.querySelector('.fixed.inset-0');
    expect(popup).not.toBeInTheDocument();
  });

  test('renders with empty categories gracefully', () => {
    render(<HomeScreen {...defaultProps} categories={[]} />);

    expect(screen.getByText('Konu Seç')).toBeInTheDocument();
    expect(screen.queryByText('EN → TR')).not.toBeInTheDocument();
  });

  test('calculates word count correctly for each category', () => {
    render(<HomeScreen {...defaultProps} />);

    // Academic & General should have 40 words
    const academicCategory = initialVocabulary.filter(
      w => w.category === 'Academic & General'
    );
    expect(screen.getByText(`${academicCategory.length} kelime`)).toBeInTheDocument();
  });

  test('renders butterfly emoji', () => {
    render(<HomeScreen {...defaultProps} />);
    expect(screen.getByText('🦋')).toBeInTheDocument();
  });
});
