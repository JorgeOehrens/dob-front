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
import React from "react";
import { CONTRACT_DATA_POOL } from "@/app/consts";
import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import SailsCalls from "@/app/SailsCalls";
import { u8aToHex,hexToU8a,stringToHex } from '@polkadot/util';

interface Pool {
  id: string;
  nombre: string;
  id_vara: string;
}

interface ClaimRewardsProps {
  pools: Pool[];
}

function ClaimRewards({ pools }: ClaimRewardsProps) {
  const alert = useAlert();
  const { account } = useAccount();
  const [selectedPool, setSelectedPool] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");

  // Copy the user's address to the clipboard
  const copyAddress = () => {
    if (account?.decodedAddress) {
      navigator.clipboard.writeText(account.decodedAddress);
      alert.success("Address copied to clipboard!");
    } else {
      alert.error("No address available to copy.");
    }
  };

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

      const response = await sails.command(
        "VftManager/RewardsClaimed",
        {
          userAddress: account.decodedAddress,
          signer,
        },
        {
          callArguments: [address],

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
        <CardTitle>Claim Rewards</CardTitle>
        <CardDescription>Claim your rewards from the pool.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="claim-pool">Select Pool</Label>
          <Select value={selectedPool} onValueChange={setSelectedPool}>
            <SelectTrigger id="claim-pool">
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
          <Label htmlFor="claim-address">Your Address</Label>
          <Input
            id="claim-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
          />
          <Button onClick={copyAddress} variant="outline" size="sm">
            Copy My Address
          </Button>
        </div>
        <Button
          backgroundColor="green.300"
          onClick={onClaimClick}
          disabled={!selectedPool || !address}
        >
          Claim Rewards
        </Button>
      </CardContent>
    </Card>
  );
}

export { ClaimRewards };
