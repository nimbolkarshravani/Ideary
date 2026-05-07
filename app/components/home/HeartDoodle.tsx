"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

export default function HeartDoodle() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);

    // Simple heart via two curves meeting at a point
    const path = "M 12,7 C 12,4 9,2 6,4 C 3,6 3,10 6,13 L 12,19 L 18,13 C 21,10 21,6 18,4 C 15,2 12,4 12,7 Z";
    svg.appendChild(
      rc.path(path, {
        stroke: "#8B2447",
        fill: "#FFD9E5",
        fillStyle: "solid",
        strokeWidth: 1.2,
        roughness: 1.8,
      })
    );
  }, []);

  return <svg ref={svgRef} width={24} height={22} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle" }} />;
}
