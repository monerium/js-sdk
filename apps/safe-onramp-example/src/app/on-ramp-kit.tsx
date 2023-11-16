import { MoneriumPack, SafeMoneriumClient } from '@safe-global/onramp-kit';
import Safe, { EthersAdapter } from '@safe-global/protocol-kit';
import { OrderState } from '@monerium/sdk';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    ethereum: any;
  }
}

const CHAIN_ID = 5;

const web3Provider = new ethers.providers.Web3Provider(
  window.ethereum,
  CHAIN_ID
);

const safeOwner = web3Provider.getSigner();

const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: safeOwner });

const TEMP_SAFE_ADDRESS = '0x8C129070612c9352F05172016DeE4dF8c607A669';
const safeAddress = TEMP_SAFE_ADDRESS;
const authCode = '';
const refreshToken = '';

const Foobar = () => {
  const [safeSdk, setSafeSdk] = useState<Safe>();
  const [monerium, setMonerium] = useState<any>();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await web3Provider.send('eth_requestAccounts', []);
      } catch (e) {
        console.log(e);
      }
      try {
        const moneriumPack = new MoneriumPack({
          redirectUrl: 'http://localhost:4201',
          clientId: 'f99e629b-6dca-11ee-8aa6-5273f65ed05b',
          environment: 'sandbox',
        });

        const safeSdk = await Safe.create({
          ethAdapter: ethAdapter,
          safeAddress,
          isL1SafeMasterCopy: true,
        });
        await moneriumPack.init({
          safeSdk,
        });
        moneriumPack.subscribe(OrderState.pending, (notification) => {
          console.log(notification.meta.state);
        });

        moneriumPack.subscribe(OrderState.placed, (notification) => {
          console.log(notification.meta.state);
        });
        setMonerium(moneriumPack);
      } catch (e) {
        console.log(e);
      }
    };
    init();

    return () => {
      monerium?.close();
    };
  }, [web3Provider]);

  // useEffect(() => {
  //   const authContext = await monerium.getAuthContext();
  //   const profile = await monerium.getProfile(authContext.defaultProfile);
  //   const balances = await monerium.getBalances();
  //   const orders = await monerium.getOrders();

  //   if (moneriumClient.bearerProfile) {
  //     localStorage.setItem(
  //       MONERIUM_TOKEN,
  //       moneriumClient.bearerProfile.refresh_token
  //     );
  //   }
  // }, [monerium])

  useEffect(() => {
    (async () => {
      await monerium?.open();
    })();
  }, [monerium]);
  return (
    <button
      onClick={async () => await monerium.open({ initiateAuthFlow: true })}
    >
      Connect to Monerium
    </button>
  );
};
export default Foobar;
