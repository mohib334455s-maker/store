import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "@/lib/store";

const COOKIE = "peakline_admin";
const SECRET = process.env.ADMIN_SESSION_SECRET ?? "peakline-comp101-session";

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function validateCredentials(username: string, password: string) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function createSessionToken() {
  const payload = `admin:${Date.now() + 7 * 24 * 60 * 60 * 1000}`;
  return `${payload}:${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const parts = token.split(":");
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}:${parts[1]}`;
  const signature = parts[2];
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const exp = Number(parts[1]);
  return Number.isFinite(exp) && Date.now() < exp;
}

export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect("/login");
  }
}

export const ADMIN_COOKIE = COOKIE;
