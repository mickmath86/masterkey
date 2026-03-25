"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Home,
  BookOpen,
  MapPin,
  Newspaper,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/marketpulse/dashboard",
    icon: Home,
  },
  {
    label: "Playbooks",
    href: "/marketpulse/dashboard/playbooks",
    icon: BookOpen,
  },
  {
    label: "Neighborhood Guide",
    href: "/marketpulse/dashboard/neighborhood-guide",
    icon: MapPin,
  },
  {
    label: "News",
    href: "/marketpulse/dashboard/news",
    icon: Newspaper,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0 bg-[#F5F3F0] border-r border-gray-200 py-5 px-3 overflow-y-auto">
      {/* Brand */}
      <Link
        href="/marketpulse/dashboard"
        className="flex items-center gap-2 px-3 mb-6"
      >
        <BarChart3 className="w-5 h-5 text-mk-teal" />
        <span className="text-sm font-semibold text-gray-900">
          MarketPulse
        </span>
      </Link>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-white font-medium text-gray-900 shadow-sm"
                  : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom area */}
      <div className="mt-auto pt-6 px-3">
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Data sourced from MLS, county records, and public feeds. Updated daily.
        </p>
      </div>
    </aside>
  );
}
