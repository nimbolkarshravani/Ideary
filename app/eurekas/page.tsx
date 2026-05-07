import HandDrawnDivider from "@/app/components/HandDrawnDivider";
import EurekaCard from "@/app/components/EurekaCard";
import FloatingCapture from "@/app/components/FloatingCapture";
import HeartDoodle from "@/app/components/home/HeartDoodle";
import PinkLightbulb from "@/app/components/PinkLightbulb";
import PencilIllustration from "@/app/components/PencilIllustration";

const INK = "#8B2447";
const BODY = "#3D2530";

const EUREKAS = [
  {
    title: "AI Video Tutor",
    oneLiner: "On-demand video teaching with pause-and-ask interactivity",
    status: "PARKED" as const,
    tags: ["EdTech", "Consumer", "AI-Agents"],
    date: "Apr 24, 2026",
    href: "/eureka/demo",
    rotate: -1.2,
  },
  {
    title: "Shield / Shegram",
    oneLiner:
      "A verified women-only community app for female creators to document harassment and build solidarity",
    status: "DEAD" as const,
    tags: ["Consumer", "Social", "Women-Safety"],
    date: "Apr 3, 2025",
    href: "/eureka/shield-demo",
    rotate: 1.5,
  },
];

function StatPip({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: color,
        marginRight: 4,
        verticalAlign: "middle",
        boxShadow: `0 0 0 1.5px ${color}55`,
      }}
    />
  );
}

function Stat({ count, label, pip }: { count: number; label: string; pip: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-patrick)",
        fontSize: "14px",
        color: BODY,
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      <StatPip color={pip} />
      <span style={{ fontFamily: "var(--font-caveat)", fontSize: "20px", fontWeight: 700, color: INK }}>
        {count}
      </span>
      {label}
    </span>
  );
}

function FilterChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-patrick)",
        fontSize: "14px",
        color: active ? INK : BODY,
        backgroundColor: active ? "#FFD9E5" : "transparent",
        padding: "3px 12px",
        borderRadius: 20,
        border: `1.5px solid ${active ? INK : "rgba(139,36,71,0.2)"}`,
        opacity: active ? 1 : 0.6,
        cursor: "default",
        userSelect: "none" as const,
      }}
    >
      {label}
    </span>
  );
}

export default function EurekasPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  return (
    <EurekasContent searchParams={searchParams} />
  );
}

async function EurekasContent({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const params = await searchParams;
  const isEmpty = params.empty === "true";

  return (
    <div
      className="ruled-lines"
      style={{ minHeight: "100vh", padding: "48px 32px 120px" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <PinkLightbulb size={44} />
          <div>
            <h1
              style={{
                fontFamily: "var(--font-caveat)",
                fontSize: "52px",
                fontWeight: 700,
                color: INK,
                margin: "0 0 4px 0",
                lineHeight: 1,
              }}
            >
              your Eurekas
            </h1>
            <p style={{ fontFamily: "var(--font-patrick)", fontSize: "16px", color: BODY, margin: 0, opacity: 0.6 }}>
              every idea you&apos;ve thought through, in one place
            </p>
          </div>
        </div>

        <HandDrawnDivider className="my-6" />

        {!isEmpty && (
          <>
            {/* Stats strip */}
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center", margin: "20px 0 24px" }}>
              <Stat count={2} label="captured" pip="#8B2447" />
              <Stat count={1} label="parked" pip="#F5C518" />
              <Stat count={1} label="dead" pip="#E57373" />
              <Stat count={0} label="active" pip="#66BB6A" />
            </div>

            {/* Filter chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
              <FilterChip label="all" active />
              <FilterChip label="active" />
              <FilterChip label="parked" />
              <FilterChip label="dead" />
            </div>

            {/* Cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 32 }}>
              {EUREKAS.map((e) => (
                <EurekaCard key={e.href} {...e} />
              ))}
            </div>
          </>
        )}

        {isEmpty && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 80, paddingBottom: 80 }}>
            <PencilIllustration />
          </div>
        )}

        {/* Footer */}
        <footer style={{ textAlign: "center", borderTop: "1px dashed rgba(139,36,71,0.12)", paddingTop: 24, marginTop: 72 }}>
          <p style={{ fontFamily: "var(--font-gloria)", fontSize: "12px", color: BODY, opacity: 0.45, margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            built in public · @nimbolkarshravani · source on{" "}
            <a href="https://github.com/nimbolkarshravani/Ideary" style={{ color: INK, opacity: 0.8 }} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <HeartDoodle />
          </p>
        </footer>
      </div>

      <FloatingCapture />
    </div>
  );
}
