import { MercadoPagoConfig, Preference } from 'mercadopago';
import crypto from "crypto";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' 
});

export const mpPreference = new Preference(client);
export default client;

export function verifyMercadoPagoSignature(
  body: string,
  xSignature: string | null,
  xRequestId: string | null
): boolean {
  if (!xSignature || !xRequestId) return false;

  const parts = Object.fromEntries(
    xSignature.split(",").map(p => p.trim().split("="))
  );
  const ts = parts["ts"];
  const hash = parts["v1"];

  if (!ts || !hash) return false;

  const dataId = (() => {
    try {
      return JSON.parse(body)?.data?.id;
    } catch {
      return null;
    }
  })();

  if (!dataId) return false;

  const template = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const computed = crypto
    .createHmac("sha256", process.env.MERCADOPAGO_ACCESS_TOKEN || "")
    .update(template)
    .digest("hex");

  return computed === hash;
}
