"use client";

import { useState, useRef, useEffect } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
export interface CitationSource {
  name: string;
  url: string;
  description?: string;
}

interface SourceCitationsProps {
  sources: CitationSource[];
  /** Optional label shown before the circles, e.g. "Source" or "Sources" */
  label?: string;
}

/* ─── Favicon helper ─────────────────────────────────────────────────────────
   Uses Google's favicon service — reliable, no API key needed.
   ─────────────────────────────────────────────────────────────────────────── */
function faviconUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return "";
  }
}

/* ─── Single favicon circle ──────────────────────────────────────────────── */
function FaviconCircle({
  source,
  index,
  total,
}: {
  source: CitationSource;
  index: number;
  total: number;
}) {
  const [imgError, setImgError] = useState(false);
  const initial = source.name.charAt(0).toUpperCase();

  // Overlap: each circle after the first shifts left by 8px
  const offsetLeft = index * -8;
  // z-index: rightmost circle on top (matches Perplexity style)
  const zIndex = total - index;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ marginLeft: index === 0 ? 0 : offsetLeft, zIndex }}
    >
      <div className="w-5 h-5 rounded-full border border-white/20 bg-[#1a1f2e] overflow-hidden flex items-center justify-center">
        {!imgError ? (
          <img
            src={faviconUrl(source.url)}
            alt={source.name}
            className="w-3.5 h-3.5 object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-[8px] font-bold text-white/60">{initial}</span>
        )}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function SourceCitations({
  sources,
  label,
}: SourceCitationsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Max 3 circles visible, rest go in tooltip
  const visibleSources = sources.slice(0, 3);
  const overflow = sources.length > 3 ? sources.length - 3 : 0;

  // Close tooltip on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!sources.length) return null;

  return (
    <div className="relative inline-flex items-center gap-1.5" ref={ref}>
      {label && (
        <span className="text-[10px] text-white/25 font-medium uppercase tracking-widest">
          {label}
        </span>
      )}

      {/* Clickable / hoverable pill */}
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="flex items-center gap-1 group"
        aria-label="View sources"
      >
        {/* Overlapping favicon circles */}
        <div className="flex items-center" style={{ paddingRight: overflow ? 4 : 0 }}>
          {visibleSources.map((src, i) => (
            <FaviconCircle
              key={src.url}
              source={src}
              index={i}
              total={visibleSources.length}
            />
          ))}
          {overflow > 0 && (
            <div
              className="w-5 h-5 rounded-full border border-white/20 bg-white/10 flex items-center justify-center flex-shrink-0"
              style={{ marginLeft: -8, zIndex: 0 }}
            >
              <span className="text-[8px] font-bold text-white/50">
                +{overflow}
              </span>
            </div>
          )}
        </div>

        {/* Subtle arrow */}
        <svg
          className={`w-2.5 h-2.5 text-white/20 group-hover:text-white/40 transition-all duration-150 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown tooltip */}
      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 z-50 min-w-[220px] max-w-[300px]"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-3 pt-2.5 pb-1.5 border-b border-white/[0.06]">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                Sources
              </p>
            </div>
            <div className="py-1">
              {sources.map((src, i) => (
                <a
                  key={src.url}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 px-3 py-2 hover:bg-white/[0.04] transition-colors group/link"
                >
                  {/* Favicon */}
                  <div className="w-4 h-4 rounded flex-shrink-0 mt-0.5 bg-white/[0.06] flex items-center justify-center overflow-hidden">
                    <img
                      src={faviconUrl(src.url)}
                      alt=""
                      className="w-3 h-3 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-white/70 group-hover/link:text-white transition-colors truncate">
                      {src.name}
                    </p>
                    {src.description && (
                      <p className="text-[10px] text-white/30 mt-0.5 leading-snug">
                        {src.description}
                      </p>
                    )}
                  </div>
                  {/* External link indicator */}
                  <svg
                    className="w-3 h-3 text-white/20 group-hover/link:text-white/40 flex-shrink-0 mt-0.5 transition-colors"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M3.5 8.5L8.5 3.5M8.5 3.5H5M8.5 3.5V7"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-4 w-0 h-0" style={{
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid rgba(255,255,255,0.1)",
          }} />
        </div>
      )}
    </div>
  );
}
