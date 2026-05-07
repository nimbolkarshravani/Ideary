"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

const INK = "#8B2447";

function RoughStar() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const cx = 10, cy = 10, r = 7;
    const pts: [number, number][] = [];
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const innerAngle = outerAngle + (2 * Math.PI) / 10;
      pts.push([cx + r * Math.cos(outerAngle), cy + r * Math.sin(outerAngle)]);
      pts.push([cx + (r * 0.45) * Math.cos(innerAngle), cy + (r * 0.45) * Math.sin(innerAngle)]);
    }
    pts.push(pts[0]);

    svg.appendChild(
      rc.polygon(pts, {
        stroke: INK,
        fill: "#FFD9E5",
        fillStyle: "solid",
        strokeWidth: 1.2,
        roughness: 2,
      })
    );
  }, []);

  return <svg ref={svgRef} width={20} height={20} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />;
}

export default function StarBullet({ children, hotPink }: { children: React.ReactNode; hotPink?: boolean }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
      <RoughStar />
      <span
        style={{
          fontFamily: "var(--font-patrick)",
          fontSize: "17px",
          lineHeight: "1.6",
          color: hotPink ? "#8B2447" : "#3D2530",
          fontWeight: hotPink ? 600 : 400,
        }}
      >
        {children}
      </span>
    </li>
  );
}
