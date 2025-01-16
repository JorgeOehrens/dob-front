import { ActorId } from 'sails-js';

declare global {
  export type VftManagerEvents = 
    | { newAdminAdded: ActorId }
    | { newParticipant: ActorId }
    | { addVara: null }
    | { refundOfVaras: number | string | bigint }
    | { vFTContractIdSet: null }
    | { minTokensToAddSet: null }
    | { maxTokensToBurnSet: null }
    | { tokensAdded: null }
    | { tokensBurned: null }
    | { setTokensPerVaras: null }
    | { totalSwapInVaras: number | string | bigint }
    | { tokensSwapSuccessfully: { total_tokens: number | string | bigint; total_varas: number | string | bigint } }
    | { rewardsClaimed: { total_rewards: number | string | bigint } }
    | { error: VftManagerErrors };

  export type VftManagerErrors = 
    | { minTokensToAdd: number | string | bigint }
    | { noPendingRewards: null }
    | { failedToSendRewards: null }
    | { maxTokensToBurn: number | string | bigint }
    | { insufficientTokens: { total_contract_suply: number | string | bigint; tokens_to_burn: number | string | bigint } }
    | { cantSwapTokens: { tokens_in_vft_contract: number | string | bigint } }
    | { cantSwapUserTokens: { user_tokens: number | string | bigint; tokens_to_swap: number | string | bigint } }
    | { contractCantMint: null }
    | { cantSwapTokensWithAmount: { min_amount: number | string | bigint; actual_amount: number | string | bigint } }
    | { onlyAdminsCanDoThatAction: null }
    | { vftContractIdNotSet: null }
    | { errorInVFTContract: null }
    | { errorInGetNumOfVarasToSwap: null }
    | { operationWasNotPerformed: null };

  export type VftManagerQueryEvents = 
    | { contractBalanceInVaras: number | string | bigint }
    | { poolDetails: { admins: Array<ActorId>; name: string; type_pool: string; distribution_mode: string; access_type: string; participants: Array<ActorId>; vft_contract_id: ActorId | null; transaction_count: number | string | bigint; transactions: Array<[number | string | bigint, Transaction]>; last_distribution_time: number | string | bigint; is_manual: boolean } }
    | { pendingRewards: { address: ActorId; total_rewards: number | string | bigint; transactions: Array<Transaction> } }
    | { rewards: Array<[number | string | bigint, Transaction, boolean]> }
    | { userTotalTokensAsU128: number | string | bigint }
    | { userTotalTokens: number | string | bigint }
    | { totalTokensToSwap: number | string | bigint }
    | { totalTokensToSwapAsU128: number | string | bigint }
    | { tokensToSwapOneVara: number | string | bigint }
    | { numOfTokensForOneVara: number | string | bigint }
    | { error: VftManagerErrors };

  export interface Transaction {
    destination: ActorId;
    value: number | string | bigint;
    executed: boolean;
  }

};