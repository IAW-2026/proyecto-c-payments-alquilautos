import { clerkClient } from "@clerk/nextjs/server";

const SERVICE_SESSION_ID = process.env.CLERK_SERVICE_SESSION_ID;

export async function getServiceAccountToken(): Promise<string | null> {
  if (!SERVICE_SESSION_ID) {
    console.warn("[SERVICE_ACCOUNT] CLERK_SERVICE_SESSION_ID no configurada.");
    return null;
  }

  try {
    const client = await clerkClient();
    const { jwt } = await client.sessions.getToken(SERVICE_SESSION_ID);
    return jwt;
  } catch (error) {
    console.error("[SERVICE_ACCOUNT] Error al obtener token del bot:", error);
    return null;
  }
}