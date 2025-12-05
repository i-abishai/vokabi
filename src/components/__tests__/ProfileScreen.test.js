import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileScreen from '../ProfileScreen';

describe('ProfileScreen', () => {
  test('renders profile creation form', () => {
    render(<ProfileScreen onCreateProfile={() => {}} />);

    expect(screen.getByText('Profil Oluştur')).toBeInTheDocument();
    expect(screen.getByText('Adın ne?')).toBeInTheDocument();
    expect(screen.getByText('Bir emoji seç:')).toBeInTheDocument();
  });

  test('renders name input field', () => {
    render(<ProfileScreen onCreateProfile={() => {}} />);

    const nameInput = screen.getByPlaceholderText('Adını yaz...');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('');
  });

  test('updates name when typing', () => {
    render(<ProfileScreen onCreateProfile={() => {}} />);

    const nameInput = screen.getByPlaceholderText('Adını yaz...');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });

    expect(nameInput).toHaveValue('Test User');
  });

  test('renders emoji selection grid', () => {
    render(<ProfileScreen onCreateProfile={() => {}} />);

    // emojiOptions has 15 emojis
    const emojiButtons = screen.getAllByRole('button').filter(
      btn => btn.textContent.match(/[\u{1F300}-\u{1F9FF}]/u)
    );
    expect(emojiButtons.length).toBeGreaterThan(0);
  });

  test('selects emoji when clicked', () => {
    render(<ProfileScreen onCreateProfile={() => {}} />);

    const emojiButtons = screen.getAllByRole('button');
    const firstEmojiButton = emojiButtons[0];

    fireEvent.click(firstEmojiButton);

    // Check if button has the selected class
    expect(firstEmojiButton).toHaveClass('bg-purple-200');
    expect(firstEmojiButton).toHaveClass('ring-4');
  });

  test('submit button is disabled when name is empty', () => {
    render(<ProfileScreen onCreateProfile={() => {}} />);

    const submitButton = screen.getByRole('button', { name: /Devam Et/i });
    expect(submitButton).toBeDisabled();
  });

  test('submit button is disabled when emoji is not selected', () => {
    render(<ProfileScreen onCreateProfile={() => {}} />);

    const nameInput = screen.getByPlaceholderText('Adını yaz...');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });

    const submitButton = screen.getByRole('button', { name: /Devam Et/i });
    expect(submitButton).toBeDisabled();
  });

  test('submit button is enabled when both name and emoji are provided', () => {
    render(<ProfileScreen onCreateProfile={() => {}} />);

    const nameInput = screen.getByPlaceholderText('Adını yaz...');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });

    const emojiButtons = screen.getAllByRole('button');
    fireEvent.click(emojiButtons[0]);

    const submitButton = screen.getByRole('button', { name: /Devam Et/i });
    expect(submitButton).not.toBeDisabled();
  });

  test('calls onCreateProfile with correct data when submitted', () => {
    const mockOnCreateProfile = jest.fn();
    render(<ProfileScreen onCreateProfile={mockOnCreateProfile} />);

    const nameInput = screen.getByPlaceholderText('Adını yaz...');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });

    const emojiButtons = screen.getAllByRole('button');
    const firstEmoji = emojiButtons[0].textContent;
    fireEvent.click(emojiButtons[0]);

    const submitButton = screen.getByRole('button', { name: /Devam Et/i });
    fireEvent.click(submitButton);

    expect(mockOnCreateProfile).toHaveBeenCalledTimes(1);
    expect(mockOnCreateProfile).toHaveBeenCalledWith('Test User', firstEmoji);
  });

  test('does not call onCreateProfile when form is incomplete', () => {
    const mockOnCreateProfile = jest.fn();
    render(<ProfileScreen onCreateProfile={mockOnCreateProfile} />);

    const nameInput = screen.getByPlaceholderText('Adını yaz...');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });

    // Don't select emoji
    const submitButton = screen.getByRole('button', { name: /Devam Et/i });
    fireEvent.click(submitButton);

    expect(mockOnCreateProfile).not.toHaveBeenCalled();
  });

  test('allows changing emoji selection', () => {
    render(<ProfileScreen onCreateProfile={() => {}} />);

    const emojiButtons = screen.getAllByRole('button');

    // Select first emoji
    fireEvent.click(emojiButtons[0]);
    expect(emojiButtons[0]).toHaveClass('bg-purple-200');

    // Select second emoji
    fireEvent.click(emojiButtons[1]);
    expect(emojiButtons[1]).toHaveClass('bg-purple-200');
    expect(emojiButtons[0]).not.toHaveClass('bg-purple-200');
  });
});
