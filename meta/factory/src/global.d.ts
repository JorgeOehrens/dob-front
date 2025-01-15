import { CodeId, ActorId } from 'sails-js';

declare global {
  export interface InitConfigFactory {
    vft_code_id: CodeId;
    pool_code_id: CodeId;
    factory_admin_account: Array<ActorId>;
    gas_for_program: number | string | bigint;
  }

  export type FactoryEvent = 
    | { programCreated: { id: number | string | bigint; vft_address: ActorId; pool_address: ActorId; init_config: InitConfig } }
    | { gasUpdatedSuccessfully: { updated_by: ActorId; new_gas_amount: number | string | bigint } }
    | { codeIdUpdatedSuccessfully: { updated_by: ActorId; new_code_id: CodeId } }
    | { adminAdded: { updated_by: ActorId; admin_actor_id: ActorId } }
    | { registryRemoved: { removed_by: ActorId; program_for_id: number | string | bigint } };

  export interface InitConfig {
    name: string;
    symbol: string;
    decimals: number;
    type_pool: string;
    distribution_mode: string;
    access_type: string;
    participants: Array<ActorId>;
  }

  export type FactoryError = 
    | { programInitializationFailed: null }
    | { programInitializationFailedWithContext: string }
    | { unauthorized: null }
    | { unexpectedFTEvent: null }
    | { messageSendError: null }
    | { notFound: null }
    | { idNotFoundInAddress: null }
    | { idNotFound: null };

  export interface Record {
    name: string;
  }

};