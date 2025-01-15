import { GearApi, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder, ActorId, CodeId } from 'sails-js';

export class Program {
  public readonly registry: TypeRegistry;
  public readonly factory: Factory;

  constructor(public api: GearApi, private _programId?: `0x${string}`) {
    const types: Record<string, any> = {
      InitConfigFactory: {"vft_code_id":"[u8;32]","pool_code_id":"[u8;32]","factory_admin_account":"Vec<[u8;32]>","gas_for_program":"u64"},
      FactoryEvent: {"_enum":{"ProgramCreated":{"id":"u64","vft_address":"[u8;32]","pool_address":"[u8;32]","init_config":"InitConfig"},"GasUpdatedSuccessfully":{"updated_by":"[u8;32]","new_gas_amount":"u64"},"CodeIdUpdatedSuccessfully":{"updated_by":"[u8;32]","new_code_id":"[u8;32]"},"AdminAdded":{"updated_by":"[u8;32]","admin_actor_id":"[u8;32]"},"RegistryRemoved":{"removed_by":"[u8;32]","program_for_id":"u64"}}},
      InitConfig: {"name":"String","symbol":"String","decimals":"u8","type_pool":"String","distribution_mode":"String","access_type":"String","participants":"Vec<[u8;32]>"},
      FactoryError: {"_enum":{"ProgramInitializationFailed":"Null","ProgramInitializationFailedWithContext":"String","Unauthorized":"Null","UnexpectedFTEvent":"Null","MessageSendError":"Null","NotFound":"Null","IdNotFoundInAddress":"Null","IdNotFound":"Null"}},
      Record: {"name":"String"},
    }

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.factory = new Factory(this);
  }

  public get programId(): `0x${string}` {
    if (!this._programId) throw new Error(`Program ID is not set`);
    return this._programId;
  }

  newCtorFromCode(code: Uint8Array | Buffer, init: InitConfigFactory): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      ['New', init],
      '(String, InitConfigFactory)',
      'String',
      code,
    );

    this._programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`, init: InitConfigFactory) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      ['New', init],
      '(String, InitConfigFactory)',
      'String',
      codeId,
    );

    this._programId = builder.programId;
    return builder;
  }
}

export class Factory {
  constructor(private _program: Program) {}

  public addAdminToFactory(admin_actor_id: ActorId): TransactionBuilder<{ ok: FactoryEvent } | { err: FactoryError }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: FactoryEvent } | { err: FactoryError }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Factory', 'AddAdminToFactory', admin_actor_id],
      '(String, String, [u8;32])',
      'Result<FactoryEvent, FactoryError>',
      this._program.programId
    );
  }

  /**
   * Despliegue del contrato Pool
  */
  public createPool(init_config: InitConfig, vft_address: ActorId): TransactionBuilder<{ ok: ActorId } | { err: FactoryError }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: ActorId } | { err: FactoryError }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Factory', 'CreatePool', init_config, vft_address],
      '(String, String, InitConfig, [u8;32])',
      'Result<[u8;32], FactoryError>',
      this._program.programId
    );
  }

  /**
   * Despliegue del contrato VFT
  */
  public createVft(init_config: InitConfig): TransactionBuilder<{ ok: ActorId } | { err: FactoryError }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: ActorId } | { err: FactoryError }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Factory', 'CreateVft', init_config],
      '(String, String, InitConfig)',
      'Result<[u8;32], FactoryError>',
      this._program.programId
    );
  }

  /**
   * Despliegue combinado de VFT y Pool
  */
  public createVftAndPool(init_config: InitConfig): TransactionBuilder<{ ok: FactoryEvent } | { err: FactoryError }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: FactoryEvent } | { err: FactoryError }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Factory', 'CreateVftAndPool', init_config],
      '(String, String, InitConfig)',
      'Result<FactoryEvent, FactoryError>',
      this._program.programId
    );
  }

  public removeRegistry(program_for_id: number | string | bigint): TransactionBuilder<{ ok: FactoryEvent } | { err: FactoryError }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: FactoryEvent } | { err: FactoryError }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Factory', 'RemoveRegistry', program_for_id],
      '(String, String, u64)',
      'Result<FactoryEvent, FactoryError>',
      this._program.programId
    );
  }

  public updateCodeId(new_vft_code_id: CodeId | null, new_pool_code_id: CodeId | null): TransactionBuilder<{ ok: FactoryEvent } | { err: FactoryError }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: FactoryEvent } | { err: FactoryError }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Factory', 'UpdateCodeId', new_vft_code_id, new_pool_code_id],
      '(String, String, Option<[u8;32]>, Option<[u8;32]>)',
      'Result<FactoryEvent, FactoryError>',
      this._program.programId
    );
  }

  public updateGasForProgram(new_gas_amount: number | string | bigint): TransactionBuilder<{ ok: FactoryEvent } | { err: FactoryError }> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<{ ok: FactoryEvent } | { err: FactoryError }>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Factory', 'UpdateGasForProgram', new_gas_amount],
      '(String, String, u64)',
      'Result<FactoryEvent, FactoryError>',
      this._program.programId
    );
  }

  public async admins(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<Array<ActorId>> {
    const payload = this._program.registry.createType('(String, String)', ['Factory', 'Admins']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Vec<[u8;32]>)', reply.payload);
    return result[2].toJSON() as unknown as Array<ActorId>;
  }

  /**
   * Leer el gas asignado para los programas
  */
  public async gasForProgram(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<bigint> {
    const payload = this._program.registry.createType('(String, String)', ['Factory', 'GasForProgram']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, u64)', reply.payload);
    return result[2].toBigInt() as unknown as bigint;
  }

  public async idToAddress(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<Array<[number | string | bigint, ActorId]>> {
    const payload = this._program.registry.createType('(String, String)', ['Factory', 'IdToAddress']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Vec<(u64, [u8;32])>)', reply.payload);
    return result[2].toJSON() as unknown as Array<[number | string | bigint, ActorId]>;
  }

  public async number(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<bigint> {
    const payload = this._program.registry.createType('(String, String)', ['Factory', 'Number']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, u64)', reply.payload);
    return result[2].toBigInt() as unknown as bigint;
  }

  /**
   * Leer el `CodeId` actual del Pool
  */
  public async poolCodeId(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<CodeId> {
    const payload = this._program.registry.createType('(String, String)', ['Factory', 'PoolCodeId']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, [u8;32])', reply.payload);
    return result[2].toJSON() as unknown as CodeId;
  }

  /**
   * Leer el registro completo
  */
  public async registry(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<Array<[ActorId, Array<[number | string | bigint, Record]>]>> {
    const payload = this._program.registry.createType('(String, String)', ['Factory', 'Registry']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Vec<([u8;32], Vec<(u64, Record)>)>)', reply.payload);
    return result[2].toJSON() as unknown as Array<[ActorId, Array<[number | string | bigint, Record]>]>;
  }

  /**
   * Leer el `CodeId` actual del VFT
  */
  public async vftCodeId(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<CodeId> {
    const payload = this._program.registry.createType('(String, String)', ['Factory', 'VftCodeId']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, [u8;32])', reply.payload);
    return result[2].toJSON() as unknown as CodeId;
  }
}