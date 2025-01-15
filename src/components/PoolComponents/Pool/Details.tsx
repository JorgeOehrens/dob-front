import React, { useEffect, useState } from "react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAlert, useAccount } from "@gear-js/react-hooks";
import { useSailsCalls } from "@/app/hooks";
import { Card } from "@chakra-ui/react";

interface Pool {
  id: string;
  id_vara: string;
  nombre: string;
  modo_distribucion: string;
  acceso: string;
  tipo: string;
  creador: string;
  participantes: string[];
  transacciones: { txHash: string }[];
  created_at: string;
}

interface Token {
  id: string;
  name: string;
  symbol: string;
  decimal: number;
  owner: string;
  txHash: string;
  programId: string;
}

interface ViewPoolsProps {
  pools: Pool[]; // Pools recibidos como parámetro
  tokens: Token[]; // Tokens recibidos como parámetro
}

const ViewPools: React.FC<ViewPoolsProps> = ({ pools, tokens }) => {
  const { account } = useAccount();
  const sails = useSailsCalls();
  const alert = useAlert();

  const [poolStates, setPoolStates] = useState<Record<string, any>>({});

  // Leer el estado de cada pool y actualizar
  useEffect(() => {
    const fetchPoolStates = async () => {
      if (!sails) {
        alert.error("Sails no está listo");
        return;
      }

      try {
        const states = await Promise.all(
          pools.map(async (pool) => {
            try {
              const state = await sails.query(`${pool.id_vara}/Pool/GetState`);
              return { id: pool.id, state };
            } catch (error) {
              console.error(`Error al obtener el estado de la pool ${pool.nombre}`, error);
              return { id: pool.id, state: "Error al sincronizar" };
            }
          })
        );

        const updatedStates = states.reduce((acc, curr) => {
          acc[curr.id] = curr.state;
          return acc;
        }, {} as Record<string, any>);

        setPoolStates(updatedStates);
      } catch (error) {
      }
    };

    if (pools.length > 0) {
      fetchPoolStates();
    }
  }, [pools, sails, alert]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Details</CardTitle>
        <CardDescription>All pools created by DobProtocol</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Distribution Mode</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>ID Vara</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.map((pool) => (
              <TableRow key={pool.id}>
                <TableCell>{pool.nombre}</TableCell>
                <TableCell>{poolStates[pool.id] || "Syncing..."}</TableCell>
                <TableCell>{pool.modo_distribucion}</TableCell>
                <TableCell>{pool.acceso}</TableCell>
                <TableCell>{pool.tipo}</TableCell>
                <TableCell>{pool.creador}</TableCell>
                <TableCell>{pool.participantes?.length || 0}</TableCell>
                <TableCell>{pool.transacciones?.length || 0}</TableCell>
                <TableCell>{pool.id_vara}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ViewPools;
