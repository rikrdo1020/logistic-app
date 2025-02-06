"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  CalendarIcon,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase.ts/config/components";

const supabase = createClient();

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [receivedAtMiami, setReceivedAtMiami] = useState<Date>();
  const [receivedAtBranch, setReceivedAtBranch] = useState<Date>();
  const [selectedClient, setSelectedClient] = useState("");
  const [openClientCombobox, setOpenClientCombobox] = useState(false);

  // 🔹 Cargar clientes y paquetes desde Supabase
  useEffect(() => {
    async function fetchData() {
      const { data: clientData } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("role", "customer");
      setClients(clientData || []);

      const { data: packageData } = await supabase.from("packages").select("*");
      setPackages(packageData || []);
    }

    fetchData();
  }, []);

  const filteredPackages = packages.filter((pkg) =>
    pkg.tracking_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Agregar un nuevo paquete a Supabase
  const handleAddPackage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newPackage = {
      user_id: selectedClient,
      tracking_number: trackingNumber,
      weight: parseFloat(weight),
      price: parseFloat(price),
      status: status,
      received_at_miami: receivedAtMiami ? receivedAtMiami.toISOString() : null,
      received_at_branch: receivedAtBranch
        ? receivedAtBranch.toISOString()
        : null,
    };

    const { data, error } = await supabase
      .from("packages")
      .insert([newPackage])
      .select();

    if (error) {
      console.error("Error adding package:", error.message);
      return;
    }

    if (data && data?.length > 0) {
      setPackages([...packages, data[0]]);
    }

    setIsDialogOpen(false);
  };

  return (
    <Layout isAdmin>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">Administrar Paquetes</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Search className="w-5 h-5 mr-2 text-gray-500" />
            <Input
              placeholder="Buscar por número de rastreo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Agregar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar nuevo paquete</DialogTitle>
                <DialogDescription>
                  Ingresa los detalles del nuevo paquete.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPackage} className="space-y-4">
                <div>
                  <Label>Cliente</Label>
                  <Select
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Número de rastreo</Label>
                  <Input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Peso (kg)</Label>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Precio ($)</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="in_transit">En transito</SelectItem>
                      <SelectItem value="delivered">Entregado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Recibido en casillero</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {receivedAtMiami
                          ? format(receivedAtMiami, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={receivedAtMiami}
                        onSelect={setReceivedAtMiami}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Recibido en sucursal</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {receivedAtBranch
                          ? format(receivedAtBranch, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={receivedAtBranch}
                        onSelect={setReceivedAtBranch}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button type="submit">Agregar paquete</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número de ratreo</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>{pkg.tracking_number}</TableCell>
                <TableCell>{pkg.weight}</TableCell>
                <TableCell>{pkg.price}</TableCell>
                <TableCell>{pkg.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
