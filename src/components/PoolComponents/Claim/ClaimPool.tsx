import { Button } from "@chakra-ui/react";
import { useAlert } from "@gear-js/react-hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Pool {
  id: string; // or number, depending on your data
  name: string;
}

interface ClaimRewardsProps {
  pools: Pool[];
  selectedPool: string;
  setSelectedPool: (value: string) => void;
  handleClaimRewards: () => void; // The function to call when the claim button is clicked
}

function ClaimRewards({ pools, selectedPool, setSelectedPool, handleClaimRewards }: ClaimRewardsProps) {
  const alert = useAlert();

  const onClaimClick = async () => {
    try {
      alert.success('Rewards claimed successfully!');
    } catch (error) {
      alert.error('Error claiming rewards');
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
                <SelectItem key={pool.id} value={pool.id}>{pool.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onClaimClick}>
          Claim Rewards
        </Button>
      </CardContent>
    </Card>
  );
}

export { ClaimRewards };