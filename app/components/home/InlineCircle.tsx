"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

interface InlineCircleProps {
  children: string;
  color?: string;
  paddingX?: number;
  paddingY?: number;
}

export default function InlineCircle({
  children,
  color = "#8B2447",
  paddingX = 10,
  paddingY = 6,
}: InlineCircleProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const draw = () => {
      const textEl = textRef.current;
      const svg = svgRef.current;
      if (!textEl || !svg) return;

      const w = textEl.offsetWidth + paddingX * 2;
      const h = textEl.offsetHeight + paddingY * 2;

      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));

      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const rc = rough.svg(svg);
      svg.appendChild(
        rc.ellipse(w / 2, h / 2, w - 3, h - 3, {
          stroke: color,
          strokeWidth: 2.2,
          roughness: 2.5,
          fill: "none",
          bowing: 1.2,
        })
      );
    };

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(draw);
    } else {
      setTimeout(draw, 150);
    }
  }, [children, color, paddingX, paddingY]);

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span ref={textRef} style={{ position: "relative", zIndex: 1 }}>
        {children}
      </span>
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "visible",
        }}
        aria-hidden="true"
      />
    </span>
  );
}
