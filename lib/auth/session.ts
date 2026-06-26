import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getIronSession, type SessionOptions } from "iron-session";

export type AdminSession = {
  email?: string;
  name?: string;
  loggedAt?: number;
};

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

function getSessionPassword(): string {
  const sessionPassword =
    cleanEnv(process.env.SESSION_PASSWORD) ||
    "dev-only-32+chars-secret-change-me-please-XXXX";

  if (process.env.NODE_ENV === "production" && !cleanEnv(process.env.SESSION_PASSWORD)) {
    throw new Error("SESSION_PASSWORD env var is required in production.");
  }

  return sessionPassword;
}

function getSessionOptions(): SessionOptions {
  return {
    password: getSessionPassword(),
    cookieName: "ibm_admin_session",
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    },
  };
}

const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

function isCurrentSession(session: AdminSession): boolean {
  return Boolean(
    session.email &&
      session.loggedAt &&
      Date.now() - session.loggedAt <= SESSION_MAX_AGE_MS
  );
}

export async function getSession(): Promise<AdminSession & { destroy: () => void; save: () => Promise<void> }> {
  const cookieStore = await cookies();
  const session = await getIronSession<AdminSession>(cookieStore, getSessionOptions());
  return session as any;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  if (isCurrentSession(session)) return true;
  if (session.email) session.destroy();
  return false;
}

/**
 * Use in pages and reads — redirects to /admin/login if not authenticated.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!isCurrentSession(session)) {
    if (session.email) session.destroy();
    redirect("/admin/login");
  }
  return { email: session.email, name: session.name, loggedAt: session.loggedAt };
}

/**
 * Use in mutating Server Actions — throws so the action returns an error
 * payload instead of silently redirecting (which would lose the form state).
 */
export async function assertAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!isCurrentSession(session)) {
    if (session.email) session.destroy();
    throw new Error("UNAUTHORIZED");
  }
  return { email: session.email, name: session.name, loggedAt: session.loggedAt };
}
