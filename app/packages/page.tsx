"use client"

import { useState } from "react"
import { Eye, Filter, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Layout } from "@/components/layout"

const packages = [
  {
    id: "PKG001",
    trackingNumber: "TRK-2024-001",
    description: "Ropa y Accesorios",
    weight: "2.5 kg",
    status: "Entregado",
    receivedDate: "20 Ene, 2024",
    estimatedDelivery: "25 Ene, 2024",
    location: "Entregado al Cliente",
  },
  {
    id: "PKG002",
    trackingNumber: "TRK-2024-002",
    description: "Electrónicos",
    weight: "1.8 kg",
    status: "En Tránsito",
    receivedDate: "25 Ene, 2024",
    estimatedDelivery: "30 Ene, 2024",
    location: "Centro de Distribución",
  },
  {
    id: "PKG003",
    trackingNumber: "TRK-2024-003",
    description: "Libros",
    weight: "3.2 kg",
    status: "Recibido",
    receivedDate: "1 Feb, 2024",
    estimatedDelivery: "5 Feb, 2024",
    location: "Almacén Miami",
  },
]

export default function PackagesPage() {
  const [filterStatus, setFilterStatus] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPackages = packages.filter((pkg) => {
    const matchesStatus = filterStatus === "todos" || pkg.status === filterStatus
    const matchesSearch =
      pkg.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <Layout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Mis Paquetes</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Paquete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Paquete</DialogTitle>
                  <DialogDescription>Ingrese los detalles del paquete que desea rastrear</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="tracking">Número de Rastreo</label>
                    <Input id="tracking" placeholder="Ingrese el número de rastreo" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description">Descripción</label>
                    <Input id="description" placeholder="Descripción del contenido" />
                  </div>
                  <Button>Agregar Paquete</Button>
                </div>
              </DialogContent>
            </Dialog>
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
                  <SelectItem value="Recibido">Recibido</SelectItem>
                  <SelectItem value="En Tránsito">En Tránsito</SelectItem>
                  <SelectItem value="Entregado">Entregado</SelectItem>
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
        <Card>
          <CardHeader>
            <CardTitle>Lista de Paquetes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número de Rastreo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Recibido</TableHead>
                  <TableHead>Entrega Estimada</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.trackingNumber}</TableCell>
                    <TableCell>{pkg.description}</TableCell>
                    <TableCell>{pkg.weight}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          pkg.status === "Entregado"
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : pkg.status === "En Tránsito"
                              ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                              : "bg-blue-50 text-blue-700 ring-blue-600/20"
                        }`}
                      >
                        {pkg.status}
                      </span>
                    </TableCell>
                    <TableCell>{pkg.receivedDate}</TableCell>
                    <TableCell>{pkg.estimatedDelivery}</TableCell>
                    <TableCell>{pkg.location}</TableCell>
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
                                <h4 className="font-medium">Número de Rastreo</h4>
                                <p className="text-sm text-gray-500">{pkg.trackingNumber}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Estado</h4>
                                <p className="text-sm text-gray-500">{pkg.status}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Descripción</h4>
                                <p className="text-sm text-gray-500">{pkg.description}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Peso</h4>
                                <p className="text-sm text-gray-500">{pkg.weight}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Fecha Recibido</h4>
                                <p className="text-sm text-gray-500">{pkg.receivedDate}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Entrega Estimada</h4>
                                <p className="text-sm text-gray-500">{pkg.estimatedDelivery}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium">Ubicación Actual</h4>
                              <p className="text-sm text-gray-500">{pkg.location}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

