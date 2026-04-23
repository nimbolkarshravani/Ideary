"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

export default function LightbulbIcon() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const opts = { stroke: "#1E2A3A", strokeWidth: 1.6, roughness: 2, bowing: 1 };

    // Bulb dome (ellipse top)
    svg.appendChild(rc.arc(22, 20, 28, 28, Math.PI, 2 * Math.PI, false, { ...opts, fill: "#FEF3A7", fillStyle: "solid" }));

    // Bulb body sides going down
    svg.appendChild(rc.line(8, 20, 10, 32, opts));
    svg.appendChild(rc.line(36, 20, 34, 32, opts));

    // Base ridges
    svg.appendChild(rc.line(10, 32, 34, 32, opts));
    svg.appendChild(rc.line(11, 36, 33, 36, opts));
    svg.appendChild(rc.line(13, 40, 31, 40, opts));

    // Filament hint
    svg.appendChild(rc.line(18, 28, 22, 22, { ...opts, strokeWidth: 1 }));
    svg.appendChild(rc.line(22, 22, 26, 28, { ...opts, strokeWidth: 1 }));
  }, []);

  return (
    <svg
      ref={svgRef}
      width={44}
      height={48}
      style={{ transform: "rotate(-8deg)", display: "block" }}
      aria-hidden="true"
    />
  );
}
