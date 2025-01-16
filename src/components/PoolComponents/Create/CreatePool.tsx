import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SailsCalls from "@/app/SailsCalls";
import { useState } from "react";
import { web3Enable,  web3FromSource } from "@polkadot/extension-dapp";
import { useSailsCalls } from "@/app/hooks";
import { useAccount, useAlert } from "@gear-js/react-hooks";
import { useInitSails } from "@/app/hooks";

import {  CONTRACT_DATA_TOKEN, CONTRACT_FACTORY,  sponsorName, sponsorMnemonic, } from "@/app/consts";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://lwmvtiydijytxugorjrd.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3bXZ0aXlkaWp5dHh1Z29yanJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNDQ1ODcsImV4cCI6MjA1MDgyMDU4N30.hGCsLUY_N9RyJg0iebs5IgONMhKjv3lMgkuj_zcOZMY");


export function CreatePoolForm() {
  const [poolName, setPoolName] = useState("");
  const [poolType, setPoolType] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [access, setAccess] = useState("");
  const [distributionMode, setDistributionMode] = useState("");
  const [participantsForm, setParticipants] = useState<{ address: string; tokens: number }[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [totalTokens, setTotalTokens] = useState(0);
  const periodOptions = [
    { value: "1", label: "Minutes" },
    { value: "2", label: "Hours" },
    { value: "3", label: "Semestral" },
    { value: "4", label: "Annual" },
  ];
  const [distributionPeriod, setDistributionPeriod] = useState("");
  const [interval, setInterval] = useState(1);
  const [lastDistributionTime, setLastDistributionTime] = useState("");

  const handleDateChange = (event:any) => {
    const dateInMilliseconds = Math.round(new Date(event.target.value).getTime());
    setLastDistributionTime(dateInMilliseconds.toString());
  };
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

  const updateTotalTokens = (updatedParticipants: typeof participantsForm) => {
    const total = updatedParticipants.reduce((sum, p) => sum + p.tokens, 0);
    setTotalTokens(total);
  };

  const calculateShares = () => {
    return participantsForm.map((p) => ({
      ...p,
      share: totalTokens > 0 ? ((p.tokens / totalTokens) * 100).toFixed(2) : "0.00",
    }));
  };


// Put your contract id and idl
useInitSails({
  network: 'wss://testnet.vara.network',
  contractId: CONTRACT_FACTORY.programId,
  idl: CONTRACT_FACTORY.idl,
  // You need to put name and mnemonic sponsor if you 
  // will use vouchers feature (vouchers are used for gasless,
  // and signless accounts)
  vouchersSigner: {
    sponsorName,
    sponsorMnemonic
  }
});
  
const sails = useSailsCalls();
const alert = useAlert();
const { account } = useAccount();


const distributeShares = async (vftAddress: any) => {
  try {
    // Inicializa SailsCalls dinámicamente con el contrato VFT
    const sails = await SailsCalls.new({
      network: "wss://testnet.vara.network",
      contractId: vftAddress,
      idl: CONTRACT_DATA_TOKEN.idl, // IDL del contrato VFT
    });

    // Prepara los datos para distribuir las shares en formato correcto
    const sharesList = participantsForm.map((p) => [
      p.address,          // Dirección del actor en formato hexadecimal
      p.tokens.toString(), // Número de tokens como string
    ]);

    console.log("Shares List (Tuples):", sharesList);

    const extensions = await web3Enable("TuAplicacion");
    if (!extensions || extensions.length === 0) {
      alert.error("Polkadot.js extension not enabled or installed");
      return;
    }

    if (!account) {
      alert.error("Account not available to sign");
      return;
    }

    if (!sails) {
      alert.error("SailsCalls is not ready");
      return;
    }

    const { signer } = await web3FromSource(account.meta.source);

    await sails.command(
      "Vft/DistributeShares", 
      {
        userAddress: account.decodedAddress,
        signer,
      },
      {
        callArguments: [sharesList],
        callbacks: {
          onLoad() {
            alert.info("Sending shares distribution...");
          },
          onBlock(blockHash) {
            alert.success(`Shares distributed in block: ${blockHash}`);
          },
          onSuccess() {
            alert.success("Shares successfully distributed!");
          },
         
        },
      }
    );
  } catch (error) {
    console.error("Error in distributeShares:", error);
    alert.error("Unexpected error occurred during share distribution");
  }
};


const signer = async () => {
  try {
    // Habilitar Polkadot.js
    const extensions = await web3Enable("TuAplicacion");
    if (!extensions || extensions.length === 0) {
      alert.error("Polkadot.js extension not enabled or installed");
      return;
    }

    if (!account) {
      alert.error("Account not available to sign");
      return;
    }

    if (!sails) {
      alert.error("SailsCalls is not ready");
      return;
    }

    // Obtener el firmante
    const { signer } = await web3FromSource(account.meta.source);
    const is_manual= false;

    const initConfig = {
      name: poolName,
      symbol: "VFT",
      decimals: 18,
      type_pool: poolType,
      distribution_mode: distributionMode,
      access_type: access,
      participants: participantsForm.map((p) => p.address),
      last_distribution_time:lastDistributionTime,
      is_manual:is_manual,
      period: distributionPeriod,
      interval: interval
    };

    // Crear la VFT y la pool
    const response = await sails.command(
      "Factory/CreateVftAndPool",
      {
        userAddress: account.decodedAddress,
        signer,
      },
      {
        callArguments: [initConfig],
        callbacks: {
          onLoad() {
            alert.info("Will send a message");
          },
          onBlock(blockHash) {
            alert.success(`In block: ${blockHash}`);
          },
        },
      }
    );

    // Extraer datos del contrato
    const { programCreated } = response.ok;
    const { vft_address, pool_address, init_config } = programCreated;

    console.log("VFT Address:", vft_address);
    console.log("Pool Address:", pool_address);

    // Preparar los datos de las shares
    const sharesList = participantsForm.map((p) => ({
      actorId: p.address,
      shares: p.tokens,
    }));

    // Guardar el VFT en la tabla `tokens`
    const tokenInsert = {
      name: init_config.name,
      symbol: init_config.symbol,
      decimal: init_config.decimals,
      created_at: new Date().toISOString(),
      owner: account.decodedAddress,
      txHash: response.blockHash,
      programId: vft_address,
      shares: sharesList, // Guardar las shares como JSON
    };

    const { data: tokenData, error: tokenError } = await supabase
      .from("tokens")
      .insert(tokenInsert)
      .select()
      .single();

    if (tokenError) {
      console.error("Error inserting token:", tokenError);
      alert.error("Failed to save token in database");
      return;
    }

    // Guardar la pool en la tabla `pools`
    const poolInsert = {
      id_vara: pool_address,
      nombre: poolName,
      modo_distribucion: distributionMode,
      acceso: access,
      tipo: poolType,
      creador: account.decodedAddress,
      participantes: participantsForm,
      transacciones: [],
      created_at: new Date().toISOString(),
      id_token: tokenData.id,
    };

    const { data: poolData, error: poolError } = await supabase
      .from("pools")
      .insert(poolInsert);

    if (poolError) {
      console.error("Error inserting pool:", poolError);
      alert.error("Failed to save pool in database");
      return;
    }

    alert.success("Pool and VFT successfully created and saved in database!");

    // Retrasar antes de distribuir las shares
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(5000);

    // Llamar a la distribución de shares
    await distributeShares(vft_address);
  } catch (error) {
    console.error("Error in signer:", error);
    alert.error("Unexpected error occurred");
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
          <Label>Period and Interval</Label>
          <div className="flex items-center space-x-4">
            <Select
              value={distributionPeriod}
              onValueChange={setDistributionPeriod} 
            >
            <SelectTrigger id="pediod-mode">
              <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="select-content">
              {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              placeholder="Interval"
              className="w-1/2"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-distribution-time">First Distribution Date</Label>
          <Input
            id="last-distribution-time"
            type="datetime-local"
            onChange={handleDateChange}
          />
          
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
          <Button onClick={signer}>Create Pool</Button>
      </CardFooter>
    </Card>
  );
}
