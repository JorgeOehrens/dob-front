import React from "react";
import { useAccount, useAlert } from "@gear-js/react-hooks";
import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { Button } from "@chakra-ui/react";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { CONTRACT_DATA_POOL } from "@/app/consts";
import SailsCalls from "@/app/SailsCalls";
import { stringToHex } from "@polkadot/util";

interface Pool {
  id: string;
  nombre: string;
  id_vara: string;
}

interface DistributionPoolBalanceProps {
  pools: Pool[]; // Lista de pools disponibles
}

const DistributionPoolBalance: React.FC<DistributionPoolBalanceProps> = ({
  pools
}) => {
  const alert = useAlert();
  const { account } = useAccount();
  const [selectedPool, setSelectedPool] = React.useState<string>("");
  console.log(pools);

  const handleSendDistribution = async () => {
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
        contractId: stringToHex(selectedPool),
        idl: CONTRACT_DATA_POOL.idl,
      });

      if (!sails) {
        alert.error("SailsCalls is not ready.");
        return;
      }

      await web3Enable("my dapp");
      const { signer } = await web3FromSource(account.meta.source);

      const response = await sails.command(
        "VftManager/Distribution",
        {
          userAddress: account.decodedAddress,
          signer,
        },
        {
          callbacks: {
            onLoad() {
              alert.info("Sending distribution...");
            },
            onBlock(blockHash) {
              alert.success(`Distribution included in block: ${blockHash}`);
            },
            onSuccess() {
              alert.success("Distribution successfully sent!");
            },
            onError() {
              alert.error("Error while sending distribution.");
            },
          },
        }
      );

      console.log("Distribution response:", response);
    } catch (error) {
      console.error("Error in handleSendDistribution:", error);
      alert.error("Unexpected error occurred during distribution.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Distribution</CardTitle>
        <CardDescription>Select a pool and send a distribution.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="distribution-pool">Select Pool</Label>
          <Select value={selectedPool} onValueChange={setSelectedPool}>
            <SelectTrigger id="distribution-pool">
              <SelectValue placeholder="Select a pool" />
            </SelectTrigger>
            <SelectContent className="select-content">
              {pools.map((pool) => (
                <SelectItem key={pool.id} value={pool.id_vara}>
                  {pool.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          backgroundColor="green.300"
          onClick={handleSendDistribution}
          disabled={!selectedPool}
        >
          Send Distribution
        </Button>
      </CardFooter>
    </Card>
  );
};

export { DistributionPoolBalance };
