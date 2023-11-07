/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  MoneriumClient,
  LinkAddress,
  Profile,
  Balances,
  Order,
  NewOrder,
} from '@monerium/sdk';

// Create a context
export const MoneriumContext = createContext({
  authorize: async () => {},
  // connect: async () => {},
  // getProfile: async () => {},
  // getBalances: async () => {},
  placeOrder: async () => {},
  profile: null,
  balances: null,
  orders: null,
  tokens: null,
  isAuthorized: false,
  loading: false,
  loadingPlaceOrder: false,
  error: null,
});

// Provider component
export function MoneriumProvider({
  children,
  clientId = 'f99e629b-6dca-11ee-8aa6-5273f65ed05b',
  redirectUrl = 'http://localhost:5173',
}) {
  const [monerium, setMonerium] = useState<MoneriumClient>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>(null);
  const [balances, setBalances] = useState<Balances[]>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
  const [loadingLinkAddress, setLoadingLinkAddress] = useState(false);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState<Order[]>(null);
  const [tokens, setTokens] = useState(null);

  // Initialize the SDK
  useEffect(() => {
    const sdk = new MoneriumClient({
      clientId,
      redirectUrl,
    });
    setMonerium(sdk);
  }, []);

  useEffect(() => {
    const connect = async () => {
      if (monerium) {
        setIsAuthorized(await monerium.connect());
      }
    };

    connect();

    return () => {
      monerium.disconnect();
    };
  }, [monerium]);

  useEffect(() => {
    const fetchData = async () => {
      if (monerium && isAuthorized) {
        try {
          setLoading(true);
          const authCtx = await monerium.getAuthContext();
          const profileData = await monerium.getProfile(authCtx.defaultProfile);
          const balanceData = await monerium.getBalances();
          const ordersData = await monerium.getOrders();
          const tokensData = await monerium.getTokens();
          setProfile(profileData);
          setBalances(balanceData);
          setOrders(ordersData);
          setTokens(tokensData);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [monerium, isAuthorized]);

  const authorize = useCallback(async () => {
    try {
      await monerium.authorize();
    } catch (err) {
      console.error('Error during authorization:', err);
      setError(err);
    }
  }, [monerium]);

  const getBalances = useCallback(async () => {
    if (monerium && isAuthorized) {
      try {
        setLoadingBalances(true);
        const balances = await monerium.getBalances();
        setBalances(balances);
      } catch (err) {
        console.error('Error getting balances:', err);
        setError(err);
      } finally {
        setLoadingBalances(false);
      }
    }
  }, [monerium, isAuthorized]);

  const placeOrder = useCallback(
    async (orderDetails: NewOrder, supportingDocument?: File) => {
      if (monerium && isAuthorized) {
        try {
          setLoadingPlaceOrder(true);

          let documentId;
          if (orderDetails.amount > 15000) {
            const uploadedDocument = await monerium.uploadSupportDocument(
              supportingDocument
            );
            documentId = uploadedDocument.id;
          }

          const newOrderDetails = {
            ...orderDetails,
            documentId: documentId,
          };

          const newOrder = await monerium.placeOrder(newOrderDetails);
          setOrders((prevOrders) => [...prevOrders, newOrder]);
        } catch (err) {
          console.error('Error placing order:', err);
          setError(err);
        } finally {
          setLoadingPlaceOrder(false);
        }
      }
    },
    [monerium, isAuthorized]
  );

  const linkAddress = useCallback(
    async (addressDetails: LinkAddress) => {
      if (monerium && isAuthorized) {
        try {
          setLoadingLinkAddress(true);
          const linkedAddress = await monerium.linkAddress(
            profile.id,
            addressDetails
          );

          // Update your state or do something with linkedAddress
        } catch (err) {
          console.error('Error linking address:', err);
          setError(err);
        } finally {
          setLoadingLinkAddress(false);
        }
      }
    },
    [monerium, isAuthorized, profile]
  );

  return (
    <MoneriumContext.Provider
      value={{
        authorize,
        isAuthorized,
        profile,
        balances,
        loading,
        loadingPlaceOrder,
        loadingLinkAddress,
        loadingBalances,
        getBalances,
        linkAddress,
        placeOrder,
        orders,
        tokens,
        error,
      }}
    >
      {children}
    </MoneriumContext.Provider>
  );
}

// Custom hook to use the Monerium SDK
export function useMonerium() {
  const context = useContext(MoneriumContext);
  if (context === null) {
    throw new Error('useMonerium must be used within a MoneriumProvider');
  }
  return context;
}
