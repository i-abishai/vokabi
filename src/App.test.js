import { render, screen } from '@testing-library/react';
import App from './App';

test('renders vokabi app with welcome screen', () => {
  render(<App />);
  const appTitle = screen.getByText('vokabi');
  expect(appTitle).toBeInTheDocument();
});

test('renders welcome screen with start button', () => {
  render(<App />);
  const startButton = screen.getByText(/Başlayalım!/i);
  expect(startButton).toBeInTheDocument();
});
