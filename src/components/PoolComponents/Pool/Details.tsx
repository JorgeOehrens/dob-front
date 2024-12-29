import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ViewPools = ({ pools }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pools Existentes</CardTitle>
        <CardDescription>Vista general de todas las pools creadas.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Creador</TableHead>
              <TableHead>Participantes</TableHead>
              <TableHead>Transacciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.map((pool) => (
              <TableRow key={pool.id}>
                <TableCell>{pool.name}</TableCell>
                <TableCell>{pool.type}</TableCell>
                <TableCell>{pool.creator}</TableCell>
                <TableCell>{pool.participants}</TableCell>
                <TableCell>{pool.transactions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ViewPools;
