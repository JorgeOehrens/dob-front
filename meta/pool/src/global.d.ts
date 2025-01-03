import { ActorId } from 'sails-js';

declare global {
  export interface State {
    name: string;
    type_pool: string;
    distribution_mode: string;
    access_type: string;
    transactions: Array<[number | string | bigint, Transaction]>;
    confirmations: Array<[number | string | bigint, Array<ActorId>]>;
    owners: Array<ActorId>;
    participants_pool: Array<ActorId>;
    required: number;
    transaction_count: number | string | bigint;
  }

  export interface Transaction {
    destination: ActorId;
    payload: `0x${string}`;
    value: number | string | bigint;
    description: string | null;
    executed: boolean;
  }

};