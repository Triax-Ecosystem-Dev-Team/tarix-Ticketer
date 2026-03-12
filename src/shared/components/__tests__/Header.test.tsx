import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

// Mock store hook
jest.mock('../../../modules/ticketer/store/useBookingStore', () => ({
  useBookingStore: jest.fn().mockReturnValue({
    user: { id: 'U1', name: 'Test', role: 'Ticketter', walletBalance: 0 },
  }),
}));

describe('Header component', () => {
  it('shows hamburger and toggles menu on mobile', () => {
    // Force small width
    global.innerWidth = 500;
    const { container } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const burger = container.querySelector('button[aria-label="Open navigation"]');
    expect(burger).toBeInTheDocument();

    fireEvent.click(burger!);
    expect(screen.getByText('Bus Status')).toBeVisible();

    const closeBtn = container.querySelector('button[aria-label="Close navigation"]');
    fireEvent.click(closeBtn!);
    expect(screen.queryByText('Bus Status')).not.toBeInTheDocument();
  });
});