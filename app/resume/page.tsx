import type { Metadata } from "next";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume for Praneesh R V, cybersecurity student, CTF player, and builder.",
  alternates: {
    canonical: "/resume",
  },
  openGraph: {
    title: "Resume | Praneesh R V",
    description: SITE_DESCRIPTION,
    url: "/resume",
  },
};

export default function ResumePage() {
  return (
    <main className="min-h-dvh bg-void px-4 py-24 text-text-primary sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="glass-terminal scanlines relative overflow-hidden p-5 sm:p-6">
          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-widest text-text-secondary">
                archive@shattered-star:/resume$ cat praneesh_r_v.pdf
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-bold tracking-wider text-green glow-green sm:text-4xl">
                RESUME ACCESS NODE
              </h1>
              <p className="mt-3 max-w-2xl font-[family-name:var(--font-dm-sans)] text-sm leading-6 text-text-secondary sm:text-base">
                Live document preview with a direct static asset fallback.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/"
                className="glass-panel px-5 py-3 text-center font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-widest text-purple-hot transition-all duration-[var(--duration-normal)] hover:box-glow-purple focus-visible:outline-2 focus-visible:outline-green focus-visible:outline-offset-2"
              >
                return home
              </a>
              <a
                href="/resume.pdf"
                className="glass-terminal px-5 py-3 text-center font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-widest text-green transition-all duration-[var(--duration-normal)] hover:box-glow-green focus-visible:outline-2 focus-visible:outline-green focus-visible:outline-offset-2"
              >
                open pdf
              </a>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="glass-panel h-fit p-5">
            <div className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-widest text-blue-hot">
              transmission
            </div>
            <dl className="mt-5 space-y-4 font-[family-name:var(--font-jetbrains-mono)] text-sm">
              <div>
                <dt className="text-text-dim">asset</dt>
                <dd className="mt-1 break-all text-text-primary">
                  /resume.pdf
                </dd>
              </div>
              <div>
                <dt className="text-text-dim">format</dt>
                <dd className="mt-1 text-text-primary">application/pdf</dd>
              </div>
              <div>
                <dt className="text-text-dim">status</dt>
                <dd className="mt-1 text-green">online</dd>
              </div>
            </dl>
          </aside>

          <div className="glass-terminal overflow-hidden">
            <div className="flex items-center justify-between border-b border-green/20 px-4 py-3 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-widest text-text-secondary">
              <span>viewer.session</span>
              <span className="text-green">200 OK</span>
            </div>
            <iframe
              src="/resume.pdf#toolbar=1&navpanes=0"
              title="Praneesh R V resume PDF"
              className="h-[72dvh] w-full border-0 bg-surface"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
