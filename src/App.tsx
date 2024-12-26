import { useAccount, useApi } from "@gear-js/react-hooks";
import { ApiLoader } from "@/components";
import { Header } from "@/components/layout";
import { withProviders } from "@/app/hocs";
import { Routing } from "./pages";
import { useInitSails } from "./app/hooks";
import { CONTRACT_DATA,CONTRACT_DATA_POOL, sponsorName, sponsorMnemonic } from "./app/consts";
import "@gear-js/vara-ui/dist/style.css";
import './App.scss';

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady, account } = useAccount();
  const isAppReady = isApiReady && isAccountReady ;

  // Put your contract id and idl
  useInitSails({
    network: 'wss://testnet.vara.network',
    contractId: CONTRACT_DATA_POOL.programId,
    idl: CONTRACT_DATA_POOL.idl,
    // You need to put name and mnemonic sponsor if you 
    // will use vouchers feature (vouchers are used for gasless,
    // and signless accounts)
    vouchersSigner: {
      sponsorName,
      sponsorMnemonic
    }
  });

  // App with context
  return (
    <>
      <Header isAccountVisible={isAccountReady} />
      {isAppReady ? <Routing /> : <ApiLoader />}
    </>
  );
}

export const App = withProviders(Component);
