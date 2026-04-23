"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

export default function BulletX() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const opts = { stroke: "#1E2A3A", strokeWidth: 1.4, roughness: 1.8 };

    svg.appendChild(rc.line(3, 3, 13, 13, opts));
    svg.appendChild(rc.line(13, 3, 3, 13, opts));
  }, []);

  return (
    <svg
      ref={svgRef}
      width={16}
      height={16}
      style={{ display: "inline-block", flexShrink: 0, marginTop: 2 }}
      aria-hidden="true"
    />
  );
}
