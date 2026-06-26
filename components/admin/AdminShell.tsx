"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Inbox,
  Building2,
  Home,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Demandes", icon: Inbox },
  { href: "/admin/properties", label: "Biens", icon: Home },
  { href: "/admin/projects", label: "Projets", icon: Building2 },
  { href: "/admin/meta", label: "Tracking", icon: Activity },
  { href: "/admin/settings", label: "Site web", icon: Settings },
];

export default function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { email: string; name?: string };
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-ivory-50)]">
      {/* Top bar (mobile) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-[var(--color-stone-200)]">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/IBM_logo_black_transparent.png"
              alt="IBM"
              width={1254}
              height={1254}
              className="h-9 w-auto"
            />
            <span className="font-display text-base text-[var(--color-navy-900)]">Admin</span>
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-navy-900)] hover:bg-[var(--color-ivory-100)]"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="lg:flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:flex lg:flex-col lg:shrink-0",
            "bg-[var(--color-navy-950)] text-white",
            mobileOpen ? "block" : "hidden lg:block"
          )}
        >
          <div className="hidden lg:flex h-20 items-center gap-3 px-6 border-b border-white/10">
            <Image
              src="/IBM_logo_white_transparent.png"
              alt="IBM Immobilière"
              width={1254}
              height={1254}
              className="h-9 w-auto"
            />
            <span className="font-display text-lg text-white/95">Admin</span>
          </div>

          <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/65 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {active ? (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-gold-500)]" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 pb-4 border-t border-white/10 pt-4 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/65 hover:text-white hover:bg-white/5"
            >
              <ExternalLink className="h-4 w-4" />
              Voir le site
            </Link>

            <div className="px-3 py-3 rounded-md bg-white/5">
              <p className="text-xs text-white/50">Connecté en tant que</p>
              <p className="mt-0.5 text-sm font-medium text-white truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-white/40 truncate">{user.email}</p>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/65 hover:text-white hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            </form>
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
