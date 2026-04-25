"use client";

import { useGlobalStore } from "@/stores/globalStore";
import { BootLoader } from "@/components/ui/BootLoader";
import { useEffect, useState } from "react";

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
      <div
        className={`flex-1 flex flex-col transition-opacity duration-1000 ${
          loadingComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </>
  );
}
