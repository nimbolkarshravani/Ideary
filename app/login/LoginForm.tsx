"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

const INK = "#8B2447";
const BODY = "#3D2530";

function RoughCard({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const draw = () => {
      const container = containerRef.current;
      const svg = svgRef.current;
      if (!container || !svg) return;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const rc = rough.svg(svg);
      svg.appendChild(rc.rectangle(4, 4, w - 8, h - 8, {
        stroke: INK,
        strokeWidth: 1.5,
        roughness: 2,
        fill: "#ffffff",
        fillStyle: "solid",
        bowing: 0.6,
      }));
    };
    if (document.fonts) {
      document.fonts.ready.then(draw);
    } else {
      setTimeout(draw, 100);
    }
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <svg ref={svgRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "visible" }} aria-hidden="true" />
      <div style={{ position: "relative", zIndex: 1, padding: "40px 36px" }}>
        {children}
      </div>
    </div>
  );
}

function RoughButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const W = 220, H = 52;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    svg.appendChild(rc.rectangle(4, 4, W - 8, H - 8, {
      stroke: INK,
      strokeWidth: 2,
      roughness: 1.8,
      fill: hovered ? "#FFD9E5" : "#FFFAF8",
      fillStyle: "solid",
    }));
  }, [hovered]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", position: "relative", display: "inline-block" }}
    >
      <svg ref={svgRef} width={W} height={H} aria-hidden="true" style={{ display: "block" }} />
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-caveat)", fontSize: "21px", fontWeight: 700, color: INK, pointerEvents: "none" }}>
        {children}
      </span>
    </button>
  );
}

function HandwrittenInput({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <label style={{ fontFamily: "var(--font-gloria)", fontSize: "13px", color: INK, display: "block", marginBottom: 6, opacity: 0.8 }}>
        {label}
      </label>
      <input
        type={type}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          borderBottom: `2px solid rgba(139,36,71,0.3)`,
          outline: "none",
          fontFamily: "var(--font-patrick)",
          fontSize: "17px",
          color: BODY,
          padding: "6px 0",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.target.style.borderBottomColor = INK)}
        onBlur={(e) => (e.target.style.borderBottomColor = "rgba(139,36,71,0.3)")}
      />
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <RoughCard>
        <h1 style={{ fontFamily: "var(--font-caveat)", fontSize: "40px", fontWeight: 700, color: INK, margin: "0 0 6px 0" }}>
          welcome back
        </h1>
        <p style={{ fontFamily: "var(--font-patrick)", fontSize: "16px", color: BODY, margin: "0 0 36px 0", opacity: 0.65 }}>
          your ideas are waiting
        </p>

        <form onSubmit={(e) => { e.preventDefault(); router.push("/eurekas"); }}>
          <HandwrittenInput label="email" type="email" />
          <HandwrittenInput label="password" type="password" />
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <RoughButton>open Ideary</RoughButton>
            <Link
              href="/signup"
              style={{ fontFamily: "var(--font-patrick)", fontSize: "14px", color: BODY, opacity: 0.55, textDecoration: "none" }}
            >
              new here? start your Ideary →
            </Link>
          </div>
        </form>
      </RoughCard>
    </div>
  );
}
