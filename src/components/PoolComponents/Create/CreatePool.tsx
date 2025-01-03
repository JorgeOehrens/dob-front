import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SailsCalls from "@/app/SailsCalls";
import { useState, useEffect } from "react";
import { web3Enable, web3Accounts, web3FromSource } from "@polkadot/extension-dapp";
import { Program as ProgramPool } from "../../../../meta/pool/src/lib";
import {Program as ProgramVtf} from "../../../../meta/vtf/src/lib";
import { CONTRACT_DATA,CONTRACT_DATA_POOL, CONTRACT_DATA_TOKEN } from "@/app/consts";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://lwmvtiydijytxugorjrd.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3bXZ0aXlkaWp5dHh1Z29yanJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNDQ1ODcsImV4cCI6MjA1MDgyMDU4N30.hGCsLUY_N9RyJg0iebs5IgONMhKjv3lMgkuj_zcOZMY");

const fetchWasmCode = async () => {
  try {
    const response = await fetch("../../../../wasm/wasm.opt.wasm");
    if (!response.ok) {
      throw new Error("Error al cargar el archivo WASM");
    }
    const code = await response.arrayBuffer();
    return new Uint8Array(code);
  } catch (error) {
    console.error("Error al cargar el WASM:", error);
    return null;
  }
};
export function CreatePoolForm() {
  const [sailsCalls, setSailsCalls] = useState<SailsCalls | null>(null);
  const [poolName, setPoolName] = useState("");
  const [poolType, setPoolType] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [access, setAccess] = useState("");
  const [distributionMode, setDistributionMode] = useState("");
  const [participants, setParticipants] = useState<{ address: string; tokens: number }[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    const initSailsCalls = async () => {
      const instance = await SailsCalls.new({
        network: "wss://testnet.vara.network",
        idl: CONTRACT_DATA_POOL.idl,
      });
      setSailsCalls(instance);
      console.log("SailsCalls inicializado:", instance);
    };

    initSailsCalls().catch((err) => console.error("Error al inicializar SailsCalls:", err));
  }, []);

  const handleAddParticipant = () => {
    if (newParticipant.trim() !== "") {
      setParticipants((prev) => [
        ...prev,
        { address: newParticipant.trim(), tokens: 0 },
      ]);
      setNewParticipant("");
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants((prev) => {
      const newParticipants = prev.filter((_, i) => i !== index);
      updateTotalTokens(newParticipants);
      return newParticipants;
    });
  };

  const handleTokenChange = (index: number, tokens: number) => {
    setParticipants((prev) => {
      const newParticipants = [...prev];
      newParticipants[index].tokens = tokens;
      updateTotalTokens(newParticipants);
      return newParticipants;
    });
  };

  const updateTotalTokens = (updatedParticipants: typeof participants) => {
    const total = updatedParticipants.reduce((sum, p) => sum + p.tokens, 0);
    setTotalTokens(total);
  };

  const calculateShares = () => {
    return participants.map((p) => ({
      ...p,
      share: totalTokens > 0 ? ((p.tokens / totalTokens) * 100).toFixed(2) : "0.00",
    }));
  };

  const handleCreatePool = async () => {
    try {
      // Habilitar Polkadot.js
      const extensions = await web3Enable("TuAplicacion");
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
      if (sailsCalls) {
        const gearApi = sailsCalls.getGearApi();
        gearApi.setSigner(injector.signer);

      // Cargar el código WASM
      const code = await fetchWasmCode();
      if (!code) {
        console.error("No se pudo cargar el archivo WASM");
        return;
      }

      // Configurar y calcular gas para el programa
      const program = new ProgramPool(gearApi);
      const ctorBuilder = await program
        .newCtorFromCode(
          code,
          poolName,
          poolType,
          distributionMode,
          access,
          ['0xb03bf2970534f469667832e8c5260533589ec2c0e0dbf739d6621dc008b9b342'],
          ['0xb03bf2970534f469667832e8c5260533589ec2c0e0dbf739d6621dc008b9b342'],
          1
        )
        .withAccount(account.address)
        .calculateGas();
        ctorBuilder.withValue(BigInt(Number(initialAmount) * 1e12)); 
        // Firmar y enviar la transacción
      const { blockHash, msgId, txHash } = await ctorBuilder.signAndSend();

      console.log(
        `\nProgram deployed.\n\tprogram id ${program.programId},\n\tblock hash: ${blockHash},\n\ttx hash: ${txHash},\n\tinit message id: ${msgId}`
      );
      // Insertar datos en la tabla `pools` de Supabase
      const { error } = await supabase.from("pools").insert({
        nombre: poolName,
        modo_distribucion: distributionMode,
        id_vara:program.programId,
        acceso: access,
        tipo: poolType,
        creador: account.address,
        participantes: participants,
        transacciones: [{ txHash }], 
      });

      } else {
        console.error("sailsCalls is null");
      }
    } catch (error) {
      console.error("Error al interactuar con GearApi:", error);
    }
  };

  const handleCreateToken = async () => {
    try {
      // Habilitar Polkadot.js

      const initSailsCalls = async () => {
        const instance = await SailsCalls.new({
          network: "wss://testnet.vara.network",
          idl: CONTRACT_DATA_TOKEN.idl,
        });
        setSailsCalls(instance);
        console.log("SailsCalls inicializado:", instance);
      };
  
      initSailsCalls().catch((err) => console.error("Error al inicializar SailsCalls:", err));
      const extensions = await web3Enable("TuAplicacion");
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
      if (sailsCalls) {
        const gearApi = sailsCalls.getGearApi();
        gearApi.setSigner(injector.signer);

      // Cargar el código WASM
      const code = await fetchWasmCode();
      if (!code) {
        console.error("No se pudo cargar el archivo WASM");
        return;
      }

      // Configurar y calcular gas para el programa
      const program = new ProgramVtf(gearApi);
      const ctorBuilder = await program
        .newCtorFromCode(
          code,
          poolName,
          'DOB',
          18,
        
        )
        .withAccount(account.address)
        .calculateGas(); 

      // Firmar y enviar la transacción
      const { blockHash, msgId, txHash } = await ctorBuilder.signAndSend();

      console.log(
        `\nProgram deployed.\n\tprogram id ${program.programId},\n\tblock hash: ${blockHash},\n\ttx hash: ${txHash},\n\tinit message id: ${msgId}`
      );

      // Insertar datos en la tabla `pools` de Supabase

      const { error } = await supabase.from("tokens").insert({
        name: poolName,
        symbol: 'DOB',
        decimal :18 ,
        txHash :txHash,
        programId :program.programId,
        owner: account.address
      });

      } else {
        console.error("sailsCalls is null");
      }
    } catch (error) {
      console.error("Error al interactuar con GearApi:", error);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Pool</CardTitle>
        <CardDescription>Create a new pool for the Dob protocol.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pool-name">Pool Name</Label>
          <Input id="pool-name" value={poolName} onChange={(e) => setPoolName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Pool Type</Label>
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
              <Label htmlFor="participation">Participation</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="initial-amount">Initial Amount</Label>
          <Input
            id="initial-amount"
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
            placeholder="Enter the initial amount"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="access">Access</Label>
          <Select value={access} onValueChange={setAccess}>
            <SelectTrigger id="access">
              <SelectValue placeholder="Select the type of access" />
            </SelectTrigger>
            <SelectContent className="select-content">
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="distribution-mode">Distribution Mode</Label>
          <Select value={distributionMode} onValueChange={setDistributionMode}>
            <SelectTrigger id="distribution-mode">
              <SelectValue placeholder="Select the distribution mode" />
            </SelectTrigger>
            <SelectContent className="select-content">
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automatic">Automatic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Participants</Label>
          <div className="flex space-x-2">
            <Input
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              placeholder="Add address"
            />
            <Button onClick={handleAddParticipant}>Add</Button>
          </div>
          <ul className="list-disc pl-6">
            {calculateShares().map((participant, index) => (
              <li key={index} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <span>{participant.address}</span>
                  <Input
                    type="number"
                    value={participant.tokens}
                    onChange={(e) =>
                      handleTokenChange(index, Number(e.target.value))
                    }
                    placeholder="Tokens"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveParticipant(index)}
                  >
                    Remove
                  </Button>
                </div>
                <span>
                  Share: {participant.share}%
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Label>Total Tokens: {totalTokens}</Label>
        </div>
      </CardContent>
      <CardFooter>
          <Button onClick={handleCreateToken}>Create Pool</Button>
      </CardFooter>
    </Card>
  );
}
