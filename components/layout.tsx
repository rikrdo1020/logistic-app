"use client";

import { Bell, Box, Home, Package, Settings, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

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

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export function Layout({ children, isAdmin = false }: LayoutProps) {
  const pathname = usePathname();

  const clientMenuItems = [
    { href: "/dashboard", icon: Home, label: "Inicio" },
    { href: "/packages", icon: Package, label: "Mis Paquetes" },
    { href: "/profile", icon: Users, label: "Perfil" },
  ];

  const adminMenuItems = [
    { href: "/admin", icon: Home, label: "Inicio" },
    { href: "/admin/clients", icon: Users, label: "Clientes" },
    { href: "/admin/packages", icon: Box, label: "Paquetes" },
    { href: "/admin/settings", icon: Settings, label: "Configuración" },
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
                <SidebarMenuButton asChild isActive={pathname === item.href}>
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
          <div className="flex items-center gap-2">
            <Image
              alt="Avatar"
              className="rounded-full"
              height={32}
              src="/placeholder.svg"
              width={32}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Juan Pérez</span>
              <span className="text-xs text-gray-500">juan@ejemplo.com</span>
            </div>
          </div>
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
