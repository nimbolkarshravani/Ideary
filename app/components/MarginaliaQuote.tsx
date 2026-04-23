interface MarginaliaQuoteProps {
  children: string;
  highlight: "yellow" | "pink" | "green";
  rotate?: number;
  marginTop?: number;
}

const highlightColors = {
  yellow: "#FEF3A7",
  pink: "#FCE4EC",
  green: "#D4EDDA",
};

export default function MarginaliaQuote({
  children,
  highlight,
  rotate = 1,
  marginTop = 0,
}: MarginaliaQuoteProps) {
  return (
    <div
      style={{
        transform: `rotate(${rotate}deg)`,
        marginTop: marginTop,
        backgroundColor: highlightColors[highlight],
        borderLeft: "3px solid rgba(30,42,58,0.15)",
        padding: "14px 16px",
        borderRadius: 2,
        boxShadow: "2px 3px 8px rgba(0,0,0,0.07)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-gloria)",
          fontSize: "13px",
          lineHeight: "1.7",
          color: "#1E2A3A",
          margin: 0,
        }}
      >
        &ldquo;{children}&rdquo;
      </p>
    </div>
  );
}
