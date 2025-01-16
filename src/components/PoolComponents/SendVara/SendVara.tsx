import React from "react";
import { Button } from "@chakra-ui/react";
import { useAlert, useAccount } from "@gear-js/react-hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import SailsCalls from "@/app/SailsCalls";
import { stringToHex } from "@polkadot/util";
import { CONTRACT_DATA_POOL } from "@/app/consts";
interface Pool {
  id: string;
  nombre: string;
  id_vara: string; // Dirección del contrato pool
}

interface SendVaraProps {
  pools: Pool[];
}

function SendVara({ pools }: SendVaraProps) {
  const alert = useAlert();
  const { account } = useAccount();
  const [selectedPool, setSelectedPool] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");


  // Handle the claim rewards function
  const onClaimClick = async () => {
    try {
      if (!selectedPool) {
        alert.error("Please select a pool.");
        return;
      }

      if (!account) {
        alert.error("Account not available to sign.");
        return;
      }

      const sails = await SailsCalls.new({
        network: "wss://testnet.vara.network",
        contractId: selectedPool as `0x${string}`,
        idl: CONTRACT_DATA_POOL.idl,
      });

      if (!sails) {
        alert.error("SailsCalls is not ready.");
        return;
      }

      await web3Enable("my dapp");
      const { signer } = await web3FromSource(account.meta.source);
      console.log(selectedPool)

      const response = await sails.command(
        "VftManager/AddVara",
        {
          userAddress: account.decodedAddress,
          signer,

        },
        {
          tokensToSend: 1_000_000_000_000n, 

          callbacks: {
            onLoad() {
              alert.info("Sending Vara...");
            },
            onBlock(blockHash) {
              alert.success(`Vara included in block: ${blockHash}`);
            },
            onSuccess() {
              alert.success("Vara successfully sent!");
            },
            onError() {
              alert.error("Error while sending Vara.");
            },
          },
        }
      );

      console.log("Vara response:", response);
    } catch (error) {
      console.error("Error in Vara:", error);
      alert.error("Unexpected error occurred during Vara.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send VARA</CardTitle>
        <CardDescription>
          Transfer VARA tokens to the selected pool.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="select-pool">Select Pool</Label>
          <Select value={selectedPool} onValueChange={setSelectedPool}>
            <SelectTrigger id="select-pool">
              <SelectValue placeholder="Select a pool" />
            </SelectTrigger>
            <SelectContent className="select-content">
              {pools.map((pool: Pool) => (
                <SelectItem key={pool.id} value={pool.id_vara}>
                  {pool.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (VARA)</Label>
          <Input
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            type="number"
          />
        </div>
        <Button
          backgroundColor="blue.300"
          onClick={onClaimClick}
          disabled={!selectedPool || !amount || isNaN(Number(amount))}
        >
          Send VARA
        </Button>
      </CardContent>
    </Card>
  );
}

export { SendVara };
