import { useAlert } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import { GearApi, ProgramMetadata, ReadStateParams, GearMetadata } from '@gear-js/api';


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

export const useWasmMetadata = (source: RequestInfo | URL) => {
  const alert = useAlert();
  const [data, setData] = useState<Buffer>();

  useEffect(() => {
    if (source) {
      fetch(source)
        .then((response) => response.arrayBuffer())
        .then((array) => Buffer.from(array))
        .then((buffer) => setData(buffer))
        .catch(({ message }: Error) => alert.error(`Fetch error: ${message}`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return { buffer: data };
};

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

function decodeHex(hex: string): string {
  // Elimina el prefijo '0x' si está presente
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;

  // Decodifica el texto hexadecimal
  const decoded = Buffer.from(cleanHex, 'hex').toString('utf-8');
  return decoded;
}

// Ejemplo de cómo leer el resultado de la función y decodificar el texto
async function readState(address_user: string) {
  try {
    const wasm = await fetch('../wasm/pool/pool.wasm');

    const api = await GearApi.create({
      providerAddress: 'wss://testnet.vara.network',
    });

    const programId = '0x474769ea1aadbcd76273f9d0d366224945444c11ddaf69fdc977de197e5bb21b';

    const payload = { input: 'payload' };
    const fn_name = 'GetState';

    const result = await api.message.calculateReply({
      origin: '0xb03bf2970534f469667832e8c5260533589ec2c0e0dbf739d6621dc008b9b342',
      destination: programId,
      payload: { fn_name, payload },
      gasLimit: 10000000,
      value: 0,
    });

    // Decode the output Uint8Array to a string
    const resultString = new TextDecoder().decode(result.payload.toU8a());

    console.log('Estado leído:', resultString);

  } catch (error) {
    console.error('Error al leer el estado:', error);
  }
}

export { useProgramMetadata, readState, userDataAdress };