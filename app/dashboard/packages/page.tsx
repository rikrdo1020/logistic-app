"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Layout } from "@/components/layout";
import { createClient } from "@/lib/supabase.ts/config/components";

const supabase = createClient();

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // 🔹 Obtener usuario autenticado y sus paquetes
  useEffect(() => {
    async function fetchPackages() {
      setIsLoading(true);
      setError(null);

      const { data: user, error: authError } = await supabase.auth.getUser();
      if (authError || !user?.user) {
        setError("No estás autenticado. Redirigiendo al login...");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Error al obtener paquetes.");
      } else {
        setPackages(data || []);
      }

      setIsLoading(false);
    }

    fetchPackages();
  }, [router]);

  // 🔹 Filtrar paquetes por estado y búsqueda
  const filteredPackages = packages.filter((pkg) => {
    const matchesStatus =
      filterStatus === "todos" || pkg.status === filterStatus;
    const matchesSearch = pkg.tracking_number
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Layout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Mis Paquetes</h1>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in_transit">En Tránsito</SelectItem>
                  <SelectItem value="delivered">Entregado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Buscar por número de rastreo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-[300px]"
            />
          </div>
        </div>

        {/* 🔹 Mostrar estado de carga o error */}
        {isLoading ? (
          <p className="text-center">Cargando paquetes...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Lista de Paquetes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número de Rastreo</TableHead>
                    <TableHead>Peso</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Recibido en Miami</TableHead>
                    <TableHead>Recibido en Sucursal</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackages.length > 0 ? (
                    filteredPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">
                          {pkg.tracking_number}
                        </TableCell>
                        <TableCell>{pkg.weight} kg</TableCell>
                        <TableCell>${pkg.price}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              pkg.status === "delivered"
                                ? "bg-green-50 text-green-700 ring-green-600/20"
                                : pkg.status === "in_transit"
                                ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                                : "bg-blue-50 text-blue-700 ring-blue-600/20"
                            }`}
                          >
                            {pkg.status === "delivered"
                              ? "Entregado"
                              : pkg.status === "in_transit"
                              ? "En Tránsito"
                              : "Pendiente"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {pkg.received_at_miami
                            ? new Date(
                                pkg.received_at_miami
                              ).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {pkg.received_at_branch
                            ? new Date(
                                pkg.received_at_branch
                              ).toLocaleDateString()
                            : "Pendiente"}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Ver detalles</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detalles del Paquete</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">
                                      Número de Rastreo
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {pkg.tracking_number}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Estado</h4>
                                    <p className="text-sm text-gray-500">
                                      {pkg.status}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Peso</h4>
                                    <p className="text-sm text-gray-500">
                                      {pkg.weight} kg
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Precio</h4>
                                    <p className="text-sm text-gray-500">
                                      ${pkg.price}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No hay paquetes registrados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
