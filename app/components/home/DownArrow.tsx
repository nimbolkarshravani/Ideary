"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

const INK = "#8B2447";

export default function DownArrow() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const opts = { stroke: INK, strokeWidth: 1.8, roughness: 1.8, bowing: 1 };

    // Curving line down
    svg.appendChild(rc.curve([[10, 5], [14, 25], [10, 45], [14, 65]], opts));
    // Arrowhead
    svg.appendChild(rc.line(14, 65, 6, 52, opts));
    svg.appendChild(rc.line(14, 65, 22, 52, opts));
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "8px 0 0 0" }}>
      <svg
        ref={svgRef}
        width={30}
        height={72}
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily: "var(--font-gloria)",
          fontSize: "14px",
          color: INK,
          transform: "rotate(-2deg)",
          display: "inline-block",
          marginTop: 20,
        }}
      >
        let me explain
      </span>
    </div>
  );
}
