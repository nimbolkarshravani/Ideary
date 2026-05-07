"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import Link from "next/link";

const INK = "#8B2447";

export default function CTAButton({ href, children }: { href: string; children: React.ReactNode }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);

  const W = 240;
  const H = 56;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    svg.appendChild(
      rc.rectangle(4, 4, W - 8, H - 8, {
        stroke: INK,
        strokeWidth: 2,
        roughness: 2,
        fill: hovered ? "#FFD9E5" : "#FFFAF8",
        fillStyle: "solid",
        bowing: 0.8,
      })
    );
  }, [hovered]);

  return (
    <Link
      href={href}
      style={{ display: "inline-block", position: "relative", textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg ref={svgRef} width={W} height={H} aria-hidden="true" style={{ display: "block" }} />
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-caveat)",
          fontSize: "22px",
          fontWeight: 700,
          color: INK,
          pointerEvents: "none",
        }}
      >
        {children}
      </span>
    </Link>
  );
}
