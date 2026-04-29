"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { BootLoader } from "@/components/ui/BootLoader";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { useGlobalStore } from "@/stores/globalStore";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { loadingComplete, setLoadingComplete } = useGlobalStore();
  const pathname = usePathname();
  const handleBootComplete = useCallback(() => {
    setLoadingComplete(true);
  }, [setLoadingComplete]);

  return (
    <>
      <div className="flex flex-1 flex-col">{children}</div>
      {!loadingComplete && <BootLoader onComplete={handleBootComplete} />}
      {loadingComplete && pathname === "/" && <FloatingNav />}
    </>
  );
}
