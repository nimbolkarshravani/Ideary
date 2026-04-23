"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

interface TagChipProps {
  label: string;
}

export default function TagChip({ label }: TagChipProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const charWidth = 8.5;
  const padding = 24;
  const width = Math.max(70, label.length * charWidth + padding * 2);
  const height = 32;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);

    const rect = rc.rectangle(3, 3, width - 6, height - 6, {
      fill: "#FAF8F3",
      fillStyle: "solid",
      stroke: "#1E2A3A",
      strokeWidth: 1.2,
      roughness: 2.2,
      bowing: 0.5,
    });

    svg.appendChild(rect);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", String(width / 2));
    text.setAttribute("y", String(height / 2 + 1));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "#1E2A3A");
    text.setAttribute("font-family", "var(--font-patrick)");
    text.setAttribute("font-size", "12");
    text.textContent = label;
    svg.appendChild(text);
  }, [label, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      aria-label={label}
      style={{ display: "inline-block" }}
    />
  );
}
