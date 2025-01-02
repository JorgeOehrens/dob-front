import { GearApi, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder, ActorId, getServiceNamePrefix, getFnNamePrefix, ZERO_ADDRESS } from 'sails-js';
interface State {
  // Aquí define las propiedades esperadas de `State`, si las conoces.
  [key: string]: any; // Usa esto como temporal si no sabes los detalles exactos.
}

export class Program {
  public readonly registry: TypeRegistry;
  public readonly pool: Pool;

  constructor(public api: GearApi, private _programId?: `0x${string}`) {
    const types: Record<string, any> = {
      State: {"name":"String","type_pool":"String","distribution_mode":"String","access_type":"String","transactions":"Vec<(U256, Transaction)>","confirmations":"Vec<(U256, Vec<[u8;32]>)>","owners":"Vec<[u8;32]>","participants_pool":"Vec<[u8;32]>","required":"u32","transaction_count":"U256"},
      Transaction: {"destination":"[u8;32]","payload":"Vec<u8>","value":"u128","description":"Option<String>","executed":"bool"},
    }

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.pool = new Pool(this);
  }

  public get programId(): `0x${string}` {
    if (!this._programId) throw new Error(`Program ID is not set`);
    return this._programId;
  }
  newCtorFromCode(
    code: Uint8Array | Buffer,
    name: string,
    type_pool: string,
    distribution_mode: string,
    access_type: string,
    owners: Array<ActorId>,
    participants_pool: Array<ActorId>,
    required: number
  ): TransactionBuilder<null> {
    // Convertir el código a Uint8Array si es un Buffer
    const uint8ArrayCode = code instanceof Buffer ? new Uint8Array(code) : code;
  
    // Convertir owners y participants_pool a Uint8Array si es necesario
    const ownersFormatted = owners.map((owner) => new Uint8Array(owner));
    const participantsFormatted = participants_pool.map((participant) => new Uint8Array(participant));
  
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      ['New', name, type_pool, distribution_mode, access_type, ownersFormatted, participantsFormatted, required],
      '(String, String, String, String, String, Vec<[u8;32]>, Vec<[u8;32]>, u32)',
      'String',
      uint8ArrayCode
    );
  
    this._programId = builder.programId;
    return builder;
  }
  

  newCtorFromCodeId(codeId: `0x${string}`, name: string, type_pool: string, distribution_mode: string, access_type: string, owners: Array<ActorId>, participants_pool: Array<ActorId>, required: number) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      ['New', name, type_pool, distribution_mode, access_type, owners, participants_pool, required],
      '(String, String, String, String, String, Vec<[u8;32]>, Vec<[u8;32]>, u32)',
      'String',
      codeId,
    );

    this._programId = builder.programId;
    return builder;
  }
}

export class Pool {
  constructor(private _program: Program) {}

  public addOwner(owner: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pool', 'AddOwner', owner],
      '(String, String, [u8;32])',
      'Null',
      this._program.programId
    );
  }

  public addParticipant(participant: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pool', 'AddParticipant', participant],
      '(String, String, [u8;32])',
      'Null',
      this._program.programId
    );
  }

  public changeRequiredConfirmationsCount(count: number): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pool', 'ChangeRequiredConfirmationsCount', count],
      '(String, String, u32)',
      'Null',
      this._program.programId
    );
  }

  public confirmTransaction(transaction_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pool', 'ConfirmTransaction', transaction_id],
      '(String, String, U256)',
      'Null',
      this._program.programId
    );
  }

  public distributionPool(data: `0x${string}`, total_value: number | string | bigint, description: string | null): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pool', 'DistributionPool', data, total_value, description],
      '(String, String, Vec<u8>, u128, Option<String>)',
      'Null',
      this._program.programId
    );
  }

  public distributionPool2(participants: Array<ActorId>, data: `0x${string}`, total_value: number | string | bigint, description: string | null): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pool', 'DistributionPool2', participants, data, total_value, description],
      '(String, String, Vec<[u8;32]>, Vec<u8>, u128, Option<String>)',
      'Null',
      this._program.programId
    );
  }

  public distributionPoolBalance(data: `0x${string}`, description: string | null): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pool', 'DistributionPoolBalance', data, description],
      '(String, String, Vec<u8>, Option<String>)',
      'Null',
      this._program.programId
    );
  }

  public executeTransaction(transaction_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pool', 'ExecuteTransaction', transaction_id],
      '(String, String, U256)',
      'Null',
      this._program.programId
    );
  }

  public removeOwner(owner: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pool', 'RemoveOwner', owner],
      '(String, String, [u8;32])',
      'Null',
      this._program.programId
    );
  }

  public replaceOwner(old_owner: ActorId, new_owner: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pool', 'ReplaceOwner', old_owner, new_owner],
      '(String, String, [u8;32], [u8;32])',
      'Null',
      this._program.programId
    );
  }

  public revokeConfirmation(transaction_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pool', 'RevokeConfirmation', transaction_id],
      '(String, String, U256)',
      'Null',
      this._program.programId
    );
  }

  public submitTransaction(destination: ActorId, data: `0x${string}`, value: number | string | bigint, description: string | null): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Pool', 'SubmitTransaction', destination, data, value, description],
      '(String, String, [u8;32], Vec<u8>, u128, Option<String>)',
      'Null',
      this._program.programId
    );
  }

  public async getState(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<State> {
    const payload = this._program.registry.createType('(String, String)', ['Pool', 'GetState']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, State)', reply.payload);
    return result[2].toJSON() as unknown as State;
  }

  public subscribeToConfirmationEvent(callback: (data: { sender: ActorId; transaction_id: number | string | bigint }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Pool' && getFnNamePrefix(payload) === 'Confirmation') {
        callback(this._program.registry.createType('(String, String, {"sender":"[u8;32]","transaction_id":"U256"})', message.payload)[2].toJSON() as unknown as { sender: ActorId; transaction_id: number | string | bigint });
      }
    });
  }

  public subscribeToRevocationEvent(callback: (data: { sender: ActorId; transaction_id: number | string | bigint }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Pool' && getFnNamePrefix(payload) === 'Revocation') {
        callback(this._program.registry.createType('(String, String, {"sender":"[u8;32]","transaction_id":"U256"})', message.payload)[2].toJSON() as unknown as { sender: ActorId; transaction_id: number | string | bigint });
      }
    });
  }

  public subscribeToSubmissionEvent(callback: (data: { transaction_id: number | string | bigint }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Pool' && getFnNamePrefix(payload) === 'Submission') {
        callback(this._program.registry.createType('(String, String, {"transaction_id":"U256"})', message.payload)[2].toJSON() as unknown as { transaction_id: number | string | bigint });
      }
    });
  }

  public subscribeToExecutionEvent(callback: (data: { transaction_id: number | string | bigint }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Pool' && getFnNamePrefix(payload) === 'Execution') {
        callback(this._program.registry.createType('(String, String, {"transaction_id":"U256"})', message.payload)[2].toJSON() as unknown as { transaction_id: number | string | bigint });
      }
    });
  }

  public subscribeToOwnerAdditionEvent(callback: (data: { owner: ActorId }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Pool' && getFnNamePrefix(payload) === 'OwnerAddition') {
        callback(this._program.registry.createType('(String, String, {"owner":"[u8;32]"})', message.payload)[2].toJSON() as unknown as { owner: ActorId });
      }
    });
  }

  public subscribeToPaticipantAdditionEvent(callback: (data: { participant: ActorId }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Pool' && getFnNamePrefix(payload) === 'PaticipantAddition') {
        callback(this._program.registry.createType('(String, String, {"participant":"[u8;32]"})', message.payload)[2].toJSON() as unknown as { participant: ActorId });
      }
    });
  }

  public subscribeToOwnerRemovalEvent(callback: (data: { owner: ActorId }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Pool' && getFnNamePrefix(payload) === 'OwnerRemoval') {
        callback(this._program.registry.createType('(String, String, {"owner":"[u8;32]"})', message.payload)[2].toJSON() as unknown as { owner: ActorId });
      }
    });
  }

  public subscribeToOwnerReplaceEvent(callback: (data: { old_owner: ActorId; new_owner: ActorId }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Pool' && getFnNamePrefix(payload) === 'OwnerReplace') {
        callback(this._program.registry.createType('(String, String, {"old_owner":"[u8;32]","new_owner":"[u8;32]"})', message.payload)[2].toJSON() as unknown as { old_owner: ActorId; new_owner: ActorId });
      }
    });
  }

  public subscribeToRequirementChangeEvent(callback: (data: bigint) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Pool' && getFnNamePrefix(payload) === 'RequirementChange') {
        callback(this._program.registry.createType('(String, String, U256)', message.payload)[2].toBigInt() as unknown as bigint);
      }
    });
  }
}