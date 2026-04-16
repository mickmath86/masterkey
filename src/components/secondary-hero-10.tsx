"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

// ── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// Inline global styles injected once
const REVEAL_STYLES = `
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-left {
    opacity: 0;
    transform: translateX(-24px);
    transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal-left.revealed {
    opacity: 1;
    transform: translateX(0);
  }
  .reveal-scale {
    opacity: 0;
    transform: scale(0.94);
    transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal-scale.revealed {
    opacity: 1;
    transform: scale(1);
  }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.35s; }
`;

function RevealStyle() {
  return <style dangerouslySetInnerHTML={{ __html: REVEAL_STYLES }} />;
}

function Reveal({
  children,
  className = "",
  type = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  type?: "up" | "left" | "scale";
  delay?: 0 | 1 | 2 | 3;
}) {
  const ref = useReveal();
  const base =
    type === "left"
      ? "reveal-left"
      : type === "scale"
      ? "reveal-scale"
      : "reveal";
  const delayClass = delay ? `reveal-delay-${delay}` : "";
  return (
    <div ref={ref} className={`${base} ${delayClass} ${className}`}>
      {children}
    </div>
  );
}

// ── Image URLs — high-quality Unsplash homes ─────────────────────────────────
const IMAGES = {
  // Tall portrait — luxury CA home exterior
  portrait:
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=927&h=1648&fit=crop&auto=format&q=80",
  // Square — bright living room interior
  square:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=800&fit=crop&auto=format&q=80",
  // Landscape — aerial neighborhood / front of home
  landscape:
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=2340&h=1560&fit=crop&auto=format&q=80",
};

export default function HeroSection() {
  return (
    <>
      <RevealStyle />
      <section>
        <div className="py-24 md:py-32">
          <div className="mx-auto mb-8 max-w-5xl px-6">
            <div className="grid grid-cols-6 gap-4 sm:grid-cols-8">

              {/* ── Copy block ── */}
              <Reveal
                type="left"
                className="col-span-6 max-md:pb-6 sm:col-span-5 md:col-span-4 md:pt-6"
              >
                <h1 className="text-balance text-4xl font-semibold md:text-6xl">
                  <span className="text-primary">Sell Confidently</span> in the
                  Conejo Valley
                </h1>
                <p className="text-muted-foreground mb-6 mt-4 text-balance text-lg">
                  Local expertise, data-backed pricing, and a performance
                  guarantee — so you know exactly what you'll get before you
                  sign anything.
                </p>
                <Button asChild size="sm">
                  <Link href="/landing/verified-value">
                    Get Your Verified Value
                  </Link>
                </Button>
              </Reveal>

              {/* ── Portrait image (top right) ── */}
              <Reveal
                type="scale"
                delay={1}
                className="col-span-3 flex items-end sm:col-span-2 sm:col-start-6"
              >
                <div className="aspect-4/5 before:border-foreground/5 before:bg-primary/10 relative w-full overflow-hidden rounded-xl shadow-xl before:absolute before:inset-0 before:rounded-xl before:border">
                  <Image
                    src={IMAGES.portrait}
                    alt="Luxury California home exterior"
                    className="size-full object-cover"
                    width={927}
                    height={1648}
                  />
                </div>
              </Reveal>

              {/* ── Square image (bottom left) ── */}
              <Reveal
                type="scale"
                delay={2}
                className="col-span-3 max-md:flex max-md:items-end sm:col-start-3"
              >
                <div className="before:border-foreground/5 before:bg-primary/5 relative mt-auto aspect-square h-fit w-full overflow-hidden rounded-xl shadow-xl before:absolute before:inset-0 before:rounded-xl before:border">
                  <Image
                    src={IMAGES.square}
                    alt="Bright luxury home living room"
                    className="size-full object-cover"
                    width={800}
                    height={800}
                  />
                </div>
              </Reveal>

              {/* ── Landscape image (bottom right) ── */}
              <Reveal
                type="scale"
                delay={3}
                className="before:border-foreground/5 before:bg-primary/5 col-span-4 max-md:col-start-3 md:col-span-3"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-xl before:absolute before:inset-0 before:rounded-xl before:border before:border-foreground/5">
                  <Image
                    src={IMAGES.landscape}
                    alt="Beautiful home exterior with landscaping"
                    className="size-full object-cover"
                    width={2340}
                    height={1560}
                  />
                </div>
              </Reveal>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
