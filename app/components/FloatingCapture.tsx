"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

const SIZE = 56;
const INK = "#FF6B9D";

export default function FloatingCapture() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    svg.appendChild(
      rc.circle(SIZE / 2, SIZE / 2, SIZE - 8, {
        fill: INK,
        fillStyle: "solid",
        stroke: "#c0005a",
        strokeWidth: 1.5,
        roughness: 2,
      })
    );
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="capture a new Eureka"
    >
      {hovered && (
        <span
          style={{
            fontFamily: "var(--font-gloria)",
            fontSize: "13px",
            color: INK,
            backgroundColor: "#fff",
            padding: "4px 10px",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            whiteSpace: "nowrap",
            animation: "fadeIn 0.15s ease",
          }}
        >
          capture a new Eureka
        </span>
      )}
      <div
        style={{
          transform: hovered ? "rotate(8deg) scale(1.08)" : "rotate(0deg) scale(1)",
          transition: "transform 0.2s ease",
          position: "relative",
          width: SIZE,
          height: SIZE,
        }}
      >
        <svg
          ref={svgRef}
          width={SIZE}
          height={SIZE}
          aria-hidden="true"
          style={{ display: "block" }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-caveat)",
            fontSize: "28px",
            fontWeight: 700,
            color: "#fff",
            pointerEvents: "none",
          }}
        >
          +
        </span>
      </div>
    </div>
  );
}
