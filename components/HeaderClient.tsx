"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  Building2,
  Hammer,
  Instagram,
  Facebook,
  Linkedin,
  MessageCircle,
  LockKeyhole,
} from "lucide-react";
import { NAV_PRIMARY } from "@/lib/constants/nav";
import { CONTACT, SOCIAL } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";
import type { WebsiteSettingsType } from "@/lib/website-settings";

/* ────────────────────────────────────────────────────────────────────────── */

const SUBMENU_META: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  "/projets?status=ongoing": {
    icon: Hammer,
    description: "Chantiers en cours, livraisons à venir.",
  },
  "/projets?status=completed": {
    icon: Building2,
    description: "Notre portfolio livré depuis 2008.",
  },
};

/* ────────────────────────────────────────────────────────────────────────── */

export default function Header({ settings }: { settings?: WebsiteSettingsType }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const pathname = usePathname();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const contact = {
    phone: settings?.phone || CONTACT.phone,
    phoneRaw: settings?.phoneRaw || CONTACT.phoneRaw,
    whatsapp: settings?.whatsapp || CONTACT.whatsapp,
    address: settings?.address || CONTACT.address,
    hours: settings?.hours || CONTACT.hours,
  };
  const social = {
    instagram: settings?.instagram || SOCIAL.instagram,
    facebook: settings?.facebook || SOCIAL.facebook,
    linkedin: settings?.linkedin || SOCIAL.linkedin,
  };

  // Track scroll to swap header chrome.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset menus on navigation.
  useEffect(() => {
    setMobileOpen(false);
    setOpenSub(null);
    setMobileSub(null);
  }, [pathname]);

  // Body scroll-lock + ESC close while drawer is open. Focus the close button
  // for keyboard users.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    const path = href.split("?")[0];
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)]">
        {/* ─────────────── Utility strip (lg+, collapses on scroll) ─────────────── */}
        <div
          className={cn(
            "hidden lg:block bg-[var(--color-navy-950)] text-white/80 overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
            scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
          )}
          aria-hidden={scrolled}
        >
          <div className="container-page flex h-10 items-center justify-between text-[12px] tracking-wide">
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[var(--color-gold-400)]" />
                {contact.address}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[var(--color-gold-400)]" />
                Lun — Ven · {contact.hours}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`tel:${contact.phoneRaw}`}
                className="inline-flex items-center gap-1.5 hover:text-[var(--color-gold-400)] transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                {contact.phone}
              </a>
              <span className="h-3 w-px bg-white/15" />
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--color-gold-400)] transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-[var(--color-gold-400)] transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-[var(--color-gold-400)] transition-colors"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-[var(--color-gold-400)] transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
              <span className="h-3 w-px bg-white/15" />
              <Link
                href="/admin/login"
                aria-label="Accéder à l'espace privé"
                title="Espace privé"
                className="inline-flex items-center gap-1.5 text-white/45 transition-colors hover:text-white/80"
              >
                <LockKeyhole className="h-3 w-3" />
                <span className="text-[10px] uppercase tracking-[0.12em]">Espace privé</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ─────────────────────────── Main bar ─────────────────────────── */}
        <div
          className={cn(
            "transition-all duration-300",
            scrolled
              ? "bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(11,23,51,0.18)] border-b border-[var(--color-stone-200)]"
              : "bg-white/70 backdrop-blur-md"
          )}
        >
          <div
            className={cn(
              "container-page flex items-center justify-between gap-6 transition-[height] duration-300",
              scrolled ? "h-16" : "h-20"
            )}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0 group"
              aria-label="IBM Immobilière — Accueil"
            >
              <Image
                src="/IBM_logo_black_transparent.png"
                alt="IBM Immobilière"
                width={1254}
                height={1254}
                priority
                style={{ width: "auto" }}
                className={cn(
                  "object-contain transition-transform duration-300 group-hover:scale-[1.03]",
                  scrolled ? "h-10" : "h-12"
                )}
              />
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center"
              onMouseLeave={() => {
                setHovered(null);
                setOpenSub(null);
              }}
            >
              <LayoutGroup id="nav">
                <ul className="flex items-center gap-0.5">
                  {NAV_PRIMARY.map((item) => {
                    const active = isActive(item.href);
                    const isHovered = hovered === item.href;
                    const hasChildren = !!item.children?.length;

                    return (
                      <li
                        key={item.href}
                        className="relative"
                        onMouseEnter={() => {
                          setHovered(item.href);
                          if (hasChildren) setOpenSub(item.href);
                          else setOpenSub(null);
                        }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "relative inline-flex items-center gap-1 px-4 py-2 rounded-full text-[13.5px] font-medium tracking-wide transition-colors duration-200",
                            active
                              ? "text-[var(--color-navy-900)]"
                              : "text-[var(--color-stone-700)] hover:text-[var(--color-navy-900)]"
                          )}
                          aria-haspopup={hasChildren || undefined}
                          aria-expanded={hasChildren ? openSub === item.href : undefined}
                        >
                          {/* Sliding hover pill */}
                          {isHovered && (
                            <motion.span
                              layoutId="nav-hover-pill"
                              className="absolute inset-0 rounded-full bg-[var(--color-ivory-100)] ring-1 ring-[var(--color-stone-200)]"
                              transition={{
                                type: "spring",
                                bounce: 0.18,
                                duration: 0.45,
                              }}
                              aria-hidden
                            />
                          )}
                          <span className="relative z-10">{item.label}</span>
                          {hasChildren && (
                            <ChevronDown
                              className={cn(
                                "relative z-10 h-3.5 w-3.5 opacity-70 transition-transform duration-200",
                                openSub === item.href && "rotate-180"
                              )}
                            />
                          )}
                          {/* Gold dot indicator on the active route */}
                          {active && (
                            <motion.span
                              layoutId="nav-active-dot"
                              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[var(--color-gold-500)]"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                              aria-hidden
                            />
                          )}
                        </Link>

                        {/* Mega menu */}
                        {hasChildren && (
                          <AnimatePresence>
                            {openSub === item.href && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[min(28rem,90vw)]"
                              >
                                <div className="relative rounded-2xl bg-white shadow-[0_24px_60px_-20px_rgba(11,23,51,0.28)] ring-1 ring-[var(--color-stone-200)] overflow-hidden">
                                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-400)] to-transparent" />
                                  <div className="px-5 pt-5 pb-2 flex items-center justify-between">
                                    <span className="eyebrow text-[10.5px]">{item.label}</span>
                                    <Link
                                      href={item.href}
                                      className="text-[11.5px] font-semibold text-[var(--color-navy-900)] inline-flex items-center gap-1 hover:text-[var(--color-gold-700)] transition-colors"
                                    >
                                      Tout voir
                                      <ArrowUpRight className="h-3.5 w-3.5" />
                                    </Link>
                                  </div>
                                  <ul className="p-2">
                                    {item.children!.map((c) => {
                                      const meta = SUBMENU_META[c.href];
                                      const Icon = meta?.icon;
                                      return (
                                        <li key={c.href}>
                                          <Link
                                            href={c.href}
                                            className="group flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-[var(--color-ivory-100)] transition-colors"
                                          >
                                            {Icon && (
                                              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gold-50)] ring-1 ring-[var(--color-gold-200)] text-[var(--color-gold-700)] group-hover:bg-[var(--color-gold-500)] group-hover:text-[var(--color-navy-900)] transition-colors">
                                                <Icon className="h-4 w-4" />
                                              </span>
                                            )}
                                            <span className="flex-1">
                                              <span className="block text-[14px] font-semibold text-[var(--color-navy-900)]">
                                                {c.label}
                                              </span>
                                              {meta?.description && (
                                                <span className="block text-[12.5px] text-[var(--color-stone-600)] mt-0.5">
                                                  {meta.description}
                                                </span>
                                              )}
                                            </span>
                                            <ChevronRight className="mt-2 h-4 w-4 text-[var(--color-stone-400)] group-hover:text-[var(--color-navy-900)] group-hover:translate-x-0.5 transition-all" />
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </LayoutGroup>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 md:gap-3">
              <a
                href={`tel:${contact.phoneRaw}`}
                className="hidden md:inline-flex items-center gap-2.5 group lg:hidden xl:inline-flex"
                aria-label={`Appeler ${contact.phone}`}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ivory-100)] ring-1 ring-[var(--color-stone-200)] text-[var(--color-gold-700)] group-hover:bg-[var(--color-gold-500)] group-hover:text-[var(--color-navy-900)] transition-colors">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-stone-500)]">
                    Appelez-nous
                  </span>
                  <span className="text-[13px] font-semibold text-[var(--color-navy-900)]">
                    {contact.phone}
                  </span>
                </span>
              </a>

              <Link
                href="/contact"
                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[var(--color-gold-500)] px-5 py-2.5 text-[13.5px] font-semibold text-[var(--color-navy-900)] shadow-[0_6px_18px_-8px_rgba(168,132,47,0.7)] hover:bg-[var(--color-gold-400)] hover:shadow-[0_10px_24px_-10px_rgba(168,132,47,0.8)] hover:-translate-y-0.5 transition-all duration-200"
              >
                Prendre RDV
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden relative inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-navy-900)] ring-1 ring-[var(--color-stone-200)] hover:bg-[var(--color-ivory-100)] transition-colors"
                aria-label="Ouvrir le menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-drawer"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────── Mobile drawer ─────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-[60]"
            initial="hidden"
            animate="visible"
            exit="hidden"
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
          >
            {/* Backdrop */}
            <motion.button
              type="button"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer le menu"
              className="absolute inset-0 bg-[var(--color-navy-950)]/55 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.aside
              variants={{
                hidden: { x: "100%" },
                visible: { x: 0 },
              }}
              transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-[min(86vw,400px)] bg-white shadow-[-24px_0_60px_-20px_rgba(11,23,51,0.35)] flex flex-col"
            >
              {/* Header row */}
              <div className="flex items-center justify-between px-5 h-20 border-b border-[var(--color-stone-100)] bg-gradient-to-b from-[var(--color-ivory-50)] to-white">
                <Link
                  href="/"
                  className="flex items-center"
                  onClick={() => setMobileOpen(false)}
                  aria-label="IBM Immobilière — Accueil"
                >
                  <Image
                    src="/IBM_logo_black_transparent.png"
                    alt="IBM Immobilière"
                    width={1254}
                    height={1254}
                    style={{ width: "auto" }}
                    className="h-10 object-contain"
                  />
                </Link>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-navy-900)] ring-1 ring-[var(--color-stone-200)] hover:bg-[var(--color-ivory-100)] transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav (scrollable) */}
              <div className="flex-1 overflow-y-auto px-2 py-4">
                <p className="px-3 mb-2 text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[var(--color-stone-500)]">
                  Navigation
                </p>
                <ul className="flex flex-col gap-0.5">
                  {NAV_PRIMARY.map((item, i) => {
                    const active = isActive(item.href);
                    const hasChildren = !!item.children?.length;
                    const subOpen = mobileSub === item.href;

                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.12 + i * 0.04,
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="rounded-xl"
                      >
                        <div
                          className={cn(
                            "relative flex items-center rounded-xl transition-colors",
                            active
                              ? "bg-[var(--color-ivory-100)]"
                              : "hover:bg-[var(--color-ivory-50)]"
                          )}
                        >
                          {active && (
                            <span
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-[var(--color-gold-500)]"
                              aria-hidden
                            />
                          )}
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex-1 flex items-center justify-between px-4 py-3.5 text-[15.5px] font-semibold",
                              active
                                ? "text-[var(--color-navy-900)]"
                                : "text-[var(--color-stone-800)]"
                            )}
                          >
                            {item.label}
                            {!hasChildren && (
                              <ArrowUpRight
                                className={cn(
                                  "h-4 w-4 transition-colors",
                                  active
                                    ? "text-[var(--color-gold-600)]"
                                    : "text-[var(--color-stone-400)]"
                                )}
                              />
                            )}
                          </Link>
                          {hasChildren && (
                            <button
                              type="button"
                              onClick={() => setMobileSub(subOpen ? null : item.href)}
                              className="px-3 py-3.5 text-[var(--color-stone-500)] hover:text-[var(--color-navy-900)]"
                              aria-expanded={subOpen}
                              aria-label={`Sous-menu ${item.label}`}
                            >
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform duration-300",
                                  subOpen && "rotate-180"
                                )}
                              />
                            </button>
                          )}
                        </div>

                        {hasChildren && (
                          <AnimatePresence initial={false}>
                            {subOpen && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden pl-4"
                              >
                                <div className="mt-1 mb-2 pl-3 border-l border-[var(--color-stone-200)] flex flex-col gap-0.5">
                                  {item.children!.map((c) => {
                                    const meta = SUBMENU_META[c.href];
                                    const Icon = meta?.icon;
                                    return (
                                      <Link
                                        key={c.href}
                                        href={c.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-[var(--color-stone-700)] hover:bg-[var(--color-ivory-100)] hover:text-[var(--color-navy-900)] transition-colors"
                                      >
                                        {Icon && (
                                          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-gold-50)] ring-1 ring-[var(--color-gold-200)] text-[var(--color-gold-700)]">
                                            <Icon className="h-3.5 w-3.5" />
                                          </span>
                                        )}
                                        <span className="flex-1 font-medium">{c.label}</span>
                                        <ChevronRight className="h-3.5 w-3.5 text-[var(--color-stone-400)] group-hover:text-[var(--color-navy-900)] group-hover:translate-x-0.5 transition-all" />
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>

                {/* Contact block */}
                <div className="mt-6 mx-2 rounded-2xl bg-[var(--color-navy-900)] text-white p-5 relative overflow-hidden">
                  <div
                    className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[var(--color-gold-500)]/15 blur-2xl"
                    aria-hidden
                  />
                  <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[var(--color-gold-400)]">
                    Nous contacter
                  </p>
                  <a
                    href={`tel:${contact.phoneRaw}`}
                    className="mt-2 flex items-center gap-2 text-[18px] font-semibold hover:text-[var(--color-gold-400)] transition-colors"
                  >
                    <Phone className="h-4 w-4 text-[var(--color-gold-400)]" />
                    {contact.phone}
                  </a>
                  <p className="mt-2 flex items-center gap-2 text-[13px] text-white/75">
                    <MapPin className="h-3.5 w-3.5 text-[var(--color-gold-400)]" />
                    {contact.address}
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-[13px] text-white/75">
                    <Clock className="h-3.5 w-3.5 text-[var(--color-gold-400)]" />
                    Lun — Ven · {contact.hours}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href={contact.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[var(--color-gold-500)] hover:text-[var(--color-navy-900)] transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                    <a
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[var(--color-gold-500)] hover:text-[var(--color-navy-900)] transition-colors"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                    <a
                      href={social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[var(--color-gold-500)] hover:text-[var(--color-navy-900)] transition-colors"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href={social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[var(--color-gold-500)] hover:text-[var(--color-navy-900)] transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Sticky CTA */}
              <div className="border-t border-[var(--color-stone-100)] bg-white p-4">
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-gold-500)] px-5 py-3.5 text-[14.5px] font-semibold text-[var(--color-navy-900)] shadow-[0_8px_22px_-8px_rgba(168,132,47,0.6)] hover:bg-[var(--color-gold-400)] transition-colors"
                >
                  Prendre rendez-vous
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

