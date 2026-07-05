import { HeroScene } from "@/components/3d/HeroScene";
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
        "Agentic AI red teaming",
        "AI security",
        "VAPT",
        "Cloud IAM workflows",
        "Azure security workflows",
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
        {/* 3D backdrop — lazy/gated via HeroScene; hydrates after hero text paints (LCP target = text) */}
        <HeroScene />

        {/* Hero Content — server-rendered so it paints before the canvas hydrates */}
        <div className="pointer-events-none relative z-10 px-6 text-center">
          {/* Name */}
          <h1 className="font-grotesk text-5xl font-bold tracking-tight text-text-hi sm:text-6xl md:text-7xl lg:text-8xl">
            PRANEESH R V
          </h1>

          {/* Primary subhead — plain positioning */}
          <p className="mt-6 font-body text-lg text-text-mid sm:text-xl md:text-2xl">
            Cybersecurity researcher — AI red teaming · VAPT · CTF
          </p>

          {/* Proof line — credibility at a glance */}
          <p className="mt-3 font-mono text-xs tracking-wide text-text-mid sm:text-sm">
            Team Hunter · CTFtime #8 in India · LLM red-team research @
            TIFAC-CORE
          </p>

          {/* Themed flavor line — demoted mono accent, not the primary landing */}
          <p className="mt-4 font-mono text-xs tracking-widest text-text-low">
            <span>archive@shattered-star:~$</span>{" "}
            <span className="text-ember-dim">scan operator-record</span>
          </p>

          {/* CTAs — clear verbs: résumé primary, work secondary, contact tertiary */}
          <div className="pointer-events-auto mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="/resume"
              className="inline-flex items-center justify-center rounded-md bg-ember px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-void transition-[filter] duration-[var(--duration-normal)] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2"
            >
              View résumé
            </a>
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-md border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest text-text-hi transition-colors duration-[var(--duration-normal)] hover:border-ember hover:text-ember focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2"
            >
              See work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-2 py-3 font-mono text-xs uppercase tracking-widest text-text-mid transition-colors duration-[var(--duration-normal)] hover:text-ember focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-text-dim text-xs tracking-widest uppercase">
            scroll to explore
          </span>
          <div className="w-5 h-8 border border-text-dim rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-green rounded-full animate-scroll-bob" />
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
