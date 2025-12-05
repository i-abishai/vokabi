import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WelcomeScreen from '../WelcomeScreen';

describe('WelcomeScreen', () => {
  test('renders app title and description', () => {
    render(<WelcomeScreen onStart={() => {}} />);

    expect(screen.getByText('vokabi')).toBeInTheDocument();
    expect(screen.getByText('İngilizce Kelime Öğrenme Oyunu')).toBeInTheDocument();
  });

  test('renders emoji and start button', () => {
    render(<WelcomeScreen onStart={() => {}} />);

    expect(screen.getByText('🌸')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Başlayalım/i })).toBeInTheDocument();
  });

  test('calls onStart when start button is clicked', () => {
    const mockOnStart = jest.fn();
    render(<WelcomeScreen onStart={mockOnStart} />);

    const startButton = screen.getByRole('button', { name: /Başlayalım/i });
    fireEvent.click(startButton);

    expect(mockOnStart).toHaveBeenCalledTimes(1);
  });

  test('renders without crashing when no onStart provided', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText('vokabi')).toBeInTheDocument();
  });
});
