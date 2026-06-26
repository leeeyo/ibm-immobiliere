"use client";

import { useActionState } from "react";
import { Lock, Mail, Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="space-y-5">
      <Field
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="admin@ibm-immobiliere.tn"
        autoComplete="email"
        icon={<Mail className="h-4 w-4" />}
        required
      />
      <Field
        id="password"
        name="password"
        type="password"
        label="Mot de passe"
        placeholder="••••••••"
        autoComplete="current-password"
        icon={<Lock className="h-4 w-4" />}
        required
      />

      {state.error ? (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {pending ? "Connexion…" : "Se connecter"}
      </button>

      <p className="text-xs text-[var(--color-stone-500)] text-center">
        Accès strictement réservé au personnel autorisé.
      </p>
    </form>
  );
}

function Field({
  id,
  name,
  type,
  label,
  placeholder,
  autoComplete,
  icon,
  required,
}: {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  icon?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-navy-900)] mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-stone-400)]">
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-md border border-[var(--color-stone-300)] bg-white px-4 py-3 pl-10 text-[var(--color-navy-900)] placeholder:text-[var(--color-stone-400)] focus:border-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30"
        />
      </div>
    </div>
  );
}
