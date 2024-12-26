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


export const CONTRACT_DATA_POOL: ContractSails = {
  programId: '0xebba15f3c00317dbddc904092a234ca9055b145f84383546eff16183ac5d19ab',
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