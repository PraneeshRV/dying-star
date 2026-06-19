import type { Metadata } from "next";
import { SandboxRenderHarness } from "@/components/sandbox/render/SandboxRenderHarness";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Render Foundation Sandbox | ${SITE_NAME}`,
  description:
    "Phase S0 render foundation for the dying-star cinematic sandbox: a TSL test star proving the WebGPU path with WebGL2 and static fallbacks.",
};

export default function SandboxPage() {
  return (
    <main className="min-h-dvh bg-void text-text-primary">
      {/* No-JS / prerender shell. The interactive canvas mounts client-side. */}
      <noscript>
        <div className="px-6 py-10 text-center">
          <h1 className="font-bold text-2xl uppercase tracking-wider">
            Dying Star — Render Foundation
          </h1>
          <p className="mt-2 text-text-secondary">
            This sandbox requires JavaScript and a WebGL2- or WebGPU-capable
            browser. A static poster is shown when neither is available.
          </p>
        </div>
      </noscript>
      <SandboxRenderHarness />
    </main>
  );
}
