import { type NextRequest } from "next/server";
import {
  handleAuthMiddleware,
  updateSession,
} from "./lib/supabase.ts/config/middleware";

export async function middleware(req: NextRequest) {
  const sessionResponse = await updateSession(req);
  if (sessionResponse) return sessionResponse;

  // 🔹 Luego, validamos el acceso según el rol del usuario
  return handleAuthMiddleware(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
