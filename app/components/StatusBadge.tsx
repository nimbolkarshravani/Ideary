"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

const fillColors = {
  yellow: "#FEF3A7",
  red: "#FFCDD2",
};

interface StatusBadgeProps {
  label: string;
  color?: "yellow" | "red";
}

export default function StatusBadge({ label, color = "yellow" }: StatusBadgeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);

    const circle = rc.ellipse(52, 24, 96, 40, {
      fill: fillColors[color],
      fillStyle: "solid",
      stroke: "#1E2A3A",
      strokeWidth: 1.5,
      roughness: 2,
      bowing: 1,
    });

    svg.appendChild(circle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "52");
    text.setAttribute("y", "29");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "#1E2A3A");
    text.setAttribute("font-family", "var(--font-caveat)");
    text.setAttribute("font-size", "13");
    text.setAttribute("font-weight", "700");
    text.setAttribute("letter-spacing", "1.5");
    text.textContent = label;
    svg.appendChild(text);
  }, [label, color]);

  return (
    <svg
      ref={svgRef}
      width={104}
      height={48}
      aria-label={label}
    />
  );
}
