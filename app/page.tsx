export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-dvh bg-void overflow-hidden">
      {/* Ambient starfield dots (placeholder — replaced by R3F in M2) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

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

      {/* Twinkle keyframes */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </main>
  );
}
