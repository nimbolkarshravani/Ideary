import LightbulbIcon from "./LightbulbIcon";
import StatusBadge from "./StatusBadge";
import HandDrawnDivider from "./HandDrawnDivider";
import MarginaliaQuote from "./MarginaliaQuote";
import TagChip from "./TagChip";
import BulletArrow from "./BulletArrow";
import BulletX from "./BulletX";

interface EurekaPageProps {
  title: string;
  oneLiner: string;
  status: string;
  pros: string[];
  cons: string[];
  questions: string[];
  quotes: { text: string; highlight: "yellow" | "pink" | "green"; rotate: number; marginTop: number }[];
  verdict: string;
  revisitIf: string;
  tags: string[];
  capturedDate: string;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-caveat)",
        fontSize: "20px",
        fontWeight: 700,
        color: "#1E2A3A",
        margin: "0 0 4px 0",
        textDecoration: "underline",
        textDecorationStyle: "wavy",
        textDecorationColor: "rgba(30,42,58,0.3)",
        textUnderlineOffset: "4px",
      }}
    >
      {children}
    </h2>
  );
}

function BulletItem({
  type,
  children,
}: {
  type: "arrow" | "x" | "question";
  children: string;
}) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
      {type === "arrow" && <BulletArrow />}
      {type === "x" && <BulletX />}
      {type === "question" && (
        <span
          style={{
            fontFamily: "var(--font-gloria)",
            fontSize: "15px",
            color: "#1E2A3A",
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          ?
        </span>
      )}
      <span style={{ fontFamily: "var(--font-patrick)", fontSize: "15px", lineHeight: "1.6", color: "#1E2A3A" }}>
        {children}
      </span>
    </li>
  );
}

export default function EurekaPage({
  title,
  oneLiner,
  status,
  pros,
  cons,
  questions,
  quotes,
  verdict,
  revisitIf,
  tags,
  capturedDate,
}: EurekaPageProps) {
  return (
    <div
      className="dot-grid"
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF8F3",
        padding: "48px 40px 64px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Hero */}
        <div style={{ position: "relative", marginBottom: 8 }}>
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <LightbulbIcon />
          </div>
          <div style={{ position: "absolute", top: 4, right: 0 }}>
            <StatusBadge label={status} />
          </div>

          <div style={{ textAlign: "center", paddingTop: 8, paddingBottom: 24 }}>
            <h1
              style={{
                fontFamily: "var(--font-caveat)",
                fontSize: "52px",
                fontWeight: 700,
                color: "#1E2A3A",
                margin: "0 0 8px 0",
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-patrick)",
                fontSize: "17px",
                color: "#3a4f6b",
                margin: 0,
              }}
            >
              {oneLiner}
            </p>
          </div>
        </div>

        <HandDrawnDivider className="mb-8" />

        {/* Two-column body */}
        <div style={{ display: "flex", gap: 40, marginTop: 32, alignItems: "flex-start" }}>

          {/* Left column — 60% */}
          <div style={{ flex: "0 0 58%", display: "flex", flexDirection: "column", gap: 32 }}>

            {/* Why it could work */}
            <section>
              <SectionHeader>WHY IT COULD WORK</SectionHeader>
              <ul style={{ listStyle: "none", margin: "12px 0 0 0", padding: 0 }}>
                {pros.map((item, i) => (
                  <BulletItem key={i} type="arrow">{item}</BulletItem>
                ))}
              </ul>
            </section>

            {/* Why it might not */}
            <section>
              <SectionHeader>WHY IT MIGHT NOT</SectionHeader>
              <ul style={{ listStyle: "none", margin: "12px 0 0 0", padding: 0 }}>
                {cons.map((item, i) => (
                  <BulletItem key={i} type="x">{item}</BulletItem>
                ))}
              </ul>
            </section>

            {/* Open questions */}
            <section>
              <SectionHeader>OPEN QUESTIONS</SectionHeader>
              <ul style={{ listStyle: "none", margin: "12px 0 0 0", padding: 0 }}>
                {questions.map((item, i) => (
                  <BulletItem key={i} type="question">{item}</BulletItem>
                ))}
              </ul>
            </section>
          </div>

          {/* Right column — 40% marginalia */}
          <div style={{ flex: "0 0 38%", display: "flex", flexDirection: "column", gap: 20 }}>
            {quotes.map((q, i) => (
              <MarginaliaQuote
                key={i}
                highlight={q.highlight}
                rotate={q.rotate}
                marginTop={q.marginTop}
              >
                {q.text}
              </MarginaliaQuote>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 48 }}>
          <HandDrawnDivider className="mb-8" />

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <SectionHeader>VERDICT:</SectionHeader>
              <p style={{ fontFamily: "var(--font-patrick)", fontSize: "15px", color: "#1E2A3A", margin: "8px 0 0 0", lineHeight: 1.6 }}>
                {verdict}
              </p>
            </div>
            <div>
              <SectionHeader>REVISIT IF:</SectionHeader>
              <p style={{ fontFamily: "var(--font-patrick)", fontSize: "15px", color: "#1E2A3A", margin: "8px 0 0 0", lineHeight: 1.6 }}>
                {revisitIf}
              </p>
            </div>
          </div>

          {/* Tags + date */}
          <div style={{ marginTop: 32, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {tags.map((tag) => (
                <TagChip key={tag} label={tag} />
              ))}
            </div>
            <span
              style={{
                fontFamily: "var(--font-patrick)",
                fontSize: "12px",
                color: "#3a4f6b",
                opacity: 0.7,
                whiteSpace: "nowrap",
              }}
            >
              first captured {capturedDate}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
