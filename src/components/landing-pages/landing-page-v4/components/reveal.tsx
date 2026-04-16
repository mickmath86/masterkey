"use client";

import { useEffect, useRef, type ReactNode } from "react";

const STYLES = `
.mk-reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1);
  will-change: opacity, transform;
}
.mk-reveal.mk-revealed { opacity: 1; transform: translateY(0); }
.mk-reveal-left { opacity: 0; transform: translateX(-28px); transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1); }
.mk-reveal-left.mk-revealed { opacity: 1; transform: translateX(0); }
.mk-reveal-right { opacity: 0; transform: translateX(28px); transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1); }
.mk-reveal-right.mk-revealed { opacity: 1; transform: translateX(0); }
.mk-reveal-scale { opacity: 0; transform: scale(0.93); transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1); }
.mk-reveal-scale.mk-revealed { opacity: 1; transform: scale(1); }
.mk-d1 { transition-delay: 0.08s !important; }
.mk-d2 { transition-delay: 0.18s !important; }
.mk-d3 { transition-delay: 0.28s !important; }
.mk-d4 { transition-delay: 0.4s !important; }
.mk-d5 { transition-delay: 0.52s !important; }
`;

let injected = false;
function injectStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const s = document.createElement("style");
  s.textContent = STYLES;
  document.head.appendChild(s);
}

type RevealType = "up" | "left" | "right" | "scale";
type Delay = 0 | 1 | 2 | 3 | 4 | 5;

export function Reveal({
  children,
  type = "up",
  delay = 0,
  className = "",
  threshold = 0.12,
}: {
  children: ReactNode;
  type?: RevealType;
  delay?: Delay;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectStyles();
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("mk-revealed");
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const base =
    type === "left"
      ? "mk-reveal-left"
      : type === "right"
      ? "mk-reveal-right"
      : type === "scale"
      ? "mk-reveal-scale"
      : "mk-reveal";

  const dc = delay ? `mk-d${delay}` : "";

  return (
    <div ref={ref} className={`${base} ${dc} ${className}`}>
      {children}
    </div>
  );
}
