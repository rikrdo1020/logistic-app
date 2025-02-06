"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase.ts/config/components";
import { Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AuthRegister() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    id_number: "",
    birthdate: "",
    branch: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const supabase = createClient();
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    if (!data.user) {
      setError("Error al crear la cuenta. Inténtalo de nuevo.");
      setIsLoading(false);
      return;
    }

    // Insertar usuario en la tabla `profiles`
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email: formData.email,
        role: "customer",
        name: formData.name,
        phone: formData.phone,
        id_number: formData.id_number,
        birthdate: formData.birthdate,
        branch: formData.branch,
      },
    ]);

    if (profileError) {
      setError("Error al registrar perfil.");
    } else {
      setSuccess(true);
      setFormData({
        email: "",
        password: "",
        name: "",
        phone: "",
        id_number: "",
        birthdate: "",
        branch: "",
      });
      // Ocultar la alerta después de 5 segundos
      setTimeout(() => {
        setSuccess(false);
        router.push("/dashboard"); // Redirigir al dashboard después del registro exitoso
      }, 5000);
    }

    setIsLoading(false);
  }

  return (
    <div>
      {/* 🔹 Mensaje de éxito */}
      {success && (
        <Alert variant="default" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Registro Exitoso</AlertTitle>
          <AlertDescription>
            Tu cuenta ha sido creada exitosamente. Por favor, verifica tu cuenta
            haciendo clic en el enlace que hemos enviado a tu correo
            electrónico. Si no lo encuentras, revisa tu carpeta de spam.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRegister}>
        <div className="grid gap-4">
          <Label>Correo Electrónico</Label>
          <Input
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
          />

          <Label>Contraseña</Label>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />

          <Label>Nombre Completo</Label>
          <Input
            name="name"
            type="text"
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={handleChange}
          />

          <Label>Teléfono</Label>
          <Input
            name="phone"
            type="text"
            placeholder="+58 424-1234567"
            value={formData.phone}
            onChange={handleChange}
          />

          <Label>Número de Identificación</Label>
          <Input
            name="id_number"
            type="text"
            placeholder="V-12345678"
            value={formData.id_number}
            onChange={handleChange}
          />

          <Label>Fecha de Nacimiento</Label>
          <Input
            name="birthdate"
            type="date"
            placeholder="YYYY-MM-DD"
            value={formData.birthdate}
            onChange={handleChange}
          />

          <Label>Sucursal</Label>
          <Input
            name="branch"
            type="text"
            placeholder="Sucursal Principal"
            value={formData.branch}
            onChange={handleChange}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button disabled={isLoading}>
            {isLoading && <Package className="mr-2 h-4 w-4 animate-spin" />}
            Crear Cuenta
          </Button>
        </div>
      </form>
    </div>
  );
}
