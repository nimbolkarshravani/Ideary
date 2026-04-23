"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

export default function BulletArrow() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const opts = { stroke: "#1E2A3A", strokeWidth: 1.4, roughness: 1.5 };

    svg.appendChild(rc.line(2, 12, 14, 4, opts));
    svg.appendChild(rc.line(14, 4, 9, 4, opts));
    svg.appendChild(rc.line(14, 4, 14, 9, opts));
  }, []);

  return (
    <svg
      ref={svgRef}
      width={18}
      height={16}
      style={{ display: "inline-block", flexShrink: 0, marginTop: 2 }}
      aria-hidden="true"
    />
  );
}
