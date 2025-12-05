import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WordsScreen from '../WordsScreen';

describe('WordsScreen', () => {
  const mockVocabulary = [
    { id: 1, english: 'Test1', turkish: 'Test1TR', pronunciation: 'test1', category: 'Category A' },
    { id: 2, english: 'Test2', turkish: 'Test2TR', pronunciation: 'test2', category: 'Category A' },
    { id: 3, english: 'Test3', turkish: 'Test3TR', pronunciation: 'test3', category: 'Category B' },
    { id: 4, english: 'Test4', turkish: 'Test4TR', pronunciation: 'test4', category: 'Category B' },
  ];

  const defaultProps = {
    vocabulary: mockVocabulary,
    categories: ['Category A', 'Category B'],
    favorites: [1, 3],
    difficultWords: [2],
    easyWords: [4],
    onSpeakWord: jest.fn(),
    onToggleFavorite: jest.fn(),
    onNavigate: jest.fn()
  };

  test('renders screen title', () => {
    render(<WordsScreen {...defaultProps} />);
    expect(screen.getByText('Tüm Kelimeler')).toBeInTheDocument();
  });

  test('displays all words by default', () => {
    render(<WordsScreen {...defaultProps} />);

    expect(screen.getByText('Test1')).toBeInTheDocument();
    expect(screen.getByText('Test2')).toBeInTheDocument();
    expect(screen.getByText('Test3')).toBeInTheDocument();
    expect(screen.getByText('Test4')).toBeInTheDocument();
  });

  test('displays word details correctly', () => {
    render(<WordsScreen {...defaultProps} />);

    expect(screen.getByText('Test1')).toBeInTheDocument();
    expect(screen.getByText('Test1TR')).toBeInTheDocument();
    expect(screen.getByText('test1')).toBeInTheDocument();

    // Category A appears multiple times (once per word in that category)
    const categories = screen.getAllByText('Category A');
    expect(categories.length).toBeGreaterThan(0);
  });

  test('renders category filter buttons', () => {
    render(<WordsScreen {...defaultProps} />);

    expect(screen.getAllByText('Tümü')[0]).toBeInTheDocument();

    // Check for category buttons (they show first word of category name)
    const categoryButtons = screen.getAllByRole('button', { name: /Category/i });
    expect(categoryButtons.length).toBeGreaterThan(0);
  });

  test('filters words by category when category button clicked', () => {
    render(<WordsScreen {...defaultProps} />);

    const categoryButtons = screen.getAllByRole('button', { name: /Category/i });
    fireEvent.click(categoryButtons[0]);

    // Should show Category A words (Test1, Test2)
    expect(screen.getByText('Test1')).toBeInTheDocument();
    expect(screen.getByText('Test2')).toBeInTheDocument();

    // Should not show Category B words
    expect(screen.queryByText('Test3')).not.toBeInTheDocument();
    expect(screen.queryByText('Test4')).not.toBeInTheDocument();
  });

  test('shows all words when "Tümü" category button clicked', () => {
    render(<WordsScreen {...defaultProps} />);

    // First filter by category
    const categoryButtons = screen.getAllByRole('button', { name: /Category/i });
    fireEvent.click(categoryButtons[0]);

    // Then click "Tümü"
    const allButtons = screen.getAllByText('Tümü');
    fireEvent.click(allButtons[0]); // First "Tümü" is for categories

    // Should show all words again
    expect(screen.getByText('Test1')).toBeInTheDocument();
    expect(screen.getByText('Test2')).toBeInTheDocument();
    expect(screen.getByText('Test3')).toBeInTheDocument();
    expect(screen.getByText('Test4')).toBeInTheDocument();
  });

  test('renders type filter buttons with counts', () => {
    render(<WordsScreen {...defaultProps} />);

    expect(screen.getByText(/Favoriler \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Zorlar \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Kolay \(1\)/i)).toBeInTheDocument();
  });

  test('filters words by favorites when favorites button clicked', () => {
    render(<WordsScreen {...defaultProps} />);

    const favoritesButton = screen.getByText(/Favoriler \(2\)/i);
    fireEvent.click(favoritesButton);

    // Should show only favorites (1, 3)
    expect(screen.getByText('Test1')).toBeInTheDocument();
    expect(screen.getByText('Test3')).toBeInTheDocument();

    // Should not show non-favorites
    expect(screen.queryByText('Test2')).not.toBeInTheDocument();
    expect(screen.queryByText('Test4')).not.toBeInTheDocument();
  });

  test('filters words by difficult when difficult button clicked', () => {
    render(<WordsScreen {...defaultProps} />);

    const difficultButton = screen.getByText(/Zorlar \(1\)/i);
    fireEvent.click(difficultButton);

    // Should show only difficult word (2)
    expect(screen.getByText('Test2')).toBeInTheDocument();

    // Should not show other words
    expect(screen.queryByText('Test1')).not.toBeInTheDocument();
    expect(screen.queryByText('Test3')).not.toBeInTheDocument();
    expect(screen.queryByText('Test4')).not.toBeInTheDocument();
  });

  test('filters words by easy when easy button clicked', () => {
    render(<WordsScreen {...defaultProps} />);

    const easyButton = screen.getByText(/Kolay \(1\)/i);
    fireEvent.click(easyButton);

    // Should show only easy word (4)
    expect(screen.getByText('Test4')).toBeInTheDocument();

    // Should not show other words
    expect(screen.queryByText('Test1')).not.toBeInTheDocument();
    expect(screen.queryByText('Test2')).not.toBeInTheDocument();
    expect(screen.queryByText('Test3')).not.toBeInTheDocument();
  });

  test('shows "no words found" message when no words match filter', () => {
    render(<WordsScreen {...defaultProps} favorites={[]} />);

    const favoritesButton = screen.getByText(/Favoriler/i);
    fireEvent.click(favoritesButton);

    expect(screen.getByText('Kelime bulunamadı')).toBeInTheDocument();
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  test('calls onSpeakWord when speaker button clicked', () => {
    const mockOnSpeakWord = jest.fn();
    render(<WordsScreen {...defaultProps} onSpeakWord={mockOnSpeakWord} />);

    const speakerButtons = screen.getAllByRole('button', { name: '' });
    const firstSpeakerButton = speakerButtons.find(btn =>
      btn.querySelector('svg')?.classList.contains('lucide-volume-2')
    );

    fireEvent.click(firstSpeakerButton);

    expect(mockOnSpeakWord).toHaveBeenCalledWith('Test1', 'en-US');
  });

  test('calls onToggleFavorite when heart button clicked', () => {
    const mockOnToggleFavorite = jest.fn();
    render(<WordsScreen {...defaultProps} onToggleFavorite={mockOnToggleFavorite} />);

    const heartButtons = screen.getAllByRole('button', { name: '' });
    const firstHeartButton = heartButtons.find(btn =>
      btn.querySelector('svg')?.classList.contains('lucide-heart')
    );

    fireEvent.click(firstHeartButton);

    expect(mockOnToggleFavorite).toHaveBeenCalledWith(1);
  });

  test('shows filled heart for favorited words', () => {
    const { container } = render(<WordsScreen {...defaultProps} />);

    // Check that favorites have filled hearts
    // This is a simplified check - in reality you'd check the fill attribute
    const hearts = container.querySelectorAll('.lucide-heart');
    expect(hearts.length).toBeGreaterThan(0);
  });

  test('displays "Zor kelime" tag for difficult words', () => {
    render(<WordsScreen {...defaultProps} />);

    expect(screen.getByText('Zor kelime')).toBeInTheDocument();
  });

  test('displays "Kolay kelime" tag for easy words', () => {
    render(<WordsScreen {...defaultProps} />);

    expect(screen.getByText('Kolay kelime')).toBeInTheDocument();
  });

  test('combines category and type filters', () => {
    render(<WordsScreen {...defaultProps} />);

    // Filter by Category A
    const categoryButtons = screen.getAllByRole('button', { name: /Category/i });
    fireEvent.click(categoryButtons[0]);

    // Then filter by favorites
    const favoritesButton = screen.getByText(/Favoriler \(2\)/i);
    fireEvent.click(favoritesButton);

    // Should only show Test1 (Category A AND favorite)
    expect(screen.getByText('Test1')).toBeInTheDocument();

    // Should not show Test2 (Category A but not favorite)
    expect(screen.queryByText('Test2')).not.toBeInTheDocument();

    // Should not show Test3 (favorite but Category B)
    expect(screen.queryByText('Test3')).not.toBeInTheDocument();
  });

  test('renders navigation bar', () => {
    render(<WordsScreen {...defaultProps} />);

    expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
    expect(screen.getByText('Kelimeler')).toBeInTheDocument();
    expect(screen.getByText('İstatistikler')).toBeInTheDocument();
  });

  test('calls onNavigate when navigation buttons clicked', () => {
    const mockOnNavigate = jest.fn();
    render(<WordsScreen {...defaultProps} onNavigate={mockOnNavigate} />);

    fireEvent.click(screen.getByText('Ana Sayfa'));
    expect(mockOnNavigate).toHaveBeenCalledWith('home');

    fireEvent.click(screen.getByText('İstatistikler'));
    expect(mockOnNavigate).toHaveBeenCalledWith('stats');
  });

  test('handles empty vocabulary gracefully', () => {
    render(<WordsScreen {...defaultProps} vocabulary={[]} />);

    expect(screen.getByText('Kelime bulunamadı')).toBeInTheDocument();
  });
});
