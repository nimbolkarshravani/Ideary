"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import Link from "next/link";

const STATUS_COLORS = {
  PARKED: { fill: "#FEF3A7", stroke: "#8B2447" },
  DEAD:   { fill: "#FFCDD2", stroke: "#8B2447" },
  ACTIVE: { fill: "#D4EDDA", stroke: "#8B2447" },
};

interface EurekaCardProps {
  title: string;
  oneLiner: string;
  status: "PARKED" | "DEAD" | "ACTIVE";
  tags: string[];
  date: string;
  href: string;
  rotate?: number;
}

function MiniStatusDot({ status }: { status: "PARKED" | "DEAD" | "ACTIVE" }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const { fill, stroke } = STATUS_COLORS[status];
    svg.appendChild(rc.ellipse(16, 12, 56, 22, {
      fill,
      fillStyle: "solid",
      stroke,
      strokeWidth: 1.2,
      roughness: 2,
    }));
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "16");
    text.setAttribute("y", "16");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "#1E2A3A");
    text.setAttribute("font-family", "var(--font-caveat)");
    text.setAttribute("font-size", "9");
    text.setAttribute("font-weight", "700");
    text.setAttribute("letter-spacing", "0.8");
    text.textContent = status;
    svg.appendChild(text);
  }, [status]);

  return <svg ref={svgRef} width={32} height={24} aria-label={status} />;
}

export default function EurekaCard({
  title,
  oneLiner,
  status,
  tags,
  date,
  href,
  rotate = 0,
}: EurekaCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);

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
      svg.appendChild(
        rc.rectangle(3, 3, w - 6, h - 6, {
          stroke: "#8B2447",
          strokeWidth: 1.5,
          roughness: 2,
          fill: "#FDFAF8",
          fillStyle: "solid",
          bowing: 0.8,
        })
      );
    };

    if (document.fonts) {
      document.fonts.ready.then(draw);
    } else {
      setTimeout(draw, 100);
    }
  }, []);

  const currentRotate = hovered ? 0 : rotate;

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          transform: `rotate(${currentRotate}deg)`,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          boxShadow: hovered
            ? "4px 8px 20px rgba(139,36,71,0.12)"
            : "2px 3px 8px rgba(0,0,0,0.06)",
          borderRadius: 2,
          cursor: "pointer",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div ref={containerRef} style={{ position: "relative", minHeight: 200 }}>
          {/* Rough.js border */}
          <svg
            ref={svgRef}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
              overflow: "visible",
            }}
            aria-hidden="true"
          />

          {/* Card content */}
          <div style={{ position: "relative", zIndex: 1, padding: "20px 20px 16px" }}>
            {/* Status badge */}
            <div style={{ position: "absolute", top: 14, right: 14 }}>
              <MiniStatusDot status={status} />
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: "var(--font-caveat)",
                fontSize: "26px",
                fontWeight: 700,
                color: "#8B2447",
                margin: "0 0 6px 0",
                lineHeight: 1.2,
                paddingRight: 40,
              }}
            >
              {title}
            </h3>

            {/* One-liner */}
            <p
              style={{
                fontFamily: "var(--font-patrick)",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#3D2530",
                margin: "0 0 20px 0",
                opacity: 0.85,
              }}
            >
              {oneLiner}
            </p>

            {/* Tags + date */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: 8,
                marginTop: "auto",
              }}
            >
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-patrick)",
                      fontSize: "11px",
                      color: "#8B2447",
                      backgroundColor: "#FFE8EC",
                      padding: "2px 8px",
                      borderRadius: 20,
                      opacity: 0.9,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-gloria)",
                  fontSize: "11px",
                  color: "#3D2530",
                  opacity: 0.45,
                  whiteSpace: "nowrap",
                }}
              >
                {date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
