"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase.ts/config/components";
import {
  Bell,
  Box,
  Home,
  LogOut,
  Package,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export function Layout({ children, isAdmin = false }: LayoutProps) {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar_url: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error al cerrar sesión:", error.message);
      return;
    }

    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = "/login";
  };

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

  const clientMenuItems = [
    { href: "/dashboard", icon: Home, label: "Inicio" },
    { href: "/dashboard/packages", icon: Package, label: "Mis Paquetes" },
    // { href: "/dashboard/profile", icon: Users, label: "Perfil" },
  ];

  const adminMenuItems = [
    { href: "/admin", icon: Home, label: "Inicio" },
    { href: "/admin/clients", icon: Users, label: "Clientes" },
    { href: "/admin/packages", icon: Box, label: "Paquetes" },
    // { href: "/admin/settings", icon: Settings, label: "Configuración" },
  ];

  const menuItems = isAdmin ? adminMenuItems : clientMenuItems;

  return (
    <div className="flex h-screen w-full">
      <Sidebar className="hidden lg:flex">
        <SidebarHeader className="border-b">
          <div className="flex h-[60px] items-center px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <Package className="h-6 w-6" />
              <span>LogisticsPro</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          {isLoading ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Image
                    alt="Avatar"
                    className="rounded-full"
                    height={32}
                    src={user.avatar_url || "/placeholder.svg"}
                    width={32}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user.name || "Usuario"}
                    </span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <p className="text-sm text-gray-500">Usuario no encontrado</p>
          )}
        </SidebarFooter>
      </Sidebar>
      <div className="flex-grow flex flex-col flex-1">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <form>
              <div className="relative">
                <Input
                  className="w-full md:w-2/3 lg:w-1/3"
                  placeholder="Buscar paquetes..."
                  type="search"
                />
              </div>
            </form>
          </div>
          <Button size="icon" variant="ghost">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notificaciones</span>
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
