"use client";

import { useRouter } from "next/navigation";
import NavbarMinimal from "@/components/navbar-minimal";
import MarketPulseContent from "./MarketPulseContent";

export default function MarketPulseWrapper() {
  const router = useRouter();

  function handleGateCleared() {
    router.push("/marketpulse/dashboard");
  }

  return (
    <>
      <NavbarMinimal />
      <main id="top">
        <MarketPulseContent onGateCleared={handleGateCleared} />
      </main>
    </>
  );
}
