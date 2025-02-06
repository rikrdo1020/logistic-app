import AuthLogin from "@/components/AuthLogin";
import AuthRegister from "@/components/AuthRegister";
import { Package } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* 🔹 Panel Izquierdo */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Package className="mr-2 h-6 w-6" />
          Panel de Control
        </div>
      </div>

      {/* 🔹 Panel Derecho (Formulario) */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tu correo electrónico para acceder a tu cuenta
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            {/* 🔹 LOGIN */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Iniciar sesión</CardTitle>
                </CardHeader>
                <CardContent>
                  <AuthLogin />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 🔹 REGISTRO */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Crear una cuenta</CardTitle>
                </CardHeader>
                <CardContent>
                  <AuthRegister />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Al hacer clic en continuar, aceptas nuestros{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Términos de Servicio
            </Link>{" "}
            y nuestra{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
