import { useAlert } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import { GearApi, ProgramMetadata, ReadStateParams, GearMetadata } from '@gear-js/api';

import { ReadStateUsingWasmParams } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';


function useProgramMetadata(source: string) {
  const alert = useAlert();

  const [metadata, setMetadata] = useState<ProgramMetadata>();

  useEffect(() => {
    fetch(source)
      .then((response) => response.text())
      .then((raw) => `0x${raw}`)
      .then((metaHex) => ProgramMetadata.from(metaHex))
      .then((result) => setMetadata(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return metadata;
}

async function userDataAdress(user: string){
  try{
    console.log('user : ', user)
    const api = await GearApi.create(
      { providerAddress: 'wss://testnet.vara.network' }
    );
    const hexAddress = user
    ? api.registry.createType('AccountId', user).toHex()
    : 'Cargando...';
    console.log('hexAddress', hexAddress)
    return hexAddress
  }catch{
    return 'error'

  }
}



async function readState(address_user: string) {
  try {
    // Load the WASM file
    const wasm =  await fetch('../wasm/pool/pool.wasm');

    const api = await GearApi.create(
      { providerAddress: 'wss://testnet.vara.network' }
    );

    const programId = '0x474769ea1aadbcd76273f9d0d366224945444c11ddaf69fdc977de197e5bb21b';


    const payload = { input: 'payload' }; 
    const fn_name = 'GetState';

    const result = await api.message.calculateReply({
      origin: address_user,
      destination: programId,
      payload: { fn_name, payload },
      gasLimit: 100000, 
      value: 0,
    });
    const resultString = result.value.toString();

    console.log('Estado leído:', resultString);
    console.log('Estado leído:', result);
  } catch (error) {
    console.error('Error al leer el estado:', error);
  }
}



export { useProgramMetadata, readState, userDataAdress };
