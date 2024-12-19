import { HexString } from '@gear-js/api';

interface ContractSails {
  programId: HexString,
  idl: string
}

export const ACCOUNT_ID_LOCAL_STORAGE_KEY = 'account';

export const ADDRESS = {
  NODE: import.meta.env.VITE_NODE_ADDRESS,
  BACK: import.meta.env.VITE_BACKEND_ADDRESS,
  GAME: import.meta.env.VITE_CONTRACT_ADDRESS as HexString,
};

export const ROUTES = {
  HOME: '/',
  EXAMPLES: '/examples',
  NOTFOUND: '*',
};

// To use the example code, enter the details of the account that will pay the vouchers, etc. (name and mnemonic)
// Here, you have an example account that contains tokens, in your dApp, you need to put a sponsor name
// and a sponsor mnemonic
export const sponsorName = 'Alice';
export const sponsorMnemonic = 'bottom drive obey lake curtain smoke basket hold race lonely fit walk';

export const CONTRACT_DATA: ContractSails = {
  programId: '0x6913f53457ecef4d874b19e390d79f7bd14f457b6369664b85147716ce1bd038',
  idl: `
    type TrafficLightEvent = enum {
      Green,
      Yellow,
      Red,
    };

    type IoTrafficLightState = struct {
      current_light: str,
      all_users: vec struct { actor_id, str },
    };

    constructor {
      New : ();
    };

    service TrafficLight {
      Green : () -> TrafficLightEvent;
      Red : () -> TrafficLightEvent;
      Yellow : () -> TrafficLightEvent;
      query TrafficLight : () -> IoTrafficLightState;
    };
  `
};