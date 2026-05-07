"use client";

export default function PencilIllustration() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        fill="none"
        aria-hidden="true"
      >
        {/* Pencil body */}
        <rect x="20" y="50" width="120" height="18" rx="2" fill="#FFD9E5" stroke="#8B2447" strokeWidth="1.5" />
        {/* Pencil tip */}
        <polygon points="140,50 140,68 158,59" fill="#FDFAF8" stroke="#8B2447" strokeWidth="1.5" />
        {/* Pencil tip graphite */}
        <polygon points="152,54 152,64 158,59" fill="#3D2530" />
        {/* Eraser end */}
        <rect x="14" y="50" width="8" height="18" rx="1" fill="#FF6B9D" stroke="#8B2447" strokeWidth="1.2" />
        {/* Pencil stripe */}
        <line x1="130" y1="50" x2="130" y2="68" stroke="#8B2447" strokeWidth="1" opacity="0.4" />
        {/* Animated line being drawn */}
        <path
          d="M 158 59 Q 170 45 185 59"
          stroke="#8B2447"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="40"
          strokeDashoffset="40"
          style={{ animation: "draw-line 1.2s ease forwards 0.3s" }}
        />
      </svg>

      <p
        style={{
          fontFamily: "var(--font-gloria)",
          fontSize: "18px",
          color: "#8B2447",
          margin: 0,
          textAlign: "center",
        }}
      >
        your first Eureka moment is waiting...
      </p>
      <p
        style={{
          fontFamily: "var(--font-patrick)",
          fontSize: "15px",
          color: "#3D2530",
          opacity: 0.6,
          margin: 0,
          textAlign: "center",
        }}
      >
        capture an idea to begin
      </p>
    </div>
  );
}
