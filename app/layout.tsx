import { SidebarProvider } from "@/components/ui/sidebar";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";
import "@/styles/globals.css";
import { AuthGuard } from "@/components/AuthRedirectGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LogisticsPro",
  description: "Sistema de logística de paquetes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SidebarProvider>
          <AuthGuard>{children}</AuthGuard>
        </SidebarProvider>
      </body>
    </html>
  );
}
