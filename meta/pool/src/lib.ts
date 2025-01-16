import { GearApi, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder, ActorId } from 'sails-js';

export class Program {
  public readonly registry: TypeRegistry;
  public readonly vftManager: VftManager;

  constructor(public api: GearApi, private _programId?: `0x${string}`) {
    const types: Record<string, any> = {
      VftManagerEvents: {"_enum":{"NewAdminAdded":"[u8;32]","NewParticipant":"[u8;32]","AddVara":"Null","RefundOfVaras":"u128","VFTContractIdSet":"Null","MinTokensToAddSet":"Null","MaxTokensToBurnSet":"Null","TokensAdded":"Null","TokensBurned":"Null","SetTokensPerVaras":"Null","TotalSwapInVaras":"u128","TokensSwapSuccessfully":{"total_tokens":"u128","total_varas":"u128"},"RewardsClaimed":{"total_rewards":"u128"},"Error":"VftManagerErrors"}},
      VftManagerErrors: {"_enum":{"MinTokensToAdd":"u128","NoPendingRewards":"Null","FailedToSendRewards":"Null","MaxTokensToBurn":"u128","InsufficientTokens":{"total_contract_suply":"u128","tokens_to_burn":"u128"},"CantSwapTokens":{"tokens_in_vft_contract":"U256"},"CantSwapUserTokens":{"user_tokens":"U256","tokens_to_swap":"U256"},"ContractCantMint":"Null","CantSwapTokensWithAmount":{"min_amount":"u128","actual_amount":"u128"},"OnlyAdminsCanDoThatAction":"Null","VftContractIdNotSet":"Null","ErrorInVFTContract":"Null","ErrorInGetNumOfVarasToSwap":"Null","OperationWasNotPerformed":"Null"}},
      VftManagerQueryEvents: {"_enum":{"ContractBalanceInVaras":"u128","PoolDetails":{"admins":"Vec<[u8;32]>","name":"String","type_pool":"String","distribution_mode":"String","access_type":"String","participants":"Vec<[u8;32]>","vft_contract_id":"Option<[u8;32]>","transaction_count":"U256","transactions":"Vec<(U256, Transaction)>","last_distribution_time":"u64","is_manual":"bool"},"PendingRewards":{"address":"[u8;32]","total_rewards":"u128","transactions":"Vec<Transaction>"},"Rewards":"Vec<(U256, Transaction, bool)>","UserTotalTokensAsU128":"u128","UserTotalTokens":"U256","TotalTokensToSwap":"U256","TotalTokensToSwapAsU128":"u128","TokensToSwapOneVara":"u128","NumOfTokensForOneVara":"u128","Error":"VftManagerErrors"}},
      Transaction: {"destination":"[u8;32]","value":"u128","executed":"bool"},
    }

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.vftManager = new VftManager(this);
  }

  public get programId(): `0x${string}` {
    if (!this._programId) throw new Error(`Program ID is not set`);
    return this._programId;
  }

  newCtorFromCode(code: Uint8Array | Buffer): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      'New',
      'String',
      'String',
      code,
    );

    this._programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      'New',
      'String',
      'String',
      codeId,
    );

    this._programId = builder.programId;
    return builder;
  }
  newWithDataCtorFromCode(code: Uint8Array | Buffer, name: string, type_pool: string, distribution_mode: string, access_type: string, participants: Array<ActorId>, vft_contract_id: ActorId | null, admins: Array<ActorId>, last_distribution_time: number | string | bigint, is_manual: boolean, period: number | string | bigint, interval: number | string | bigint): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      ['NewWithData', name, type_pool, distribution_mode, access_type, participants, vft_contract_id, admins, last_distribution_time, is_manual, period, interval],
      '(String, String, String, String, String, Vec<[u8;32]>, Option<[u8;32]>, Vec<[u8;32]>, u64, bool, u64, u64)',
      'String',
      code,
    );

    this._programId = builder.programId;
    return builder;
  }

  newWithDataCtorFromCodeId(codeId: `0x${string}`, name: string, type_pool: string, distribution_mode: string, access_type: string, participants: Array<ActorId>, vft_contract_id: ActorId | null, admins: Array<ActorId>, last_distribution_time: number | string | bigint, is_manual: boolean, period: number | string | bigint, interval: number | string | bigint) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      ['NewWithData', name, type_pool, distribution_mode, access_type, participants, vft_contract_id, admins, last_distribution_time, is_manual, period, interval],
      '(String, String, String, String, String, Vec<[u8;32]>, Option<[u8;32]>, Vec<[u8;32]>, u64, bool, u64, u64)',
      'String',
      codeId,
    );

    this._programId = builder.programId;
    return builder;
  }
}

export class VftManager {
  constructor(private _program: Program) {}

  public addAdmin(new_admin_address: ActorId): TransactionBuilder<VftManagerEvents> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<VftManagerEvents>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['VftManager', 'AddAdmin', new_admin_address],
      '(String, String, [u8;32])',
      'VftManagerEvents',
      this._program.programId
    );
  }

  public addParticipant(participant: ActorId): TransactionBuilder<VftManagerEvents> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<VftManagerEvents>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['VftManager', 'AddParticipant', participant],
      '(String, String, [u8;32])',
      'VftManagerEvents',
      this._program.programId
    );
  }

  public addTransaction(destination: ActorId, value: number | string | bigint): TransactionBuilder<bigint> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<bigint>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['VftManager', 'AddTransaction', destination, value],
      '(String, String, [u8;32], u128)',
      'U256',
      this._program.programId
    );
  }

  public addVara(): TransactionBuilder<VftManagerEvents> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<VftManagerEvents>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['VftManager', 'AddVara'],
      '(String, String)',
      'VftManagerEvents',
      this._program.programId
    );
  }

  public distribution(manual: boolean): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['VftManager', 'Distribution', manual],
      '(String, String, bool)',
      'Null',
      this._program.programId
    );
  }

  public rewardsClaimed(address: ActorId): TransactionBuilder<VftManagerEvents> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<VftManagerEvents>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['VftManager', 'RewardsClaimed', address],
      '(String, String, [u8;32])',
      'VftManagerEvents',
      this._program.programId
    );
  }

  public setManualMode(manual: boolean): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['VftManager', 'SetManualMode', manual],
      '(String, String, bool)',
      'Null',
      this._program.programId
    );
  }

  public setVftContractId(vft_contract_id: ActorId): TransactionBuilder<VftManagerEvents> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<VftManagerEvents>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['VftManager', 'SetVftContractId', vft_contract_id],
      '(String, String, [u8;32])',
      'VftManagerEvents',
      this._program.programId
    );
  }

  public async pendingRewards(address: ActorId, originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<VftManagerQueryEvents> {
    const payload = this._program.registry.createType('(String, String, [u8;32])', ['VftManager', 'PendingRewards', address]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, VftManagerQueryEvents)', reply.payload);
    return result[2].toJSON() as unknown as VftManagerQueryEvents;
  }

  public async poolDetails(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<VftManagerQueryEvents> {
    const payload = this._program.registry.createType('(String, String)', ['VftManager', 'PoolDetails']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, VftManagerQueryEvents)', reply.payload);
    return result[2].toJSON() as unknown as VftManagerQueryEvents;
  }

  /**
   * ## Returns the total number of tokens in the contract (In U256 format)
   * Additionally, it returns all transactions with their execution status.
  */
  public async rewards(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<VftManagerQueryEvents> {
    const payload = this._program.registry.createType('(String, String)', ['VftManager', 'Rewards']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, VftManagerQueryEvents)', reply.payload);
    return result[2].toJSON() as unknown as VftManagerQueryEvents;
  }
}