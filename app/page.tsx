import InlineCircle from "@/app/components/home/InlineCircle";
import HighlightPhrase from "@/app/components/home/HighlightPhrase";
import DownArrow from "@/app/components/home/DownArrow";
import StarBullet from "@/app/components/home/StarBullet";
import CTAButton from "@/app/components/home/CTAButton";
import HeartDoodle from "@/app/components/home/HeartDoodle";
import EurekaCardHint from "@/app/components/home/EurekaCardHint";

const INK = "#8B2447";
const BODY = "#3D2530";

function ChapterHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-caveat)",
        fontSize: "34px",
        fontWeight: 700,
        color: INK,
        margin: "0 0 20px 0",
        lineHeight: 1.2,
      }}
    >
      {children}
    </h2>
  );
}

function Body({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-patrick)",
        fontSize: "18px",
        lineHeight: "1.8",
        color: BODY,
        margin: "0 0 18px 0",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function Chapter({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        marginBottom: 72,
        paddingBottom: 16,
        borderBottom: "1px dashed rgba(139,36,71,0.12)",
      }}
    >
      {children}
    </section>
  );
}

export default function HomePage() {
  return (
    <div
      className="dot-grid"
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFFAF8",
        padding: "64px 24px 96px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <p
            style={{
              fontFamily: "var(--font-gloria)",
              fontSize: "15px",
              color: INK,
              margin: "0 0 4px 0",
              transform: "rotate(-1.5deg)",
              display: "inline-block",
              opacity: 0.8,
            }}
          >
            this is
          </p>
          <h1
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: "88px",
              fontWeight: 700,
              color: INK,
              margin: "0 0 16px 0",
              lineHeight: 1,
            }}
          >
            <InlineCircle color={INK} paddingX={20} paddingY={14}>
              Ideary
            </InlineCircle>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-patrick)",
              fontSize: "20px",
              color: BODY,
              margin: "0 auto",
              maxWidth: 460,
              lineHeight: 1.6,
            }}
          >
            an idea diary for people who think out loud with AI
          </p>
          <div style={{ display: "inline-block", marginTop: 8 }}>
            <DownArrow />
          </div>
        </div>

        {/* Chapter 1 — The problem */}
        <Chapter>
          <ChapterHeader>you know that feeling...</ChapterHeader>

          <Body>
            You&apos;re sitting with your phone or laptop. An idea hits. You open Claude or
            ChatGPT and start typing it out. The AI pushes back. You defend it. You sharpen
            it. You realize it&apos;s actually two ideas. Or maybe it&apos;s a bad idea but
            for interesting reasons. An hour passes. You&apos;ve thought through{" "}
            <HighlightPhrase color="#FFD9E5">
              more in that conversation than you would&apos;ve in a week of journaling
            </HighlightPhrase>
            .
          </Body>

          <Body>&ldquo;Then you close the tab.&rdquo;</Body>

          <div style={{ margin: "24px 0", textAlign: "center" }}>
            <span
              style={{
                fontFamily: "var(--font-caveat)",
                fontSize: "48px",
                fontWeight: 700,
                color: BODY,
                display: "inline-block",
              }}
            >
              And it&apos;s{" "}
              <InlineCircle color="#FF6B9D" paddingX={10} paddingY={6}>
                gone
              </InlineCircle>
              .{" "}
              <span
                style={{
                  fontFamily: "var(--font-gloria)",
                  fontSize: "28px",
                  verticalAlign: "middle",
                  opacity: 0.6,
                }}
              >
                :(
              </span>
            </span>
          </div>

          <Body>
            Tomorrow you&apos;ll vaguely remember you had an idea. You won&apos;t remember
            the sharp insight. You won&apos;t remember why you decided not to pursue it.
            You won&apos;t remember the question that almost changed your mind.
          </Body>
        </Chapter>

        {/* Chapter 2 — The realization */}
        <Chapter>
          <ChapterHeader>here&apos;s the thing</ChapterHeader>

          <Body>
            The idea isn&apos;t the valuable part.{" "}
            <HighlightPhrase color="#FFE8EC">the thinking around it is.</HighlightPhrase>{" "}
            The reasons it might work. The reasons it probably won&apos;t. The moment in
            the conversation where you realized something. The condition that would make
            you revisit it later.
          </Body>

          <p
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: "26px",
              fontWeight: 700,
              color: INK,
              borderLeft: `3px solid #FFD9E5`,
              paddingLeft: 16,
              margin: "0 0 18px 0",
              lineHeight: 1.4,
            }}
          >
            Most note-taking apps capture the idea. They lose the thinking.
          </p>
        </Chapter>

        {/* Chapter 3 — Enter Ideary */}
        <Chapter>
          <ChapterHeader>
            so I built{" "}
            <InlineCircle color={INK} paddingX={8} paddingY={4}>
              Ideary
            </InlineCircle>
          </ChapterHeader>

          <Body>
            Ideary turns your AI conversations into <strong>Eurekas</strong>. Each Eureka
            is a single page that captures one idea — and everything you thought about it.
          </Body>

          <EurekaCardHint />

          <p
            style={{
              fontFamily: "var(--font-gloria)",
              fontSize: "16px",
              lineHeight: "2",
              color: BODY,
              margin: "20px 0 0 0",
            }}
          >
            All preserved.&nbsp;&nbsp;All scannable.&nbsp;&nbsp;All in one place.
          </p>
        </Chapter>

        {/* Chapter 4 — Who it's for */}
        <Chapter>
          <ChapterHeader>this is for you if...</ChapterHeader>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <StarBullet>you brainstorm with AI more than you journal</StarBullet>
            <StarBullet>you have ten ideas a week and remember zero</StarBullet>
            <StarBullet>your best thinking happens mid-conversation</StarBullet>
            <StarBullet hotPink>
              you&apos;ve ever{" "}
              <InlineCircle color="#FF6B9D" paddingX={6} paddingY={4}>
                lost a great idea
              </InlineCircle>{" "}
              to a closed browser tab
            </StarBullet>
          </ul>
        </Chapter>

        {/* Chapter 5 — The vibe */}
        <Chapter>
          <ChapterHeader>why it looks like this</ChapterHeader>

          <Body>
            Most idea apps look like databases. Spreadsheets with rounded corners. The
            moment everything is structured, your brain shifts{" "}
            <HighlightPhrase color="#FFD9E5">from creating to sorting</HighlightPhrase>.
          </Body>

          <Body>
            Ideary looks like a notebook because that&apos;s where ideas actually live —
            in margins, sketches, half-finished thoughts. Loose enough to stay creative.
            Structured enough to find later.
          </Body>

          <p
            style={{
              fontFamily: "var(--font-gloria)",
              fontSize: "13px",
              color: INK,
              opacity: 0.6,
              transform: "rotate(-1deg)",
              display: "inline-block",
              margin: "4px 0 0 8px",
            }}
          >
            * another idea ~~lost~~ saved forever
          </p>
        </Chapter>

        {/* CTA */}
        <section style={{ textAlign: "center", marginBottom: 80 }}>
          <CTAButton href="/eureka/demo">see a Eureka →</CTAButton>
          <p
            style={{
              fontFamily: "var(--font-patrick)",
              fontSize: "14px",
              color: BODY,
              opacity: 0.6,
              margin: "14px auto 0",
              maxWidth: 380,
              lineHeight: 1.6,
            }}
          >
            this is one I generated from a real conversation about an AI tutoring idea
            I considered building
          </p>
        </section>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            borderTop: "1px dashed rgba(139,36,71,0.15)",
            paddingTop: 24,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-gloria)",
              fontSize: "12px",
              color: BODY,
              opacity: 0.5,
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            built in public · @nimbolkarshravani · source on{" "}
            <a
              href="https://github.com/nimbolkarshravani/Ideary"
              style={{ color: INK, opacity: 0.8 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <HeartDoodle />
          </p>
        </footer>

      </div>
    </div>
  );
}
