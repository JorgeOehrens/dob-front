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
import { createClient } from "@supabase/supabase-js";
import { useSailsCalls } from "@/app/hooks";
import { Card } from "@chakra-ui/react";
import SailsCalls from "@/app/SailsCalls";
// Configura Supabase
const supabase = createClient(
  "https://lwmvtiydijytxugorjrd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3bXZ0aXlkaWp5dHh1Z29yanJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNDQ1ODcsImV4cCI6MjA1MDgyMDU4N30.hGCsLUY_N9RyJg0iebs5IgONMhKjv3lMgkuj_zcOZMY"
);

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

const ViewPools: React.FC = () => {
  const { account } = useAccount();
  const sails = useSailsCalls();
  const alert = useAlert();

  const [pools, setPools] = useState<Pool[]>([]);

  // Obtener pools desde Supabase
  useEffect(() => {
    const fetchPools = async () => {
      try {
        const { data, error } = await supabase.from("pools").select();
        if (error) {
          alert.error("Error al obtener pools desde Supabase");
          console.error(error);
        } else {
          // Manejar y formatear los datos
          const formattedPools = data?.map((pool) => ({
            ...pool,
            participantes: safeParseJSON(pool.participantes, []),
            transacciones: safeParseJSON(pool.transacciones, []),
          }));
          setPools(formattedPools || []);
        }
      } catch (error) {
        alert.error("Error inesperado al obtener pools");
        console.error(error);
      }
    };

    fetchPools();
  }, []);

  // Leer el estado de cada pool y hacer console.log
  useEffect(() => {
    const fetchPoolStates = async () => {
      if (!sails) {
        alert.error("Sails no está listo");
        return;
      }

      for (const pool of pools) {
        try {
          

          const response = await sails.query("Pool/GetState");
          console.log(`Estado de la pool ${pool.nombre}:`, response);
        } catch (error) {
          console.error(`Error al leer el estado de la pool ${pool.nombre}`, error);
          alert.error(`Error al leer el estado de la pool ${pool.nombre}`);
        }
      }
    };

    if (pools.length > 0) {
      fetchPoolStates();
    }
  }, [pools, sails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de las Pools</CardTitle>
        <CardDescription>Todas las pools creadas por DobProtocol</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Modo distribución</TableHead>
              <TableHead>Acceso</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Creador</TableHead>
              <TableHead>Participantes</TableHead>
              <TableHead>Transacciones</TableHead>
              <TableHead>ID Vara</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.map((pool) => (
              <TableRow key={pool.id}>
                <TableCell>{pool.nombre}</TableCell>
                <TableCell>Sincronizando con blockchain...</TableCell>
                <TableCell>{pool.modo_distribucion}</TableCell>
                <TableCell>{pool.acceso}</TableCell>
                <TableCell>{pool.tipo}</TableCell>
                <TableCell>{pool.creador}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{pool.id_vara}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Función auxiliar para manejar JSON.parse con seguridad
const safeParseJSON = (value: string, fallback: any) => {
  try {
    return JSON.parse(value || "[]");
  } catch (error) {
    console.error("Error al parsear JSON:", error, "Valor:", value);
    return fallback;
  }
};

export default ViewPools;
