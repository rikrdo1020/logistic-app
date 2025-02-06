"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

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
import { createClient } from "@/lib/supabase.ts/config/components";

const supabase = createClient();

export default function DashboardPage() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar_url: string | null;
  } | null>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);

      const { data: userData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !userData?.user) {
        setError("No estás autenticado. Redirigiendo al login...");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      // 🔹 Obtener los datos del usuario desde la tabla profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email, name, avatar_url")
        .eq("id", userData.user.id)
        .single();

      if (profileError) {
        setError("Error al obtener datos del usuario.");
      } else {
        setUser(profile);
      }

      setIsLoading(false);
    }

    fetchUser();
  }, [router]);

  // 🔹 Cálculos de paquetes
  const totalPackages = packages.length;
  const inTransitPackages = packages.filter(
    (pkg) => pkg.status === "in_transit"
  ).length;
  const deliveredPackages = packages.filter(
    (pkg) => pkg.status === "delivered"
  ).length;

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          Bienvenido, {user?.name.split(" ")[0]}
        </h1>

        {/* 🔹 Estadísticas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Paquetes
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPackages}</div>
              <p className="text-xs text-muted-foreground">
                Registrados en tu cuenta
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Tránsito</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inTransitPackages}</div>
              <p className="text-xs text-muted-foreground">
                En camino a tu destino
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregados</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveredPackages}</div>
              <p className="text-xs text-muted-foreground">
                Entregados con éxito
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 🔹 Tabla de Paquetes Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Paquetes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center">Cargando paquetes...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : packages.length === 0 ? (
              <p className="text-center">No tienes paquetes registrados.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número de Rastreo</TableHead>
                    <TableHead>Fecha de Recepción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Ubicación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.slice(0, 5).map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">
                        {pkg.tracking_number}
                      </TableCell>
                      <TableCell>
                        {pkg.received_at_miami
                          ? new Date(pkg.received_at_miami).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
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
                            : "Recibido"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {pkg.received_at_branch ? "Sucursal" : "Almacén Miami"}
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
