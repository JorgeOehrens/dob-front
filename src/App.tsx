import { useApi, useAccount } from '@gear-js/react-hooks';

import { Header, Footer, ApiLoader } from '@/components';
import { withProviders } from '@/app/hocs';
import { Routing } from '@/pages';
import './App.scss';
import { CONTRACT_DATA, sponsorName, sponsorMnemonic } from "./app/consts";

import { useInitSails } from "./app/hooks";

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  const isAppReady = isApiReady && isAccountReady;
  useInitSails({
    network: 'wss://testnet.vara.network',
    contractId: CONTRACT_DATA.programId,
    idl: CONTRACT_DATA.idl,
    // You need to put name and mnemonic sponsor if you 
    // will use vouchers feature (vouchers are used for gasless,
    // and signless accounts)
    vouchersSigner: {
      sponsorName,
      sponsorMnemonic
    }
  });
  return (
    <>
      <Header />
      <main>{isAppReady ? <Routing /> : <ApiLoader />}</main>
      <Footer />
    </>
  );
}

export const App = withProviders(Component);
