"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase.ts/config/components";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Layout } from "@/components/layout";

const supabase = createClient();

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, locker_address, role");

      if (error) {
        setError("Error fetching clients.");
        setIsLoading(false);
        return;
      }

      // Filtrar solo clientes
      const filteredClients = data.filter(
        (client) => client.role === "customer"
      );

      // Obtener número de paquetes en tránsito por cliente
      const clientsWithPackages = await Promise.all(
        filteredClients.map(async (client) => {
          const { count } = await supabase
            .from("packages")
            .select("*", { count: "exact", head: true })
            .eq("user_id", client.id)
            .eq("status", "in_transit");

          return { ...client, packagesInTransit: count || 0 };
        })
      );

      setClients(clientsWithPackages);
      setIsLoading(false);
    }

    fetchClients();
  }, []);

  return (
    <Layout isAdmin>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Clientes</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos los clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center">Cargando clientes...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : clients.length === 0 ? (
              <p className="text-center">No hay clientes.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo electrónico</TableHead>
                    <TableHead>Casillero</TableHead>
                    <TableHead>Paquetes en transito</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.name || "N/A"}
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>
                        {client.locker_address || "Not Assigned"}
                      </TableCell>
                      <TableCell>{client.packagesInTransit}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
