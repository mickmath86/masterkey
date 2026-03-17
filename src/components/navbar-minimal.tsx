/**
 * NavbarMinimal
 *
 * A stripped-down header for landing pages and lead-capture pages.
 * Shows only the MasterKey logo, centered, with no navigation links
 * and no clickable home link — keeps users focused on the page CTA.
 *
 * Usage:
 *   import NavbarMinimal from "@/components/navbar-minimal";
 *   <NavbarMinimal />
 *
 * Variants (optional prop):
 *   theme="dark"  — white logo on transparent (for dark hero backgrounds)
 *   theme="light" — default dark logo on white background
 */

import { MasterKeyLogo } from "./logo";

interface NavbarMinimalProps {
  /** "light" renders the standard dark logo on a white bar (default).
   *  "dark"  renders a white-tinted logo on a transparent bar — use when
   *  the navbar sits directly over a dark hero section. */
  theme?: "light" | "dark";
}

export default function NavbarMinimal({ theme = "light" }: NavbarMinimalProps) {
  const isDark = theme === "dark";

  return (
    <header
      className={`w-full ${
        isDark
          ? "bg-transparent"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <nav
        aria-label="Site header"
        className="mx-auto flex max-w-7xl items-center justify-center px-6 py-5 lg:px-8"
      >
        {/* Logo — no link, intentionally non-interactive on lead-capture pages */}
        <span aria-label="MasterKey Real Estate" className={isDark ? "opacity-90" : ""}>
          <MasterKeyLogo />
        </span>
      </nav>
    </header>
  );
}
