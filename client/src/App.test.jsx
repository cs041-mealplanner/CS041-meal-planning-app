import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the landing page hero and navbar', async () => {
    render(<App />);

    // Navbar brand link
    expect(
      screen.getByRole('link', { name: /Nourishly/i })
    ).toBeInTheDocument();

    // Navbar login link
    expect(
      screen.getByRole('link', { name: /Login/i })
    ).toBeInTheDocument();

    // Landing page hero heading
    expect(
      await screen.findByRole('heading', {
        name: /Plan your perfect\s*week of meals/i,
      })
    ).toBeInTheDocument();
  });
});
