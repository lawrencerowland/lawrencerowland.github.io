import { render, screen, fireEvent } from '@testing-library/react';
import DataAnalyticsExplorer from './App';

// Basic render test for the DataAnalyticsExplorer component
it('shows default analytics slider value and updates on change', () => {
  render(<DataAnalyticsExplorer />);
  const analyticsLabel = screen.getByText(/Analytics Position:/i);
  expect(analyticsLabel.textContent).toMatch(/Analytics Position: Established/);

  const sliders = screen.getAllByRole('slider');
  const analyticsSlider = sliders[0];
  expect(analyticsSlider.getAttribute('aria-valuenow') || analyticsSlider.value).toBe('75');

  fireEvent.change(analyticsSlider, { target: { value: 25 } });
  expect(analyticsLabel.textContent).toMatch(/Analytics Position: Emerging/);
});
