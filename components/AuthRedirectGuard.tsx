"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase.ts/config/components";

const supabase = createClient();

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkUser() {
      setIsLoading(true);

      const { data: userData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !userData?.user) {
        // 🔹 Si no hay usuario, permitir el acceso solo a /login
        if (pathname === "/login") {
          setAuthorized(true);
        } else {
          router.push("/login");
        }
        setIsLoading(false);
        return;
      }

      // 🔹 Obtener el perfil del usuario
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (profileError || !profile) {
        router.push("/login");
        setIsLoading(false);
        return;
      }

      const isAdmin = profile.role === "admin";
      const isCustomer = profile.role === "customer";

      // 🔹 Redirigir si un usuario intenta acceder a una ruta incorrecta
      if (isAdmin && pathname.startsWith("/dashboard")) {
        router.push("/admin");
        return;
      }
      if (isCustomer && pathname.startsWith("/admin")) {
        router.push("/dashboard");
        return;
      }

      // 🔹 Si el usuario ya está autenticado y está en /login, redirigirlo a su página principal
      if (pathname === "/login") {
        router.push(isAdmin ? "/admin" : "/dashboard");
        return;
      }

      setAuthorized(true);
      setIsLoading(false);
    }

    checkUser();
  }, [router, pathname]);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return authorized ? <>{children}</> : null;
}
