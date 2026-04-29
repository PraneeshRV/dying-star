"use client";

import { useEffect, useState } from "react";
import { BootLoader } from "@/components/ui/BootLoader";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { useGlobalStore } from "@/stores/globalStore";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { loadingComplete, setLoadingComplete } = useGlobalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-void min-h-dvh" />;

  return (
    <>
      {!loadingComplete && (
        <BootLoader onComplete={() => setLoadingComplete(true)} />
      )}
      {loadingComplete && (
        <div className="flex flex-1 flex-col">{children}</div>
      )}
      {loadingComplete && <FloatingNav />}
    </>
  );
}
