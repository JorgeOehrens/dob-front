import React, { useEffect, useState } from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAlert, useAccount } from "@gear-js/react-hooks";
import { Card } from "@chakra-ui/react";
import { useSailsCalls } from "@/app/hooks";
interface ViewPoolsProps {
  pools: {
    id: string;
    name: string;
    type: string;
    creator: string;
    participants: number;
    transactions: number;
  }[];
}
const ViewPools: React.FC<ViewPoolsProps> = ({ pools }) => {
  const { account } = useAccount();
  const sails = useSailsCalls();
  const alert = useAlert();

  const [pool, setPool] = useState(null);

  useEffect(() => {
    const fetchPool = async () => {
      if (!sails) {
        alert.error("Sails is not ready");
        return;
      }

      try {
        const response = await sails.query("Pool/GetState");
        console.log(response);
        setPool(response);
      } catch (error) {
        alert.error("Error fetching pool data");
        console.error(error);
      }
    };

    fetchPool();
  }, [sails]);

  if (!pool) {
    return <div>Loading pool data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Detalles</CardTitle>
        <CardDescription>
          Todas las pools creadas por DobProtocol
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Modo distribución</TableHead>
              <TableHead>Acceso</TableHead>

              <TableHead>Tipo</TableHead>
              <TableHead>Creador</TableHead>
              <TableHead>Participantes</TableHead>
              <TableHead>Transacciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{pool.name}</TableCell>
              <TableCell>{pool.distribution_mode}</TableCell>
              <TableCell>{pool.access_type}</TableCell>

              <TableCell>{pool.type_pool}</TableCell>
              <TableCell>{pool.owners?.join(", ") || "N/A"}</TableCell>
              <TableCell>
                {pool.participants_pool?.join(", ") || "N/A"}
              </TableCell>
              <TableCell>
                {Array.isArray(pool.transactions) ? (
                  pool.transactions.map(([txId, details], idx) => (
                    <div key={idx}>
                      <strong>ID:</strong> {txId} <br />
                      <strong>Destino:</strong> {details.destination} <br />
                      <strong>Valor:</strong> {details.value} <br />
                      <strong>Ejecutada:</strong>{" "}
                      {details.executed ? "Sí" : "No"} <br />
                      <hr />
                    </div>
                  ))
                ) : (
                  <div>No hay transacciones disponibles</div>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ViewPools;
