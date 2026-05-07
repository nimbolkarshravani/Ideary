"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

const INK = "#8B2447";

export default function EurekaCardHint() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);

    // Card outline
    svg.appendChild(
      rc.rectangle(4, 4, 292, 172, {
        stroke: INK,
        fill: "#FFFAF8",
        fillStyle: "solid",
        strokeWidth: 1.5,
        roughness: 1.8,
      })
    );

    // Title line
    svg.appendChild(rc.line(20, 28, 180, 28, { stroke: INK, strokeWidth: 2, roughness: 1.5 }));

    // Sub-line (shorter)
    svg.appendChild(rc.line(20, 42, 130, 42, { stroke: "#3D2530", strokeWidth: 1, roughness: 1.2 }));

    // Divider
    svg.appendChild(rc.line(20, 58, 280, 58, { stroke: INK, strokeWidth: 1, roughness: 2 }));

    // Bullet rows
    const rows = [74, 94, 114, 134, 154];
    rows.forEach((y, i) => {
      const w = [200, 160, 185, 140, 110][i];
      svg.appendChild(rc.line(30, y, 30 + w, y, { stroke: "#3D2530", strokeWidth: 0.8, roughness: 1.5 }));
      // Tiny arrow bullet
      svg.appendChild(rc.line(20, y, 26, y - 4, { stroke: INK, strokeWidth: 1, roughness: 1 }));
    });

    // Status badge hint (top right)
    svg.appendChild(
      rc.ellipse(262, 20, 42, 20, {
        stroke: INK,
        fill: "#FFD9E5",
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 2,
      })
    );
  }, []);

  return (
    <div style={{ margin: "16px auto", maxWidth: 300 }}>
      <svg
        ref={svgRef}
        width={300}
        height={180}
        aria-hidden="true"
        style={{ display: "block", transform: "rotate(-1deg)" }}
      />
      <p
        style={{
          fontFamily: "var(--font-gloria)",
          fontSize: "11px",
          color: "#8B2447",
          textAlign: "center",
          margin: "6px 0 0 0",
          opacity: 0.7,
        }}
      >
        ↑ that&apos;s a Eureka
      </p>
    </div>
  );
}
