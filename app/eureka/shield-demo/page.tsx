import StatusBadge from "@/app/components/StatusBadge";
import HandDrawnDivider from "@/app/components/HandDrawnDivider";
import TagChip from "@/app/components/TagChip";
import BulletArrow from "@/app/components/BulletArrow";
import BulletX from "@/app/components/BulletX";

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

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-patrick)",
        fontSize: "15px",
        lineHeight: "1.7",
        color: "#1E2A3A",
        margin: "10px 0 0 0",
      }}
    >
      {children}
    </p>
  );
}

function BulletItem({
  type,
  children,
}: {
  type: "arrow" | "x" | "dot";
  children: React.ReactNode;
}) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
      {type === "arrow" && <BulletArrow />}
      {type === "x" && <BulletX />}
      {type === "dot" && (
        <span
          style={{
            fontFamily: "var(--font-patrick)",
            fontSize: "15px",
            color: "#1E2A3A",
            flexShrink: 0,
            marginTop: 1,
            lineHeight: 1.6,
          }}
        >
          —
        </span>
      )}
      <span
        style={{
          fontFamily: "var(--font-patrick)",
          fontSize: "15px",
          lineHeight: "1.7",
          color: "#1E2A3A",
        }}
      >
        {children}
      </span>
    </li>
  );
}

function KeyInsight({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "#FEF3A7",
        padding: "14px 18px",
        borderRadius: 2,
        margin: "0",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-patrick)",
          fontSize: "16px",
          lineHeight: "1.75",
          color: "#1E2A3A",
          margin: 0,
          fontStyle: "italic",
        }}
      >
        {children}
      </p>
    </div>
  );
}

function ScaleRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        borderBottom: "1px dashed rgba(30,42,58,0.15)",
        paddingBottom: 8,
        marginBottom: 8,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-patrick)",
          fontSize: "13px",
          color: "#3a4f6b",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-caveat)",
          fontSize: "16px",
          fontWeight: 700,
          color: "#1E2A3A",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function ShieldDemoPage() {
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
          <div style={{ position: "absolute", top: 4, right: 0 }}>
            <StatusBadge label="DEAD" color="red" />
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
              Shield / Shegram
            </h1>
            <p
              style={{
                fontFamily: "var(--font-patrick)",
                fontSize: "17px",
                color: "#3a4f6b",
                margin: 0,
                maxWidth: 600,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              A verified, women-only community app where female creators document harassment, coordinate witnesses, and build solidarity — with ambitions of expanding into a safer Instagram alternative.
            </p>
          </div>
        </div>

        <HandDrawnDivider className="mb-8" />

        {/* Two-column body */}
        <div style={{ display: "flex", gap: 40, marginTop: 32, alignItems: "flex-start" }}>

          {/* Left column */}
          <div style={{ flex: "0 0 58%", display: "flex", flexDirection: "column", gap: 28 }}>

            <section>
              <SectionHeader>SPARK</SectionHeader>
              <BodyText>
                Female creators generate massive value on Instagram — 77% of influencers are women, driving billions in revenue — while being systematically failed by the platform&apos;s safety mechanisms. The idea was to build the safety infrastructure Instagram refuses to provide.
              </BodyText>
            </section>

            <section>
              <SectionHeader>CASE FOR</SectionHeader>
              <ul style={{ listStyle: "none", margin: "12px 0 0 0", padding: 0 }}>
                <BulletItem type="arrow">
                  The problem is real and quantifiable: Instagram failed to act on 90–93% of abuse reports from women. 38% of women globally have experienced online violence.
                </BulletItem>
                <BulletItem type="arrow">
                  No direct competitor exists with the specific combination of verified creators, witness system, and coordinated reporting. Peanut exists for women but not specifically for creators or harassment.
                </BulletItem>
                <BulletItem type="arrow">
                  India market is underserved: 67.2% male Instagram userbase means Indian female creators face disproportionate harassment in the largest Instagram market globally.
                </BulletItem>
                <BulletItem type="arrow">
                  The permission architecture (verified creators post, supporters comment, witness separated from support) resolves real legal and social tensions.
                </BulletItem>
              </ul>
            </section>

            <section>
              <SectionHeader>CASE AGAINST</SectionHeader>
              <ul style={{ listStyle: "none", margin: "12px 0 0 0", padding: 0 }}>
                <BulletItem type="x">
                  Legal liability is fatal for a solo founder. Coordinating mass reports against named individuals exposes the platform to defamation suits — the reported party sues you, not Instagram.
                </BulletItem>
                <BulletItem type="x">
                  Report-bombing risk: the exact feature meant to protect women can be weaponized. Trolls join as fake supporters, mass-report innocent people, platform becomes a harassment tool.
                </BulletItem>
                <BulletItem type="x">
                  Harassment database paradox: a public feed of female creators&apos; experiences becomes a goldmine for coordinated harassment groups to find and target the same women.
                </BulletItem>
                <BulletItem type="x">
                  Moderation at scale is brutally expensive and causes severe secondary trauma. Cannot be run on volunteers sustainably.
                </BulletItem>
                <BulletItem type="x">
                  No viable revenue model. Ads incompatible with trauma content. Subscriptions create barriers for those who need it most.
                </BulletItem>
              </ul>
            </section>

            <section>
              <SectionHeader>KEY INSIGHT</SectionHeader>
              <div style={{ marginTop: 12 }}>
                <KeyInsight>
                  The harassment problem was the emotional core of the idea, but the community was always the actual product. A safety-focused platform hits legal minefields; a community-focused platform for female creators doesn&apos;t.
                </KeyInsight>
              </div>
            </section>

            <section>
              <SectionHeader>VERDICT</SectionHeader>
              <BodyText>
                Abandoned — legal risk isn&apos;t worth it for a solo founder without legal counsel and significant capital.
              </BodyText>
            </section>

            <section>
              <SectionHeader>REVISIT IF</SectionHeader>
              <ul style={{ listStyle: "none", margin: "12px 0 0 0", padding: 0 }}>
                <BulletItem type="dot">Access to a cyber law attorney on retainer</BulletItem>
                <BulletItem type="dot">₹50L+ in funding or grant money for moderation and legal infrastructure</BulletItem>
                <BulletItem type="dot">Scope shifts to pure community (no harassment documentation, no coordinated reporting)</BulletItem>
              </ul>
            </section>
          </div>

          {/* Right column */}
          <div style={{ flex: "0 0 38%", display: "flex", flexDirection: "column", gap: 32 }}>

            <section>
              <SectionHeader>WHAT YOU&apos;D NEED</SectionHeader>
              <ul style={{ listStyle: "none", margin: "12px 0 0 0", padding: 0 }}>
                <BulletItem type="dot">Legal counsel (cyber law, India-specific) before writing any code</BulletItem>
                <BulletItem type="dot">50+ verified female creators committed pre-launch</BulletItem>
                <BulletItem type="dot">Grant funding from orgs like UN Women or Equality Now</BulletItem>
                <BulletItem type="dot">Full-time paid, trained moderation team with mental health support</BulletItem>
                <BulletItem type="dot">Alternative: lightweight community-only version sidesteps most of this</BulletItem>
              </ul>
            </section>

            <section>
              <SectionHeader>AT A GLANCE</SectionHeader>
              <div style={{ marginTop: 14 }}>
                <ScaleRow label="Capital" value="Massive" />
                <ScaleRow label="Time to build" value="Year+" />
                <ScaleRow label="Fit for you" value="Weak" />
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 48 }}>
          <HandDrawnDivider className="mb-8" />
          <div style={{ marginTop: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {["Consumer", "Social", "Women-Safety", "India", "High-Risk"].map((tag) => (
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
              captured Apr 3, 2025
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
