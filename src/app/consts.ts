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
  type VftManagerEvents = enum {
  NewAdminAdded: actor_id,
  NewParticipant: actor_id,
  AddVara,
  RefundOfVaras: u128,
  VFTContractIdSet,
  MinTokensToAddSet,
  MaxTokensToBurnSet,
  TokensAdded,
  TokensBurned,
  SetTokensPerVaras,
  TotalSwapInVaras: u128,
  TokensSwapSuccessfully: struct { total_tokens: u128, total_varas: u128 },
  RewardsClaimed: struct { total_rewards: u128 },
  Error: VftManagerErrors,
};

type VftManagerErrors = enum {
  MinTokensToAdd: u128,
  NoPendingRewards,
  FailedToSendRewards,
  MaxTokensToBurn: u128,
  InsufficientTokens: struct { total_contract_suply: u128, tokens_to_burn: u128 },
  CantSwapTokens: struct { tokens_in_vft_contract: u256 },
  CantSwapUserTokens: struct { user_tokens: u256, tokens_to_swap: u256 },
  ContractCantMint,
  CantSwapTokensWithAmount: struct { min_amount: u128, actual_amount: u128 },
  OnlyAdminsCanDoThatAction,
  VftContractIdNotSet,
  ErrorInVFTContract,
  ErrorInGetNumOfVarasToSwap,
  OperationWasNotPerformed,
};

type VftManagerQueryEvents = enum {
  ContractBalanceInVaras: u128,
  PoolDetails: struct { admins: vec actor_id, name: str, type_pool: str, distribution_mode: str, access_type: str, participants: vec actor_id, vft_contract_id: opt actor_id, transaction_count: u256, transactions: vec struct { u256, Transaction }, last_distribution_time: u64, is_manual: bool },
  PendingRewards: struct { address: actor_id, total_rewards: u128, transactions: vec Transaction },
  Rewards: vec struct { u256, Transaction, bool },
  UserTotalTokensAsU128: u128,
  UserTotalTokens: u256,
  TotalTokensToSwap: u256,
  TotalTokensToSwapAsU128: u128,
  TokensToSwapOneVara: u128,
  NumOfTokensForOneVara: u128,
  Error: VftManagerErrors,
};

type Transaction = struct {
  destination: actor_id,
  value: u128,
  executed: bool,
};

constructor {
  New : ();
  NewWithData : (name: str, type_pool: str, distribution_mode: str, access_type: str, participants: vec actor_id, vft_contract_id: opt actor_id, admins: vec actor_id, last_distribution_time: u64, is_manual: bool, period: u64, interval: u64);
};

service VftManager {
  AddAdmin : (new_admin_address: actor_id) -> VftManagerEvents;
  AddParticipant : (participant: actor_id) -> VftManagerEvents;
  AddTransaction : (destination: actor_id, value: u128) -> u256;
  AddVara : () -> VftManagerEvents;
  Distribution : (manual: bool) -> null;
  RewardsClaimed : (address: actor_id) -> VftManagerEvents;
  SetManualMode : (manual: bool) -> null;
  SetVftContractId : (vft_contract_id: actor_id) -> VftManagerEvents;
  query PendingRewards : (address: actor_id) -> VftManagerQueryEvents;
  query PoolDetails : () -> VftManagerQueryEvents;
  /// ## Returns the total number of tokens in the contract (In U256 format)
  /// Additionally, it returns all transactions with their execution status.
  query Rewards : () -> VftManagerQueryEvents;
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
  DistributeShares : (shares_list: vec struct { actor_id, u256 }) -> bool;
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
};

`
};




export const CONTRACT_FACTORY: ContractSails = {
  programId: '0x4acc428f7aa789ce3846e73e9706d1d7774fc1a10ab9e4db7741f3589ba8bc25',
  idl: `

  type InitConfigFactory = struct {
  vft_code_id: code_id,
  pool_code_id: code_id,
  factory_admin_account: vec actor_id,
  gas_for_program: u64,
};

type FactoryEvent = enum {
  ProgramCreated: struct { id: u64, vft_address: actor_id, pool_address: actor_id, init_config: InitConfig },
  GasUpdatedSuccessfully: struct { updated_by: actor_id, new_gas_amount: u64 },
  CodeIdUpdatedSuccessfully: struct { updated_by: actor_id, new_code_id: code_id },
  AdminAdded: struct { updated_by: actor_id, admin_actor_id: actor_id },
  RegistryRemoved: struct { removed_by: actor_id, program_for_id: u64 },
};

type InitConfig = struct {
  name: str,
  symbol: str,
  decimals: u8,
  type_pool: str,
  distribution_mode: str,
  access_type: str,
  participants: vec actor_id,
  last_distribution_time: u64,
  is_manual: bool,
  period: u64,
  interval: u64,
};

type FactoryError = enum {
  ProgramInitializationFailed,
  ProgramInitializationFailedWithContext: str,
  Unauthorized,
  UnexpectedFTEvent,
  MessageSendError,
  NotFound,
  IdNotFoundInAddress,
  IdNotFound,
};

type Record = struct {
  name: str,
};

constructor {
  New : (init: InitConfigFactory);
};

service Factory {
  AddAdminToFactory : (admin_actor_id: actor_id) -> result (FactoryEvent, FactoryError);
  CreatePool : (init_config: InitConfig, vft_address: actor_id) -> result (actor_id, FactoryError);
  CreateVft : (init_config: InitConfig) -> result (actor_id, FactoryError);
  CreateVftAndPool : (init_config: InitConfig) -> result (FactoryEvent, FactoryError);
  RemoveRegistry : (program_for_id: u64) -> result (FactoryEvent, FactoryError);
  UpdateCodeId : (new_vft_code_id: opt code_id, new_pool_code_id: opt code_id) -> result (FactoryEvent, FactoryError);
  UpdateGasForProgram : (new_gas_amount: u64) -> result (FactoryEvent, FactoryError);
  query Admins : () -> vec actor_id;
  query GasForProgram : () -> u64;
  query IdToAddress : () -> vec struct { u64, actor_id };
  query Number : () -> u64;
  query PoolCodeId : () -> code_id;
  query Registry : () -> vec struct { actor_id, vec struct { u64, Record } };
  query VftCodeId : () -> code_id;
};



`
};