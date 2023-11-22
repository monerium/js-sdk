import { render, fireEvent, waitFor } from '@testing-library/react';
import { useMonerium, MoneriumProvider } from '@monerium/sdk-react-provider';
import Index from '../pages/index';

jest.mock('@monerium/sdk-react-provider', () => ({
  useMonerium: jest.fn().mockReturnValue({
    authorize: jest.fn(),
    // add other properties if needed
  }),
  MoneriumProvider: ({ children }) => children,
}));

describe('Index', () => {
  it('should render successfully', () => {
    const baseElement = render(
      <MoneriumProvider clientId="xx" redirectUrl="123">
        <Index />
      </MoneriumProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should display Authorize button when not authorized', () => {
    (useMonerium as jest.Mock).mockReturnValue({
      isAuthorized: false,
    });
    const { getByText } = render(<Index />);
    expect(getByText('Authorize')).toBeTruthy();
  });

  it('should call authorize function when Authorize button is clicked', () => {
    const authorize = jest.fn();
    (useMonerium as jest.Mock).mockReturnValue({
      isAuthorized: false,
      authorize,
    });
    const { getByText } = render(<Index />);
    fireEvent.click(getByText('Authorize'));
    expect(authorize).toHaveBeenCalled();
  });

  it('should display Authorized when authorized', () => {
    (useMonerium as jest.Mock).mockReturnValue({
      isAuthorized: true,
    });
    const { getByText } = render(<Index />);
    expect(getByText('Authorized')).toBeTruthy();
  });

  it('should display Loading... when loading', () => {
    (useMonerium as jest.Mock).mockReturnValue({
      loading: true,
    });
    const { getByText } = render(<Index />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should display profile, balances, tokens, and orders when provided', () => {
    const profile = { name: 'Test User' };
    const balances = { balance: 100 };
    const tokens = ['token1', 'token2'];
    const orders = ['order1', 'order2'];
    (useMonerium as jest.Mock).mockReturnValue({
      isAuthorized: true,
      profile,
      balances,
      tokens,
      orders,
    });
    const { getByText } = render(<Index />);
    expect(getByText(`Profile: ${JSON.stringify(profile)}`)).toBeTruthy();
    expect(getByText(`Balances: ${JSON.stringify(balances)}`)).toBeTruthy();
    expect(getByText(`tokens: ${JSON.stringify(tokens)}`)).toBeTruthy();
    expect(getByText(`orders: ${JSON.stringify(orders)}`)).toBeTruthy();
  });
});
