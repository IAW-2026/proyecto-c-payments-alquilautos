import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protegemos el panel de administración y sus endpoints de API
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
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
