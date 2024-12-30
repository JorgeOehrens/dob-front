
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SailsCalls from "@/app/SailsCalls";
import { useState, useEffect } from "react";
import { CONTRACT_DATA,CONTRACT_DATA_POOL, sponsorName, sponsorMnemonic } from "@/app/consts";
import { GearKeyring, getGrReply } from '@gear-js/api';
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp';
import { Keyring } from '@polkadot/api';
import {Program} from '../../../../meta/src/lib'
import { readFileSync } from 'fs';


const fetchWasmCode = async () => {
  try {
    const response = await fetch('../../../../wasm/wasm.opt.wasm');
    if (!response.ok) {
      throw new Error('Error al cargar el archivo WASM');
    }
    const code = await response.arrayBuffer(); // Obtén el código como ArrayBuffer
    return new Uint8Array(code); // Convierte a Uint8Array si es necesario
  } catch (error) {
    console.error('Error al cargar el WASM:', error);
    return null;
  }
};

export function CreatePoolForm  ({ poolName, setPoolName, poolType, setPoolType, initialAmount, setInitialAmount, access, setAccess, distributionMode, setDistributionMode, participants, setParticipants, handleCreatePool, handleAddParticipant, handleRemoveParticipant, newParticipant, setNewParticipant }) 
    {  

      const [sailsCalls, setSailsCalls] = useState(null);


  // Inicializar SailsCalls al montar el componente
  useEffect(() => {
    const initSailsCalls = async () => {
      const instance = await SailsCalls.new({
        network: "wss://testnet.vara.network", // Cambia esto según tu configuración
        idl: CONTRACT_DATA.idl, // Suponiendo que tienes un IDL válido
      });
      setSailsCalls(instance);
      console.log("SailsCalls inicializado:", instance);
    };

    initSailsCalls().catch((err) => console.error("Error al inicializar SailsCalls:", err));
  }, []);

const handleTestGearApi = async () => {
  try {
    // Habilitar Polkadot.js
    const extensions = await web3Enable('TuAplicacion');
    if (!extensions.length) {
      console.error("Polkadot.js extension no está habilitada.");
      return;
    }

    // Obtener cuentas disponibles
    const allAccounts = await web3Accounts();
    if (!allAccounts.length) {
      console.error("No se encontraron cuentas en la wallet.");
      return;
    }

    // Seleccionar la primera cuenta
    const account = allAccounts[0];
    const injector = await web3FromSource(account.meta.source);

    // Configurar el API de Gear
    const gearApi = sailsCalls.getGearApi();

    // Establecer el `signer` en el API
    gearApi.setSigner(injector.signer);

    // Cargar el código WASM
    const code = await fetchWasmCode();
    if (!code) {
      console.error("No se pudo cargar el archivo WASM");
      return;
    }

    // Configurar y calcular gas para el programa
    const program = new Program(gearApi);

    const ctorBuilder = await program
      .newCtorFromCode(
        code,
        'poolName', // Sustituye con el nombre del pool
        'poolType', // Sustituye con el tipo del pool
        '', // Argumento opcional
        'access', // Sustituye con el tipo de acceso
        ['0x9ed91da694c45c9d6448767e6069b6e6bd1f08b1fae9da43e730f8df4a5cac14'], // Lista de propietarios
        ['0x9ed91da694c45c9d6448767e6069b6e6bd1f08b1fae9da43e730f8df4a5cac14'], // Lista de participantes
        1 // Confirmaciones requeridas
      )
      .withAccount(account.address) // Usar la cuenta conectada
      .calculateGas();


    // Firmar y enviar la transacción
    const { blockHash, msgId, txHash } = await ctorBuilder.signAndSend(

    );

    console.log(
      `\nProgram deployed.\n\tprogram id ${program.programId},\n\tblock hash: ${blockHash},\n\ttx hash: ${txHash},\n\tinit message id: ${msgId}`
    );
  } catch (error) {
    console.error("Error al interactuar con GearApi:", error);
  }
};

      return(
  <Card>
    <CardHeader>
      <CardTitle>Crear Pool</CardTitle>
      <CardDescription>Crea una nueva pool para el protocolo Dob.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pool-name">Nombre de la Pool</Label>
        <Input id="pool-name" value={poolName} onChange={(e) => setPoolName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Tipo de Pool</Label>
        <RadioGroup value={poolType} onValueChange={setPoolType}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="airdrop" id="airdrop" />
            <Label htmlFor="airdrop">Airdrop</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rewards" id="rewards" />
            <Label htmlFor="rewards">Rewards</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="participation" id="participation" />
            <Label htmlFor="participation">Participación</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="initial-amount">Monto Inicial</Label>
        <Input
          id="initial-amount"
          type="number"
          value={initialAmount}
          onChange={(e) => setInitialAmount(e.target.value)}
          placeholder="Ingrese el monto inicial"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="access">Acceso</Label>
        <Select value={access} onValueChange={setAccess}>
          <SelectTrigger id="access">
            <SelectValue placeholder="Seleccione el tipo de acceso" />
          </SelectTrigger>
          <SelectContent className="select-content">
            <SelectItem value="public">Público</SelectItem>
            <SelectItem value="private">Privado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="distribution-mode">Modo de Distribución</Label>
        <Select value={distributionMode} onValueChange={setDistributionMode}>
          <SelectTrigger id="distribution-mode">
            <SelectValue placeholder="Seleccione el modo de distribución" />
          </SelectTrigger>
          <SelectContent className="select-content">
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="automatic">Automático</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Participantes</Label>
        <div className="flex space-x-2">
          <Input
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            placeholder="Agregar dirección"
          />
          <Button onClick={handleAddParticipant}>Agregar</Button>
        </div>
        <ul className="list-disc pl-6">
          {participants.map((participant, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span>{participant}</span>
              <Button variant="ghost" size="sm" onClick={() => handleRemoveParticipant(index)}>
                Eliminar
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
    <CardFooter>
    <div>
          <Button onClick={handleTestGearApi}>Probar GearApi</Button>
        </div>
      <Button onClick={handleCreatePool}>Crear Pool</Button>
    </CardFooter>
  </Card>)
    };