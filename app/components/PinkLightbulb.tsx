"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

export default function PinkLightbulb({ size = 40 }: { size?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const s = size / 44;
    const o = { stroke: "#8B2447", strokeWidth: 1.6, roughness: 2, bowing: 1 };

    svg.appendChild(rc.arc(22 * s, 20 * s, 28 * s, 28 * s, Math.PI, 2 * Math.PI, false, {
      ...o, fill: "#FFD9E5", fillStyle: "solid",
    }));
    svg.appendChild(rc.line(8 * s, 20 * s, 10 * s, 32 * s, o));
    svg.appendChild(rc.line(36 * s, 20 * s, 34 * s, 32 * s, o));
    svg.appendChild(rc.line(10 * s, 32 * s, 34 * s, 32 * s, o));
    svg.appendChild(rc.line(11 * s, 36 * s, 33 * s, 36 * s, o));
    svg.appendChild(rc.line(13 * s, 40 * s, 31 * s, 40 * s, o));
    svg.appendChild(rc.line(18 * s, 28 * s, 22 * s, 22 * s, { ...o, strokeWidth: 1 }));
    svg.appendChild(rc.line(22 * s, 22 * s, 26 * s, 28 * s, { ...o, strokeWidth: 1 }));
  }, [size]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size * 1.1}
      style={{ transform: "rotate(-8deg)", display: "block", flexShrink: 0 }}
      aria-hidden="true"
    />
  );
}
