import { useAccount, useAlert } from "@gear-js/react-hooks";
import { web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { Button } from "@chakra-ui/react";
import { useSailsCalls } from "@/app/hooks";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface DistributionPoolBalanceProps {
  pools: any;
  selectedPool: any;
  setSelectedPool: any;
  distributionAddress: any;
  setDistributionAddress: any;
  distributionType: any;
  setDistributionType: any;
  distribution: any;
  setDistribution: any;
  handleCreateDistribution: any;
}
interface Pool {
  id: string; // or number, depending on your data
  name: string;
}
function DistributionPoolBalance({ pools, selectedPool, setSelectedPool, distributionAddress, setDistributionAddress, distributionType, setDistributionType, distribution, setDistribution, handleCreateDistribution }: DistributionPoolBalanceProps) {
  const sails = useSailsCalls();
  const alert = useAlert();
  const { account } = useAccount();

  const signer = async () => {
    if (!account) {
      alert.error("Account not available to sign");
      return;
    }

    if (!sails) {
      alert.error('SailsCalls is not ready');
      return;
    }
    await web3Enable('my dapp');
    const { signer } = await web3FromSource(account.meta.source);

    const response = await sails.command(
      'Pool/DistributionPoolBalance',
      {
        userAddress: account.decodedAddress,
        signer
      },
      {
        callbacks: {
          onLoad() { alert.info('Will send a message'); },
          onBlock(blockHash) { alert.success(`In block: ${blockHash}`); },
          onSuccess() { alert.success('Message send!'); },
          onError() { alert.error('Error while sending message'); }
        }
      }
    );

    console.log(`response: ${response}`);
  };

  return (
  
      <Card>
      <CardHeader>
        <CardTitle>Crear Distribución</CardTitle>
        <CardDescription>Crea una nueva distribución para una pool existente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="distribution-pool">Seleccionar Pool</Label>
          <Select value={selectedPool} onValueChange={setSelectedPool}>
            <SelectTrigger id="distribution-pool">
              <SelectValue placeholder="Seleccione una pool" />
            </SelectTrigger>
            <SelectContent className="select-content">
            {pools.map((pool: Pool) => (
                <SelectItem key={pool.id} value={pool.id}>{pool.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="distribution-address">Dirección del Contrato de Distribución</Label>
          <Input
            id="distribution-address"
            value={distributionAddress}
            onChange={(e) => setDistributionAddress(e.target.value)}
            placeholder="0x..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="distribution-type">Tipo de Distribución</Label>
          <Select value={distributionType} onValueChange={setDistributionType}>
            <SelectTrigger id="distribution-type">
              <SelectValue placeholder="Seleccione el tipo de distribución" />
            </SelectTrigger>
            <SelectContent className="select-content">
              <SelectItem value="equal">Igual</SelectItem>
              <SelectItem value="weighted">Ponderada</SelectItem>
              <SelectItem value="custom">Personalizada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="distribution-details">Detalles de la Distribución</Label>
          <Input
            id="distribution-details"
            value={distribution}
            onChange={(e) => setDistribution(e.target.value)}
            placeholder="Formato: cantidad,dirección,..."
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCreateDistribution}
          disabled={!selectedPool || !distributionAddress || !distributionType}
        >
          Crear Distribución
        </Button>
        <Button backgroundColor="green.300" onClick={signer}>
      Send Distribution
    </Button>
      </CardFooter>
    </Card>
  );
}

export { DistributionPoolBalance };
