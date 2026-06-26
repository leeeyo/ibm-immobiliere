"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { consumeRateLimit, getRequestIp } from "@/lib/rate-limit";

const LoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type LoginState = { error?: string; ok?: boolean };

function cleanEnv(value: string | undefined): string {
  const trimmed = value?.trim() || "";
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function readEnv(name: string): string {
  return cleanEnv(process.env[name]);
}

function decodeBase64Env(value: string): string {
  if (!value) return "";
  try {
    return Buffer.from(value, "base64").toString("utf8").trim();
  } catch {
    return "";
  }
}

function getAdminCredentials() {
  const passwordHash =
    readEnv("ADMIN_PASSWORD_HASH") ||
    decodeBase64Env(readEnv("ADMIN_PASSWORD_HASH_B64"));

  return {
    email: readEnv("ADMIN_EMAIL") || "admin@ibm-immobiliere.tn",
    name: readEnv("ADMIN_NAME") || "Administrateur",
    passwordHash,
    passwordPlain: readEnv("ADMIN_PASSWORD"),
  };
}

function logAuthDebug(payload: Record<string, unknown>) {
  if (process.env.AUTH_DEBUG === "true") {
    console.log("AUTH_DEBUG", payload);
  }
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Donnees invalides" };
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();
  const headerList = await headers();
  const rateLimit = await consumeRateLimit({
    scope: "admin-login",
    identifier: `${getRequestIp(headerList)}:${normalizedEmail}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return { error: "Trop de tentatives. Reessayez dans quelques minutes." };
  }

  const credentials = getAdminCredentials();
  const expectedEmail = credentials.email.toLowerCase();
  let valid = false;

  if (credentials.passwordHash) {
    valid = await bcrypt.compare(password, credentials.passwordHash);
  } else if (process.env.NODE_ENV !== "production" && credentials.passwordPlain) {
    valid = password === credentials.passwordPlain;
  }

  const emailMatches = normalizedEmail === expectedEmail;
  logAuthDebug({
    email: normalizedEmail,
    expectedEmail,
    emailMatches,
    nodeEnv: process.env.NODE_ENV,
    hasHash: Boolean(credentials.passwordHash),
    hashStart: credentials.passwordHash.slice(0, 7),
    hashLen: credentials.passwordHash.length,
    valid,
  });

  if (!emailMatches || !valid) {
    return { error: "Identifiants invalides." };
  }

  const session = await getSession();
  session.email = normalizedEmail;
  session.name = credentials.name;
  session.loggedAt = Date.now();
  await session.save();

  return { ok: true };
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
