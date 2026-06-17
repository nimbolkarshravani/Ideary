import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";
import type { Eureka, EurekaSection, EurekaStatus } from "@/lib/types/eureka";

// ── DB row types ──────────────────────────────────────────────────────────────

export interface DbRow {
  id: string;
  title: string;
  one_liner: string;
  status: string;
  tags: string[] | null;
  captured_at: string;
  updated_at: string;
  source_conversation: string | null;
  spark: string | null;
  why_it_could_work: string[] | null;
  why_it_might_not: string[] | null;
  key_insight: string | null;
  verdict: string | null;
  revisit_if: string | null;
  what_itd_take: string[] | null;
  next_step: string | null;
  at_a_glance: Record<string, string> | null;
  custom_notes: EurekaSection[] | null;
}

export type DbInsert = Omit<DbRow, "id" | "captured_at" | "updated_at">;

// ── Heading → column mapping ──────────────────────────────────────────────────

const NAMED: Record<string, keyof DbInsert> = {
  "CONTEXT": "spark",
  "SPARK": "spark",
  "CASE FOR": "why_it_could_work",
  "WHY IT COULD WORK": "why_it_could_work",
  "CASE AGAINST": "why_it_might_not",
  "WHY IT MIGHT NOT": "why_it_might_not",
  "KEY INSIGHT": "key_insight",
  "VERDICT": "verdict",
  "CONDITIONS TO REVISIT": "revisit_if",
  "REVISIT IF": "revisit_if",
  "REQUIREMENTS": "what_itd_take",
  "WHAT IT'D TAKE": "what_itd_take",
  "WHAT YOU'D NEED": "what_itd_take",
  "AT A GLANCE": "at_a_glance",
  "NEXT STEPS": "next_step",
  "NEXT STEP": "next_step",
};

// ── Mapper: DB row → Eureka ───────────────────────────────────────────────────

function statusFromDb(raw: string): EurekaStatus {
  const map: Record<string, EurekaStatus> = {
    exploring: "EXPLORING",
    parked: "PARKED",
    dead: "DEAD",
    building: "BUILDING",
    // Legacy compat
    active: "EXPLORING",
    revisit: "BUILDING",
  };
  return map[raw] ?? "PARKED";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function dbRowToEureka(row: DbRow): Eureka {
  const sections: EurekaSection[] = [];

  if (row.spark)
    sections.push({ kind: "prose", heading: "Context", text: row.spark });
  if (row.why_it_could_work?.length)
    sections.push({ kind: "bullets", heading: "Case For", bulletKind: "arrow", items: row.why_it_could_work });
  if (row.why_it_might_not?.length)
    sections.push({ kind: "bullets", heading: "Case Against", bulletKind: "x", items: row.why_it_might_not });
  if (row.key_insight)
    sections.push({ kind: "highlight", heading: "Key Insight", text: row.key_insight });
  if (row.verdict)
    sections.push({ kind: "prose", heading: "Verdict", text: row.verdict });
  if (row.revisit_if)
    sections.push({ kind: "prose", heading: "Conditions to Revisit", text: row.revisit_if });
  if (row.what_itd_take?.length)
    sections.push({ kind: "bullets", heading: "Requirements", bulletKind: "dot", items: row.what_itd_take });
  if (row.next_step)
    sections.push({ kind: "prose", heading: "Next Step", text: row.next_step });
  if (row.at_a_glance && Object.keys(row.at_a_glance).length > 0) {
    const GLANCE_LABELS: Record<string, string> = { effort: "Effort", cost: "Cost", fit: "Fit", time: "Time" };
    const rows = Object.entries(row.at_a_glance)
      .filter(([, v]) => v)
      .map(([k, v]) => ({ label: GLANCE_LABELS[k] || k, value: v }));
    if (rows.length > 0)
      sections.push({ kind: "glance", heading: "At a Glance", rows, column: "right" });
  }
  if (row.custom_notes?.length)
    sections.push(...row.custom_notes);

  return {
    id: row.id,
    title: row.title,
    oneLiner: row.one_liner,
    status: statusFromDb(row.status),
    tags: row.tags ?? [],
    capturedDate: formatDate(row.captured_at),
    sections,
    conversationUrl: row.source_conversation ?? undefined,
  };
}

// ── Mapper: Eureka → DB fields ────────────────────────────────────────────────

function statusToDb(s: EurekaStatus): string {
  return s.toLowerCase();
}

export function eurekaToDbFields(e: Eureka): Partial<DbInsert> {
  const namedBullets: Record<string, string[]> = {};
  const namedProse: Record<string, string> = {};
  const namedGlance: Record<string, Record<string, string>> = {};
  const extra: EurekaSection[] = [];

  for (const section of e.sections) {
    const col = NAMED[section.heading.toUpperCase()] as string | undefined;

    if (!col) {
      extra.push(section);
      continue;
    }

    if (section.kind === "bullets") namedBullets[col] = section.items;
    else if (section.kind === "prose") namedProse[col] = section.text;
    else if (section.kind === "highlight") namedProse[col] = section.text;
    else if (section.kind === "glance") {
      const obj: Record<string, string> = {};
      for (const row of section.rows) obj[row.label.toLowerCase()] = row.value;
      namedGlance[col] = obj;
    } else extra.push(section);
  }

  return {
    title: e.title,
    one_liner: e.oneLiner,
    status: statusToDb(e.status),
    tags: e.tags,
    source_conversation: e.conversationUrl ?? null,
    spark: (namedProse["spark"] as string) ?? null,
    why_it_could_work: (namedBullets["why_it_could_work"] as string[]) ?? null,
    why_it_might_not: (namedBullets["why_it_might_not"] as string[]) ?? null,
    key_insight: (namedProse["key_insight"] as string) ?? null,
    verdict: (namedProse["verdict"] as string) ?? null,
    revisit_if: (namedProse["revisit_if"] as string) ?? null,
    what_itd_take: (namedBullets["what_itd_take"] as string[]) ?? null,
    next_step: (namedProse["next_step"] as string) ?? null,
    at_a_glance: (namedGlance["at_a_glance"] as Record<string, string>) ?? null,
    custom_notes: extra.length > 0 ? extra : null,
  };
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function getEurekas(): Promise<Eureka[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("eurekas")
    .select("*")
    .order("captured_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbRow[]).map(dbRowToEureka);
}

export async function getEurekaById(id: string): Promise<Eureka | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("eurekas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return dbRowToEureka(data as DbRow);
}

export async function createEureka(
  fields: Partial<Omit<Eureka, "id" | "capturedDate">>,
): Promise<Eureka> {
  const partial: Partial<DbInsert> = {
    title: fields.title ?? "Untitled",
    one_liner: fields.oneLiner ?? "",
    status: statusToDb(fields.status ?? "PARKED"),
    tags: fields.tags ?? [],
    source_conversation: fields.conversationUrl ?? null,
  };

  const { data, error } = await getSupabase()
    .from("eurekas")
    .insert(partial)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return dbRowToEureka(data as DbRow);
}

export async function updateEureka(
  id: string,
  fields: Partial<DbInsert>,
): Promise<void> {
  const { error } = await getSupabase()
    .from("eurekas")
    .update(fields)
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteEureka(id: string): Promise<void> {
  const { error } = await getSupabase().from("eurekas").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteEurekaField(
  id: string,
  fieldName: keyof DbInsert,
): Promise<void> {
  const { error } = await getSupabase()
    .from("eurekas")
    .update({ [fieldName]: null })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
