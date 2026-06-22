import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protegemos el panel de administración y sus endpoints de API
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
  "/api/pago(.*)"
]);

// Las rutas públicas de test y las que pueden usar API Key como alternativa a Clerk
const isTestRoute = createRouteMatcher(["/test(.*)"]);
const isSellerRoute = createRouteMatcher(["/api/pago(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Páginas de test no requieren autenticación
  if (isTestRoute(req)) {
    return;
  }

  // POST /api/pago puede autenticarse con x-api-key (seller app)
  if (isSellerRoute(req) && req.method === "POST") {
    const apiKey = req.headers.get("x-api-key");
    if (apiKey && apiKey === process.env.SELLER_API_KEY) {
      return; // Autenticado via API Key
    }
  }

  // Para todo lo demás, incluyendo /api/pago sin API key válida, se requiere Clerk
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Evita pasar por Clerk las carpetas internas de Next.js y los archivos estáticos
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Siempre corre el middleware para endpoints de API y trpc
    "/(api|trpc)(.*)",
  ],
};
