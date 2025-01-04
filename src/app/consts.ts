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
  DOB: '/dob',

  EXAMPLES: '/examples2',
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


export const CONTRACT_DATA_POOL: ContractSails = {
  programId: '0xe9ab0477153cd3b0fb57c4a35a08f71b615d585bfdf3016e78ff00833f2b3bd5',
  idl: `
    type State = struct {
  name: str,
  type_pool: str,
  distribution_mode: str,
  access_type: str,
  transactions: vec struct { u256, Transaction },
  confirmations: vec struct { u256, vec actor_id },
  owners: vec actor_id,
  participants_pool: vec actor_id,
  required: u32,
  transaction_count: u256,
};


type Transaction = struct {
  destination: actor_id,
  payload: vec u8,
  value: u128,
  description: opt str,
  executed: bool,
};

constructor {
  New : (name: str, type_pool: str, distribution_mode: str, access_type: str, owners: vec actor_id, participants_pool: vec actor_id, required: u32);
};

service Pool {
  AddOwner : (owner: actor_id) -> null;
  AddParticipant : (participant: actor_id) -> null;
  ChangeRequiredConfirmationsCount : (count: u32) -> null;
  ConfirmTransaction : (transaction_id: u256) -> null;
  DistributionPool : (data: vec u8, total_value: u128, description: opt str) -> null;
  DistributionPool2 : (participants: vec actor_id, data: vec u8, total_value: u128, description: opt str) -> null;
  DistributionPoolBalance : (data: vec u8, description: opt str) -> null;
  ExecuteTransaction : (transaction_id: u256) -> null;
  RemoveOwner : (owner: actor_id) -> null;
  ReplaceOwner : (old_owner: actor_id, new_owner: actor_id) -> null;
  RevokeConfirmation : (transaction_id: u256) -> null;
  SubmitTransaction : (destination: actor_id, data: vec u8, value: u128, description: opt str) -> null;
  query GetState : () -> State;

  events {
    Confirmation: struct { sender: actor_id, transaction_id: u256 };
    Revocation: struct { sender: actor_id, transaction_id: u256 };
    Submission: struct { transaction_id: u256 };
    Execution: struct { transaction_id: u256 };
    OwnerAddition: struct { owner: actor_id };
    PaticipantAddition: struct { participant: actor_id };
    OwnerRemoval: struct { owner: actor_id };
    OwnerReplace: struct { old_owner: actor_id, new_owner: actor_id };
    RequirementChange: u256;
  }
};
  `
};





export const CONTRACT_DATA_TOKEN: ContractSails = {
  programId: '0xe9ab0477153cd3b0fb57c4a35a08f71b615d585bfdf3016e78ff00833f2b3bd5',
  idl: `constructor {
  New : (name: str, symbol: str, decimals: u8);
  };

  service Vft {
    Burn : (from: actor_id, value: u256) -> bool;
    GrantAdminRole : (to: actor_id) -> null;
    GrantBurnerRole : (to: actor_id) -> null;
    GrantMinterRole : (to: actor_id) -> null;
    Mint : (to: actor_id, value: u256) -> bool;
    RevokeAdminRole : (from: actor_id) -> null;
    RevokeBurnerRole : (from: actor_id) -> null;
    RevokeMinterRole : (from: actor_id) -> null;
    Approve : (spender: actor_id, value: u256) -> bool;
    Transfer : (to: actor_id, value: u256) -> bool;
    TransferFrom : (from: actor_id, to: actor_id, value: u256) -> bool;
    query Admins : () -> vec actor_id;
    query Burners : () -> vec actor_id;
    query Minters : () -> vec actor_id;
    query Allowance : (owner: actor_id, spender: actor_id) -> u256;
    query BalanceOf : (account: actor_id) -> u256;
    query Decimals : () -> u8;
    query Name : () -> str;
    query Symbol : () -> str;
    query TotalSupply : () -> u256;

    events {
      Minted: struct { to: actor_id, value: u256 };
      Burned: struct { from: actor_id, value: u256 };
      Approval: struct { owner: actor_id, spender: actor_id, value: u256 };
      Transfer: struct { from: actor_id, to: actor_id, value: u256 };
    }
  };`
};