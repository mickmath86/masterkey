"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  BookOpen,
  Map,
  BarChart2,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/marketpulse/dashboard",
    icon: LayoutDashboard,
    comingSoon: false,
  },
  {
    label: "News",
    href: "/marketpulse/dashboard/news",
    icon: Newspaper,
    comingSoon: true,
  },
  {
    label: "Resources",
    href: "/marketpulse/dashboard/resources",
    icon: BookOpen,
    comingSoon: false,
  },
  {
    label: "Neighborhood Guides",
    href: "/marketpulse/dashboard/neighborhood-guide",
    icon: Map,
    comingSoon: true,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0 bg-[#0D1117] border-r border-white/[0.06] py-5 px-3 overflow-y-auto">
      {/* Brand */}
      <Link
        href="/marketpulse/dashboard"
        className="flex items-center gap-2.5 px-3 mb-8"
      >
        <div className="w-7 h-7 rounded-md bg-[#1A4D4D] flex items-center justify-center flex-shrink-0">
          <BarChart2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-[13px] font-semibold text-white tracking-tight">
            MarketPulse
          </span>
          <p className="text-[10px] text-white/40 leading-none mt-0.5">Ventura County</p>
        </div>
      </Link>

      {/* Section label */}
      <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-2">
        Navigation
      </p>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/marketpulse/dashboard"
              ? pathname === item.href
              : pathname?.startsWith(item.href);
          
          const content = (
            <>
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? "text-[#5BA8A8]" : item.comingSoon ? "text-white/20" : "text-white/30"
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {item.comingSoon && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Soon
                </span>
              )}
            </>
          );

          if (item.comingSoon) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] text-white/30 cursor-not-allowed opacity-60"
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 ${
                isActive
                  ? "bg-white/[0.08] text-white font-medium"
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
              }`}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      {/* Bottom area */}
      <div className="mt-auto pt-6 px-3">
        <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-3">
          <p className="text-[10px] text-white/30 leading-relaxed">
            Data sourced from Rentcast & AI analysis. Updated every 6 hours.
          </p>
        </div>
      </div>
    </aside>
  );
}
