import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StudyScreen from '../StudyScreen';

describe('StudyScreen', () => {
  const mockStudyCards = [
    {
      id: 1,
      english: 'Hello',
      turkish: 'Merhaba',
      pronunciation: 'helou',
      front: 'Hello',
      back: 'Merhaba',
      frontLang: 'en',
      backLang: 'tr'
    },
    {
      id: 2,
      english: 'World',
      turkish: 'Dünya',
      pronunciation: 'wörld',
      front: 'Dünya',
      back: 'World',
      frontLang: 'tr',
      backLang: 'en'
    }
  ];

  const mockOnFlipCard = jest.fn();
  const mockOnAnswer = jest.fn();
  const mockOnSpeakWord = jest.fn();
  const mockOnToggleFavorite = jest.fn();
  const mockOnNavigate = jest.fn();

  const defaultProps = {
    studyCards: mockStudyCards,
    currentCardIndex: 0,
    isFlipped: false,
    streak: 5,
    stars: 10,
    favorites: [],
    onFlipCard: mockOnFlipCard,
    onAnswer: mockOnAnswer,
    onSpeakWord: mockOnSpeakWord,
    onToggleFavorite: mockOnToggleFavorite,
    onNavigate: mockOnNavigate
  };

  beforeEach(() => {
    mockOnFlipCard.mockClear();
    mockOnAnswer.mockClear();
    mockOnSpeakWord.mockClear();
    mockOnToggleFavorite.mockClear();
    mockOnNavigate.mockClear();
  });

  test('renders study screen with first card', () => {
    render(<StudyScreen {...defaultProps} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  test('displays pronunciation when front is English', () => {
    render(<StudyScreen {...defaultProps} />);
    expect(screen.getByText('helou')).toBeInTheDocument();
  });

  test('does not display pronunciation when front is Turkish', () => {
    const propsWithTurkishFront = {
      ...defaultProps,
      currentCardIndex: 1
    };
    render(<StudyScreen {...propsWithTurkishFront} />);
    expect(screen.getByText('Dünya')).toBeInTheDocument();
    // Pronunciation should be in the back face (hidden), not front face
    // We verify this by checking the front card doesn't have pronunciation style
    const frontCard = screen.getByText('Dünya').parentElement;
    expect(frontCard.querySelector('.text-pink-100')).not.toBeInTheDocument();
  });

  test('displays streak and stars correctly', () => {
    render(<StudyScreen {...defaultProps} />);
    expect(screen.getByText('5')).toBeInTheDocument(); // streak
    expect(screen.getByText('10')).toBeInTheDocument(); // stars
  });

  test('flips card when clicked', () => {
    render(<StudyScreen {...defaultProps} />);
    const card = screen.getByText('Hello').closest('.cursor-pointer');
    fireEvent.click(card);
    expect(mockOnFlipCard).toHaveBeenCalledWith(true);
  });

  test('displays back of card when flipped', () => {
    const propsFlipped = {
      ...defaultProps,
      isFlipped: true
    };
    render(<StudyScreen {...propsFlipped} />);
    expect(screen.getByText('Merhaba')).toBeInTheDocument();
  });

  test('shows audio button when front is English', () => {
    render(<StudyScreen {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    // Should have: back button, audio button, favorite button = 3 buttons
    expect(buttons.length).toBe(3);
  });

  test('does not show audio button when front is Turkish', () => {
    const propsWithTurkishFront = {
      ...defaultProps,
      currentCardIndex: 1
    };
    render(<StudyScreen {...propsWithTurkishFront} />);
    const buttons = screen.getAllByRole('button');
    // Should have back button and favorite button only (not audio button)
    expect(buttons.length).toBe(2);
  });

  test('calls onSpeakWord when audio button clicked', () => {
    render(<StudyScreen {...defaultProps} />);
    const audioButtons = screen.getAllByRole('button');
    // Find the audio button (first interactive button after back arrow)
    const audioButton = audioButtons[1];
    fireEvent.click(audioButton);
    expect(mockOnSpeakWord).toHaveBeenCalledWith('Hello', 'en-US');
  });

  test('toggles favorite when heart button clicked', () => {
    render(<StudyScreen {...defaultProps} />);
    const favoriteButtons = screen.getAllByRole('button');
    // Heart button should be the last among visible buttons before flip
    const heartButton = favoriteButtons[favoriteButtons.length - 1];
    fireEvent.click(heartButton);
    expect(mockOnToggleFavorite).toHaveBeenCalledWith(1);
  });

  test('shows favorite button as filled when word is favorited', () => {
    const propsWithFavorite = {
      ...defaultProps,
      favorites: [1]
    };
    const { container } = render(<StudyScreen {...propsWithFavorite} />);
    const pinkButton = container.querySelector('.bg-pink-500');
    expect(pinkButton).toBeInTheDocument();
  });

  test('shows answer buttons only when card is flipped', () => {
    const { rerender } = render(<StudyScreen {...defaultProps} />);
    expect(screen.queryByText('Bildim')).not.toBeInTheDocument();
    expect(screen.queryByText('Bilmedim')).not.toBeInTheDocument();

    rerender(<StudyScreen {...defaultProps} isFlipped={true} />);
    expect(screen.getByText('Bildim')).toBeInTheDocument();
    expect(screen.getByText('Bilmedim')).toBeInTheDocument();
  });

  test('calls onAnswer with true when Bildim clicked', () => {
    const propsFlipped = {
      ...defaultProps,
      isFlipped: true
    };
    render(<StudyScreen {...propsFlipped} />);
    const bildimButton = screen.getByText('Bildim');
    fireEvent.click(bildimButton);
    expect(mockOnAnswer).toHaveBeenCalledWith(true);
  });

  test('calls onAnswer with false when Bilmedim clicked', () => {
    const propsFlipped = {
      ...defaultProps,
      isFlipped: true
    };
    render(<StudyScreen {...propsFlipped} />);
    const bilmedimButton = screen.getByText('Bilmedim');
    fireEvent.click(bilmedimButton);
    expect(mockOnAnswer).toHaveBeenCalledWith(false);
  });

  test('navigates to home when back button clicked', () => {
    render(<StudyScreen {...defaultProps} />);
    const backButton = screen.getAllByRole('button')[0];
    fireEvent.click(backButton);
    expect(mockOnNavigate).toHaveBeenCalledWith('home');
  });

  test('displays progress correctly for second card', () => {
    const propsSecondCard = {
      ...defaultProps,
      currentCardIndex: 1
    };
    render(<StudyScreen {...propsSecondCard} />);
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });

  test('returns null when card index is invalid', () => {
    const propsInvalidIndex = {
      ...defaultProps,
      currentCardIndex: 99
    };
    const { container } = render(<StudyScreen {...propsInvalidIndex} />);
    expect(container.firstChild).toBeNull();
  });

  test('displays flip instruction text on front of card', () => {
    render(<StudyScreen {...defaultProps} />);
    expect(screen.getByText('Çevirmek için tıkla 👆')).toBeInTheDocument();
  });
});
