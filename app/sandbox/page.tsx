import type { Metadata } from "next";
import { SandboxExperience } from "@/components/sandbox/SandboxExperience";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Orbital Ruins Sandbox | ${SITE_NAME}`,
  description:
    "Explore Praneesh R V's cybersecurity portfolio as an opt-in 3D orbital ruins sandbox with scanner-driven proof artifacts.",
};

export default function SandboxPage() {
  return (
    <main className="min-h-dvh bg-void text-text-primary">
      <SandboxExperience />
    </main>
  );
}
