import { SpaceCanvas, WebGLErrorBoundary } from "@/components/3d";
import { StarFallback } from "@/components/fallbacks/StarFallback";
import { AboutSection } from "@/components/sections/AboutSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CTFSection } from "@/components/sections/CTFSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import profile from "@/content/data/profile.json";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.name,
      url: SITE_URL,
      email: `mailto:${profile.email}`,
      jobTitle: profile.role,
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.identity.location,
        addressCountry: "IN",
      },
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: profile.identity.affiliation,
      },
      sameAs: [
        profile.social.github,
        profile.social.linkedin,
        profile.social.website,
      ],
      knowsAbout: [
        "Cybersecurity",
        "Capture the Flag competitions",
        "Web exploitation",
        "OSINT",
        "Digital forensics",
        "Linux infrastructure",
      ],
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile`,
      url: absoluteUrl("/"),
      name: "Archive of the Shattered Star",
      description: SITE_DESCRIPTION,
      mainEntity: {
        "@id": `${SITE_URL}/#person`,
      },
    },
  ],
};

const structuredDataJson = JSON.stringify(structuredData).replace(
  /</g,
  "\\u003c",
);

export default function Home() {
  return (
    <main className="relative bg-void overflow-hidden">
      <script
        type="application/ld+json"
        // JSON-LD is static/profile data and sanitized by escaping "<".
        // biome-ignore lint/security/noDangerouslySetInnerHtml: required by Next JSON-LD guidance
        dangerouslySetInnerHTML={{ __html: structuredDataJson }}
      />
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
        <div className="pointer-events-none relative z-10 px-6 text-center">
          {/* Name */}
          <h1 className="font-[family-name:var(--font-orbitron)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-text-primary glow-green mb-4">
            PRANEESH R V
          </h1>

          {/* Tagline */}
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-cherenkov text-sm sm:text-base md:text-lg tracking-widest mb-8">
            <span className="text-text-secondary">
              archive@shattered-star:~$
            </span>{" "}
            <span className="text-cherenkov">scan operator-record</span>
          </p>

          {/* Role */}
          <p className="font-[family-name:var(--font-dm-sans)] text-text-secondary text-lg sm:text-xl md:text-2xl mb-12">
            Cybersecurity Student · CTF Player · Builder · Recovered System
            Operator
          </p>

          {/* CTA Buttons */}
          <div className="pointer-events-auto flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#about"
              className="glass-terminal px-8 py-3 font-[family-name:var(--font-jetbrains-mono)] text-green text-sm uppercase tracking-widest
              hover:box-glow-green transition-all duration-[var(--duration-normal)] hover:scale-105
              focus-visible:outline-2 focus-visible:outline-green focus-visible:outline-offset-2"
            >
              Recover archive
            </a>
            <a
              href="/resume"
              className="glass-panel px-8 py-3 font-[family-name:var(--font-jetbrains-mono)] text-purple-hot text-sm uppercase tracking-widest
              hover:box-glow-purple transition-all duration-[var(--duration-normal)] hover:scale-105
              focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-2"
            >
              view dossier
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

      <div className="relative z-10 bg-[linear-gradient(180deg,rgba(3,4,6,0)_0%,#030406_7rem,#030406_100%)]">
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <CertificationsSection />
        <CTFSection />
        <BlogPreviewSection />
        <ContactSection />
      </div>
    </main>
  );
}
