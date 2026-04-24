import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Signal Lost",
};

export default function NotFound() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-dvh bg-void text-center px-6">
      {/* Terminal-style 404 */}
      <div className="glass-terminal p-8 sm:p-12 max-w-lg w-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red" />
          <div className="w-3 h-3 rounded-full bg-orange" />
          <div className="w-3 h-3 rounded-full bg-green" />
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-text-dim text-xs ml-2">
            cosmos-terminal
          </span>
        </div>

        <pre className="font-[family-name:var(--font-jetbrains-mono)] text-left text-sm leading-relaxed">
          <span className="text-text-secondary">root@cosmos:~$</span>{" "}
          <span className="text-green">find</span> /page{"\n"}
          <span className="text-red">Error: 404.exe — Signal Lost</span>
          {"\n\n"}
          <span className="text-text-dim">
            {">"} The page you&apos;re looking for{"\n"}
            {">"} is in another sea. 🏴‍☠️{"\n"}
          </span>
          {"\n"}
          <span className="text-text-secondary">root@cosmos:~$</span>{" "}
          <span className="text-green">cd</span> /home
          <span className="animate-pulse text-green">█</span>
        </pre>
      </div>

      {/* Home link */}
      <a
        href="/"
        className="mt-8 glass-panel px-6 py-3 font-[family-name:var(--font-jetbrains-mono)] text-green text-sm uppercase tracking-widest
          hover:box-glow-green transition-all duration-[var(--duration-normal)] hover:scale-105"
      >
        ./return_home.sh
      </a>
    </main>
  );
}
