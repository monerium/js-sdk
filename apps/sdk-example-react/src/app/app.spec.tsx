import { render, fireEvent, waitFor } from '@testing-library/react';
import { MoneriumClient } from '@monerium/sdk'; // replace with your actual import path
import App from './app';

jest.mock('@monerium/sdk', () => {
  const mockMoneriumClient = {
    getAccess: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn(),
    getAuthContext: jest
      .fn()
      .mockResolvedValue({ name: 'Test User', email: 'test@example.com' }),
    authorize: jest.fn(),
  };

  return {
    MoneriumClient: jest.fn(() => mockMoneriumClient),
    MoneriumContext: jest.fn(() => null),
    // mock other exports as needed
  };
});

describe('App', () => {
  // existing tests...

  it('should initialize MoneriumClient on mount', () => {
    render(<App />);
    expect(MoneriumClient).toHaveBeenCalledWith({
      environment: 'sandbox',
      clientId: 'f99e629b-6dca-11ee-8aa6-5273f65ed05b',
      redirectUrl: 'http://localhost:4200',
    });
  });

  it('should call monerium.getAccess on mount', async () => {
    const monerium = new MoneriumClient();
    render(<App />);
    await waitFor(() => expect(monerium.getAccess).toHaveBeenCalled());
  });

  it('should call monerium.getAuthContext when authorized', async () => {
    const monerium = new MoneriumClient();
    render(<App />);
    await waitFor(() => expect(monerium.getAuthContext).toHaveBeenCalled());
  });

  it('should display auth context name when authorized', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => expect(getByText('Test User')).toBeTruthy());
  });

  it('should call monerium.authorize when Connect button is clicked', async () => {
    const monerium = new MoneriumClient();
    const { getByText } = render(<App />);
    fireEvent.click(getByText('Connect'));
    expect(monerium.authorize).toHaveBeenCalled();
  });
});
