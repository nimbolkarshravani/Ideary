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
  case_for: string[] | null;
  case_against: string[] | null;
  key_insight: string | null;
  verdict: string | null;
  revisit_if: string | null;
  what_youd_need: string[] | null;
  numbers: { label: string; value: string }[] | null;
  next_step: string | null;
  at_a_glance: { label: string; value: string }[] | null;
  custom_notes: EurekaSection[] | null;
}

export type DbInsert = Omit<DbRow, "id" | "captured_at" | "updated_at">;

// ── Heading → column mapping ──────────────────────────────────────────────────

// All headings that are stored in named columns (vs custom_notes)
const NAMED: Record<string, keyof DbInsert> = {
  "SPARK": "spark",
  "CASE FOR": "case_for",
  "WHY IT COULD WORK": "case_for",
  "CASE AGAINST": "case_against",
  "WHY IT MIGHT NOT": "case_against",
  "KEY INSIGHT": "key_insight",
  "VERDICT": "verdict",
  "REVISIT IF": "revisit_if",
  "WHAT YOU'D NEED": "what_youd_need",
  "WHAT YOU NEED": "what_youd_need",
  "AT A GLANCE": "at_a_glance",
  "NEXT STEPS": "next_step",
  "NEXT STEP": "next_step",
};

// ── Mapper: DB row → Eureka ───────────────────────────────────────────────────

function statusFromDb(raw: string): EurekaStatus {
  const map: Record<string, EurekaStatus> = {
    active: "ACTIVE",
    parked: "PARKED",
    dead: "DEAD",
    revisit: "REVISIT",
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
    sections.push({ kind: "prose", heading: "SPARK", text: row.spark });
  if (row.case_for?.length)
    sections.push({ kind: "bullets", heading: "CASE FOR", bulletKind: "arrow", items: row.case_for });
  if (row.case_against?.length)
    sections.push({ kind: "bullets", heading: "CASE AGAINST", bulletKind: "x", items: row.case_against });
  if (row.key_insight)
    sections.push({ kind: "highlight", heading: "KEY INSIGHT", text: row.key_insight });
  if (row.verdict)
    sections.push({ kind: "prose", heading: "VERDICT", text: row.verdict });
  if (row.revisit_if)
    sections.push({ kind: "prose", heading: "REVISIT IF", text: row.revisit_if });
  if (row.next_step)
    sections.push({ kind: "prose", heading: "NEXT STEPS", text: row.next_step });
  if (row.what_youd_need?.length)
    sections.push({ kind: "bullets", heading: "WHAT YOU'D NEED", bulletKind: "dot", items: row.what_youd_need, column: "right" });
  if (row.at_a_glance?.length)
    sections.push({ kind: "glance", heading: "AT A GLANCE", rows: row.at_a_glance, column: "right" });
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
  const namedGlance: Record<string, { label: string; value: string }[]> = {};
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
    else if (section.kind === "glance") namedGlance[col] = section.rows;
    else extra.push(section);
  }

  return {
    title: e.title,
    one_liner: e.oneLiner,
    status: statusToDb(e.status),
    tags: e.tags,
    source_conversation: e.conversationUrl ?? null,
    spark: (namedProse["spark"] as string) ?? null,
    case_for: (namedBullets["case_for"] as string[]) ?? null,
    case_against: (namedBullets["case_against"] as string[]) ?? null,
    key_insight: (namedProse["key_insight"] as string) ?? null,
    verdict: (namedProse["verdict"] as string) ?? null,
    revisit_if: (namedProse["revisit_if"] as string) ?? null,
    what_youd_need: (namedBullets["what_youd_need"] as string[]) ?? null,
    next_step: (namedProse["next_step"] as string) ?? null,
    at_a_glance: (namedGlance["at_a_glance"] as { label: string; value: string }[]) ?? null,
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
