import { ImageResponse } from "next/og";

export const alt =
  "Praneesh R V — cybersecurity researcher (AI red teaming, VAPT, CTF)";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-between",
        background: "#0a0a0c",
        color: "#e6eef5",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 71% 46%, rgba(255,236,224,0.92) 0 1.8%, rgba(255,122,69,0.45) 2.4%, rgba(255,122,69,0.22) 8%, transparent 24%), radial-gradient(circle at 28% 22%, rgba(255,122,69,0.16), transparent 24%), radial-gradient(circle at 18% 78%, rgba(178,83,47,0.22), transparent 28%), linear-gradient(135deg, #0a0a0c 0%, #14100d 48%, #1a1512 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 104,
          top: 106,
          width: 370,
          height: 370,
          borderRadius: "50%",
          border: "7px solid rgba(178,83,47,0.72)",
          transform: "rotate(-18deg)",
          boxShadow:
            "0 0 42px rgba(178,83,47,0.34), inset 0 0 30px rgba(255,122,69,0.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 28,
          width: 520,
          height: 520,
          borderRadius: "50%",
          border: "2px solid rgba(199,208,216,0.16)",
          transform: "rotate(22deg)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: 780,
          padding: "70px 0 70px 78px",
        }}
      >
        <div
          style={{
            color: "#ff7a45",
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          cybersecurity researcher
        </div>
        <div
          style={{
            fontSize: 82,
            lineHeight: 0.94,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          Praneesh R V
        </div>
        <div
          style={{
            marginTop: 28,
            color: "#c7d0d8",
            fontSize: 34,
            lineHeight: 1.25,
            maxWidth: 690,
          }}
        >
          Agentic AI red teaming, VAPT tooling, Azure security workflows, and
          CTF infrastructure.
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            marginTop: 40,
            color: "#ff7a45",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span>OSINT</span>
          <span>/</span>
          <span>AI Security</span>
          <span>/</span>
          <span>VAPT</span>
        </div>
      </div>
    </div>,
    size,
  );
}
