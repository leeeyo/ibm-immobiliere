import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const BM_GROUP_URL = "https://bmgroup.tn";

export function BMGroupFooterBadge() {
  return (
    <a
      href={BM_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visiter BM Group"
      className="mt-7 inline-flex max-w-sm items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.04] p-3 pr-4 transition-all duration-300 hover:border-[var(--color-gold-500)]/70 hover:bg-white/[0.08]"
    >
      <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-white p-2">
        <Image
          src="/bmgroup.png"
          alt="BM Group"
          width={120}
          height={72}
          className="h-auto max-h-10 w-auto object-contain"
        />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-400)]">
          Membre de
        </span>
        <span className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
          BM Group
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        </span>
      </span>
    </a>
  );
}
