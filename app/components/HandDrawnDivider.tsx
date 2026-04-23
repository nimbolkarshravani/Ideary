"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

interface HandDrawnDividerProps {
  className?: string;
}

export default function HandDrawnDivider({ className = "" }: HandDrawnDividerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const width = svg.clientWidth || 600;

    const line = rc.line(8, 10, width - 8, 10, {
      stroke: "#1E2A3A",
      strokeWidth: 1.5,
      roughness: 1.8,
      bowing: 0.8,
    });

    svg.appendChild(line);
  }, []);

  return (
    <svg
      ref={svgRef}
      className={`w-full ${className}`}
      style={{ height: 20, display: "block" }}
      aria-hidden="true"
    />
  );
}
