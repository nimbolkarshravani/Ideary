"use client";

import { useState, useRef, useEffect } from "react";
import rough from "roughjs";
import { useRouter } from "next/navigation";
import type { Eureka, EurekaSection } from "@/lib/types/eureka";
import StatusBadge from "@/app/components/StatusBadge";
import HandDrawnDivider from "@/app/components/HandDrawnDivider";
import MarginaliaQuote from "@/app/components/MarginaliaQuote";
import TagChip from "@/app/components/TagChip";
import BulletArrow from "@/app/components/BulletArrow";
import BulletX from "@/app/components/BulletX";
import LightbulbIcon from "@/app/components/LightbulbIcon";

const INK = "#1E2A3A";
const MID = "#3a4f6b";

const TA: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-patrick)",
  fontSize: "15px",
  color: INK,
  lineHeight: "1.7",
  background: "rgba(254,249,245,0.95)",
  border: "1.5px solid rgba(30,42,58,0.25)",
  borderRadius: 2,
  padding: "6px 8px",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
};

const BTN_SAVE: React.CSSProperties = {
  fontFamily: "var(--font-gloria)",
  fontSize: "12px",
  color: "#2a7a4b",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

const BTN_CANCEL: React.CSSProperties = {
  fontFamily: "var(--font-gloria)",
  fontSize: "12px",
  color: "#b44",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function mapSection(
  e: Eureka,
  idx: number,
  fn: (s: EurekaSection) => EurekaSection,
): Eureka {
  return { ...e, sections: e.sections.map((s, i) => (i === idx ? fn(s) : s)) };
}

// ── EditableBlock ─────────────────────────────────────────────────────────────
// Shows children normally; on hover shows pencil (+ optional ×); on click-pencil
// replaces children with a textarea + save/cancel controls.

function EditableBlock({
  value,
  onSave,
  onRemove,
  rows = 2,
  children,
}: {
  value: string;
  onSave: (v: string) => void;
  onRemove?: () => void;
  rows?: number;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && taRef.current) {
      taRef.current.focus();
      taRef.current.select();
    }
  }, [editing]);

  const save = () => {
    onSave(draft.trim() || value);
    setEditing(false);
  };
  const cancel = () => {
    setEditing(false);
    setDraft(value);
  };

  if (editing) {
    return (
      <div>
        <textarea
          ref={taRef}
          value={draft}
          rows={rows}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") cancel();
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) save();
          }}
          style={TA}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button onClick={save} style={BTN_SAVE}>✓ save</button>
          <button onClick={cancel} style={BTN_CANCEL}>cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {hovered && (
        <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 2 }}>
          <button
            onClick={() => { setDraft(value); setEditing(true); }}
            title="Edit"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", opacity: 0.45, padding: "0 3px", lineHeight: 1 }}
          >
            ✏
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              title="Remove"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#b44", opacity: 0.5, padding: "0 3px", lineHeight: 1 }}
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── SectionHeaderEl ───────────────────────────────────────────────────────────

function SectionHeaderEl({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ display: "flex", alignItems: "flex-start", gap: 6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2
        style={{
          fontFamily: "var(--font-caveat)",
          fontSize: "20px",
          fontWeight: 700,
          color: INK,
          margin: "0 0 4px 0",
          textDecoration: "underline",
          textDecorationStyle: "wavy",
          textDecorationColor: "rgba(30,42,58,0.3)",
          textUnderlineOffset: "4px",
          flex: 1,
        }}
      >
        {children}
      </h2>
      {hovered && (
        <button
          onClick={onRemove}
          title="Remove section"
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#b44", opacity: 0.55, padding: "0 2px", lineHeight: 1, marginTop: 1 }}
        >
          ×
        </button>
      )}
    </div>
  );
}

// ── BulletIcon ────────────────────────────────────────────────────────────────

function BulletIcon({ kind }: { kind: string }) {
  if (kind === "arrow") return <BulletArrow />;
  if (kind === "x") return <BulletX />;
  if (kind === "question") {
    return (
      <span style={{ fontFamily: "var(--font-gloria)", fontSize: "15px", color: INK, flexShrink: 0, marginTop: 1 }}>
        ?
      </span>
    );
  }
  return (
    <span style={{ fontFamily: "var(--font-patrick)", fontSize: "15px", color: INK, flexShrink: 0, marginTop: 1, lineHeight: 1.6 }}>
      —
    </span>
  );
}

// ── DeleteDialog ──────────────────────────────────────────────────────────────

function DeleteDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 360, H = 186;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    svg.appendChild(
      rc.rectangle(6, 6, W - 12, H - 12, {
        stroke: INK,
        strokeWidth: 1.5,
        roughness: 2.2,
        fill: "#FAF8F3",
        fillStyle: "solid",
        bowing: 0.8,
      }),
    );
  }, []);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(30,42,58,0.38)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ position: "relative", width: W, height: H }}>
        <svg ref={svgRef} width={W} height={H} style={{ position: "absolute", inset: 0 }} aria-hidden="true" />
        <div style={{ position: "relative", zIndex: 1, padding: "30px 36px", display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: "24px", fontWeight: 700, color: INK, margin: 0, lineHeight: 1.3 }}>
            tear out this Eureka?
          </p>
          <p style={{ fontFamily: "var(--font-patrick)", fontSize: "14px", color: MID, margin: 0, lineHeight: 1.55 }}>
            This removes it from your list. It only lives in memory right now, so it&apos;s gone for real.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <button
              onClick={onConfirm}
              style={{ fontFamily: "var(--font-gloria)", fontSize: "14px", color: "#b44", background: "none", border: "1.5px solid rgba(170,68,68,0.4)", borderRadius: 2, padding: "6px 16px", cursor: "pointer" }}
            >
              yes, tear it out
            </button>
            <button
              onClick={onCancel}
              style={{ fontFamily: "var(--font-gloria)", fontSize: "14px", color: MID, background: "none", border: "none", cursor: "pointer", opacity: 0.7 }}
            >
              keep it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AddSectionMenu ────────────────────────────────────────────────────────────

const ADD_OPTIONS: { label: string; section: EurekaSection }[] = [
  { label: "✏ custom note", section: { kind: "prose", heading: "NOTE", text: "Add your thoughts here." } },
  { label: "→ pros list", section: { kind: "bullets", heading: "CASE FOR", bulletKind: "arrow", items: [""] } },
  { label: "× cons list", section: { kind: "bullets", heading: "CASE AGAINST", bulletKind: "x", items: [""] } },
  { label: "— next steps", section: { kind: "bullets", heading: "NEXT STEPS", bulletKind: "dot", items: [""] } },
  { label: "⬡ what you'd need", section: { kind: "bullets", heading: "WHAT YOU'D NEED", bulletKind: "dot", items: [""] } },
  { label: "◈ at a glance", section: { kind: "glance", heading: "AT A GLANCE", rows: [{ label: "Capital", value: "—" }] } },
  { label: "★ key insight", section: { kind: "highlight", heading: "KEY INSIGHT", text: "The key thing you realized." } },
];

function AddSectionMenu({ onAdd }: { onAdd: (s: EurekaSection) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          fontFamily: "var(--font-gloria)",
          fontSize: "13px",
          color: INK,
          opacity: 0.5,
          background: "none",
          border: "1.5px dashed rgba(30,42,58,0.25)",
          borderRadius: 2,
          padding: "5px 16px",
          cursor: "pointer",
        }}
      >
        + add section
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            marginBottom: 6,
            background: "#FAF8F3",
            border: "1.5px solid rgba(30,42,58,0.15)",
            borderRadius: 2,
            boxShadow: "2px 4px 14px rgba(0,0,0,0.09)",
            minWidth: 210,
            zIndex: 20,
            overflow: "hidden",
          }}
        >
          {ADD_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => { onAdd(opt.section); setOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                fontFamily: "var(--font-patrick)",
                fontSize: "14px",
                color: INK,
                background: "none",
                border: "none",
                borderBottom: "1px solid rgba(30,42,58,0.06)",
                padding: "8px 16px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FFD9E5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── EurekaPageClient ──────────────────────────────────────────────────────────

export default function EurekaPageClient({ initial }: { initial: Eureka }) {
  const [eureka, setEureka] = useState<Eureka>(initial);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();

  const statusColor = eureka.status === "DEAD" ? "red" : "yellow";

  const sectionsWithIdx = eureka.sections.map((s, idx) => ({ s, idx }));
  const leftSections = sectionsWithIdx.filter(({ s }) => !s.column || s.column === "left");
  const rightSections = sectionsWithIdx.filter(({ s }) => s.column === "right");
  const hasRight = rightSections.length > 0 || (eureka.quotes && eureka.quotes.length > 0);

  function renderSection(s: EurekaSection, idx: number) {
    const remove = () =>
      setEureka((e) => ({ ...e, sections: e.sections.filter((_, i) => i !== idx) }));

    if (s.kind === "prose") {
      return (
        <section key={idx}>
          <SectionHeaderEl onRemove={remove}>{s.heading}</SectionHeaderEl>
          <EditableBlock
            value={s.text}
            onSave={(v) =>
              setEureka((e) =>
                mapSection(e, idx, (sec) =>
                  sec.kind === "prose" ? { ...sec, text: v } : sec,
                ),
              )
            }
            rows={3}
          >
            <p style={{ fontFamily: "var(--font-patrick)", fontSize: "15px", lineHeight: "1.7", color: INK, margin: "10px 0 0 0" }}>
              {s.text}
            </p>
          </EditableBlock>
        </section>
      );
    }

    if (s.kind === "highlight") {
      return (
        <section key={idx}>
          <SectionHeaderEl onRemove={remove}>{s.heading}</SectionHeaderEl>
          <EditableBlock
            value={s.text}
            onSave={(v) =>
              setEureka((e) =>
                mapSection(e, idx, (sec) =>
                  sec.kind === "highlight" ? { ...sec, text: v } : sec,
                ),
              )
            }
            rows={3}
          >
            <div style={{ backgroundColor: "#FEF3A7", padding: "14px 18px", borderRadius: 2, marginTop: 10 }}>
              <p style={{ fontFamily: "var(--font-patrick)", fontSize: "16px", lineHeight: "1.75", color: INK, margin: 0, fontStyle: "italic" }}>
                {s.text}
              </p>
            </div>
          </EditableBlock>
        </section>
      );
    }

    if (s.kind === "bullets") {
      const { bulletKind, items } = s;
      return (
        <section key={idx}>
          <SectionHeaderEl onRemove={remove}>{s.heading}</SectionHeaderEl>
          <ul style={{ listStyle: "none", margin: "12px 0 0 0", padding: 0 }}>
            {items.map((item, iIdx) => (
              <li key={iIdx} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                <BulletIcon kind={bulletKind} />
                <EditableBlock
                  value={item}
                  onSave={(v) =>
                    setEureka((e) => ({
                      ...e,
                      sections: e.sections.map((sec, i) => {
                        if (i !== idx || sec.kind !== "bullets") return sec;
                        return { ...sec, items: sec.items.map((it, j) => (j === iIdx ? v : it)) };
                      }),
                    }))
                  }
                  onRemove={() =>
                    setEureka((e) => ({
                      ...e,
                      sections: e.sections.map((sec, i) => {
                        if (i !== idx || sec.kind !== "bullets") return sec;
                        return { ...sec, items: sec.items.filter((_, j) => j !== iIdx) };
                      }),
                    }))
                  }
                  rows={2}
                >
                  <span style={{ fontFamily: "var(--font-patrick)", fontSize: "15px", lineHeight: "1.7", color: INK }}>
                    {item}
                  </span>
                </EditableBlock>
              </li>
            ))}
          </ul>
          <button
            onClick={() =>
              setEureka((e) => ({
                ...e,
                sections: e.sections.map((sec, i) => {
                  if (i !== idx || sec.kind !== "bullets") return sec;
                  return { ...sec, items: [...sec.items, "New item"] };
                }),
              }))
            }
            style={{ fontFamily: "var(--font-gloria)", fontSize: "12px", color: INK, opacity: 0.38, background: "none", border: "none", cursor: "pointer", padding: "4px 0 0 26px" }}
          >
            + add item
          </button>
        </section>
      );
    }

    if (s.kind === "glance") {
      return (
        <section key={idx}>
          <SectionHeaderEl onRemove={remove}>{s.heading}</SectionHeaderEl>
          <div style={{ marginTop: 14 }}>
            {s.rows.map((row, rIdx) => (
              <div
                key={rIdx}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px dashed rgba(30,42,58,0.15)", paddingBottom: 8, marginBottom: 8 }}
              >
                <span style={{ fontFamily: "var(--font-patrick)", fontSize: "13px", color: MID, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {row.label}
                </span>
                <EditableBlock
                  value={row.value}
                  onSave={(v) =>
                    setEureka((e) => ({
                      ...e,
                      sections: e.sections.map((sec, i) => {
                        if (i !== idx || sec.kind !== "glance") return sec;
                        return { ...sec, rows: sec.rows.map((r, j) => (j === rIdx ? { ...r, value: v } : r)) };
                      }),
                    }))
                  }
                  rows={1}
                >
                  <span style={{ fontFamily: "var(--font-caveat)", fontSize: "16px", fontWeight: 700, color: INK }}>
                    {row.value}
                  </span>
                </EditableBlock>
              </div>
            ))}
          </div>
        </section>
      );
    }

    return null;
  }

  return (
    <>
      {showDelete && (
        <DeleteDialog
          onConfirm={() => { setShowDelete(false); router.push("/eurekas"); }}
          onCancel={() => setShowDelete(false)}
        />
      )}

      <div
        className="dot-grid"
        style={{ minHeight: "100vh", backgroundColor: "#FAF8F3", padding: "48px 40px 64px" }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Hero */}
          <div style={{ position: "relative", marginBottom: 8 }}>
            <div style={{ position: "absolute", top: 0, left: 0 }}>
              <LightbulbIcon />
            </div>
            <div style={{ position: "absolute", top: 4, right: 0, display: "flex", gap: 10, alignItems: "center" }}>
              <button
                onClick={() => setShowDelete(true)}
                title="Delete this Eureka"
                style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.4, fontSize: "18px", padding: 0, lineHeight: 1 }}
              >
                🗑
              </button>
              <StatusBadge label={eureka.status} color={statusColor} />
            </div>

            <div style={{ textAlign: "center", paddingTop: 8, paddingBottom: 24 }}>
              <EditableBlock
                value={eureka.title}
                onSave={(v) => setEureka((e) => ({ ...e, title: v }))}
                rows={1}
              >
                <h1 style={{ fontFamily: "var(--font-caveat)", fontSize: "52px", fontWeight: 700, color: INK, margin: "0 0 8px 0", lineHeight: 1.1 }}>
                  {eureka.title}
                </h1>
              </EditableBlock>
              <EditableBlock
                value={eureka.oneLiner}
                onSave={(v) => setEureka((e) => ({ ...e, oneLiner: v }))}
                rows={2}
              >
                <p style={{ fontFamily: "var(--font-patrick)", fontSize: "17px", color: MID, margin: 0 }}>
                  {eureka.oneLiner}
                </p>
              </EditableBlock>
            </div>
          </div>

          <HandDrawnDivider className="mb-8" />

          {/* Two-column body */}
          <div style={{ display: "flex", gap: 40, marginTop: 32, alignItems: "flex-start" }}>

            {/* Left column */}
            <div style={{ flex: hasRight ? "0 0 58%" : "1", display: "flex", flexDirection: "column", gap: 32 }}>
              {leftSections.map(({ s, idx }) => renderSection(s, idx))}
              <div>
                <AddSectionMenu
                  onAdd={(s) => setEureka((e) => ({ ...e, sections: [...e.sections, s] }))}
                />
              </div>
            </div>

            {/* Right column */}
            {hasRight && (
              <div style={{ flex: "0 0 38%", display: "flex", flexDirection: "column", gap: 20 }}>
                {eureka.quotes?.map((q, i) => (
                  <MarginaliaQuote key={i} highlight={q.highlight} rotate={q.rotate} marginTop={q.marginTop}>
                    {q.text}
                  </MarginaliaQuote>
                ))}
                {rightSections.map(({ s, idx }) => renderSection(s, idx))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 48 }}>
            <HandDrawnDivider className="mb-8" />
            <div style={{ marginTop: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                {eureka.tags.map((tag) => (
                  <TagChip key={tag} label={tag} />
                ))}
              </div>
              <span style={{ fontFamily: "var(--font-patrick)", fontSize: "12px", color: MID, opacity: 0.7, whiteSpace: "nowrap" }}>
                first captured {eureka.capturedDate}
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
