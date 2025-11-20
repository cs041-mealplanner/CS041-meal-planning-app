import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock "fetch" globally (prevents real API calls during tests)
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ status: "ok" }),
  })
);

// 
test("renders health status from API", async () => {
  // Render the App component into the test DOM
  render(<App />);

  // Verify the initial UI state before the fetch resolves
  expect(screen.getByText(/API health status/i)).toBeInTheDocument();
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for the component to update after the mocked fetch resolves
  const statusEl = await screen.findByText(/ok/i); // Waits until mock fetch resolves

  // Confirm that the final UI shows the fetched API status
  expect(statusEl).toBeInTheDocument();
});
