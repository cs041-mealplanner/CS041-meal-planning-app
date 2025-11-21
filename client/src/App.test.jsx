import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the homepage hero and nav', () => {
    render(<App />);

    // Navbar brand
    expect(screen.getByText(/Nourishly/i)).toBeInTheDocument();

    // Hero headline
    expect(
      screen.getByText(/Plan Your Meals With Ease/i)
    ).toBeInTheDocument();

    // One of the "Get Started" buttons
    expect(screen.getAllByText(/Get Started/i)[0]).toBeInTheDocument();
  });
});
