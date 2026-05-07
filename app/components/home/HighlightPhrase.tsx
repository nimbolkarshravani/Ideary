interface HighlightPhraseProps {
  children: React.ReactNode;
  color?: string;
}

export default function HighlightPhrase({
  children,
  color = "#FFD9E5",
}: HighlightPhraseProps) {
  return (
    <mark
      style={{
        backgroundColor: color,
        color: "inherit",
        padding: "1px 4px",
        borderRadius: 2,
        display: "inline",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
    >
      {children}
    </mark>
  );
}
