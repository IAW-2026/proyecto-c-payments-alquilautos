import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protegemos el panel de administración y sus endpoints de API
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
  "/api/pago(.*)"
]);

const isTestRoute = createRouteMatcher(["/test(.*)"]);
const isAnalyticsRoute = createRouteMatcher(["/api/analytics(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Páginas de test no requieren autenticación
  if (isTestRoute(req)) {
    return;
  }

  // GET /api/analytics puede autenticarse con x-api-key (sistema de analytics externo)
  if (isAnalyticsRoute(req) && req.method === "GET") {
    const apiKey = req.headers.get("x-api-key");
    if (apiKey && apiKey === process.env.ANALYTICS_API_KEY) {
      return;
    }
  }

  // Para todo lo demás se requiere Clerk
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
