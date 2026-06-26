"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { consumeRateLimit, getRequestIp } from "@/lib/rate-limit";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ibm-immobiliere.tn";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD || "";
const ADMIN_NAME = process.env.ADMIN_NAME || "Administrateur";

const LoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type LoginState = { error?: string; ok?: boolean };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const { email, password } = parsed.data;
  const headerList = await headers();
  const rateLimit = await consumeRateLimit({
    scope: "admin-login",
    identifier: `${getRequestIp(headerList)}:${email.toLowerCase()}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  let valid = false;
  if (ADMIN_PASSWORD_HASH) {
    valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } else if (process.env.NODE_ENV !== "production" && ADMIN_PASSWORD_PLAIN) {
    valid = password === ADMIN_PASSWORD_PLAIN;
  }

  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || !valid) {
    return { error: "Identifiants invalides." };
  }

  const session = await getSession();
  session.email = email.toLowerCase();
  session.name = ADMIN_NAME;
  session.loggedAt = Date.now();
  await session.save();

  redirect("/admin");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
