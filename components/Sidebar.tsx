"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav-items";
import clsx from "clsx";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-forest-950 text-white min-h-screen sticky top-0">
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden ring-2 ring-gold-500/60">
          <Image src="/logo.png" alt="Silver Maxwood Dairies crest" fill className="object-cover object-top" />
        </div>
        <div className="leading-tight">
          <p className="font-display text-sm tracking-wide text-white">Silver Maxwood</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold-500">Dairies</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-pasture-600 text-white font-medium"
                  : "text-silver-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10 text-[11px] text-silver-400 leading-relaxed">
        <p className="text-gold-500 tracking-wide">"Luxury in every drop"</p>
        <p className="mt-1">© {new Date().getFullYear()} Silver Maxwood Dairies</p>
      </div>
    </aside>
  );
}
