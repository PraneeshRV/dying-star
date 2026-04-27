import { SpaceCanvas, WebGLErrorBoundary } from "@/components/3d";
import { StarFallback } from "@/components/fallbacks/StarFallback";
import { AboutSection } from "@/components/sections/AboutSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CTFSection } from "@/components/sections/CTFSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";

export default function Home() {
  return (
    <main className="relative bg-void overflow-hidden">
      <section
        id="home"
        className="relative flex flex-col items-center justify-center min-h-dvh overflow-hidden"
        aria-label="Home"
      >
        {/* 3D Space Scene */}
        <WebGLErrorBoundary fallback={<StarFallback />}>
          <SpaceCanvas />
        </WebGLErrorBoundary>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6">
          {/* Name */}
          <h1 className="font-[family-name:var(--font-orbitron)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-text-primary glow-green mb-4">
            PRANEESH R V
          </h1>

          {/* Tagline */}
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-green text-sm sm:text-base md:text-lg tracking-widest mb-8">
            <span className="text-text-secondary">root@cosmos:~$</span>{" "}
            <span className="text-green">whoami</span>
          </p>

          {/* Role */}
          <p className="font-[family-name:var(--font-dm-sans)] text-text-secondary text-lg sm:text-xl md:text-2xl mb-12">
            Cybersecurity Student · CTF Player · Arch Evangelist · Builder
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#about"
              className="glass-terminal px-8 py-3 font-[family-name:var(--font-jetbrains-mono)] text-green text-sm uppercase tracking-widest
              hover:box-glow-green transition-all duration-[var(--duration-normal)] hover:scale-105
              focus-visible:outline-2 focus-visible:outline-green focus-visible:outline-offset-2"
            >
              ./explore.sh
            </a>
            <a
              href="/resume"
              className="glass-panel px-8 py-3 font-[family-name:var(--font-jetbrains-mono)] text-purple-hot text-sm uppercase tracking-widest
              hover:box-glow-purple transition-all duration-[var(--duration-normal)] hover:scale-105
              focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2"
            >
              view resume
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-text-dim text-xs tracking-widest uppercase">
            scroll to explore
          </span>
          <div className="w-5 h-8 border border-text-dim rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-green rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-[linear-gradient(180deg,rgba(0,0,5,0)_0%,#000005_7rem,#000005_100%)]">
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <CertificationsSection />
        <CTFSection />
        <ContactSection />
      </div>
    </main>
  );
}
