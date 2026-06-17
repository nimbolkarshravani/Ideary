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
  sections: EurekaSection[] | null;
  template_id: string | null;
}

export type DbInsert = Omit<DbRow, "id" | "captured_at" | "updated_at">;

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
  return {
    id: row.id,
    title: row.title,
    oneLiner: row.one_liner,
    status: statusFromDb(row.status),
    tags: row.tags ?? [],
    capturedDate: formatDate(row.captured_at),
    sections: (row.sections as EurekaSection[]) ?? [],
    conversationUrl: row.source_conversation ?? undefined,
  };
}

// ── Mapper: Eureka → DB fields ────────────────────────────────────────────────

function statusToDb(s: EurekaStatus): string {
  return s.toLowerCase();
}

export function eurekaToDbFields(e: Eureka): Partial<DbInsert> {
  return {
    title: e.title,
    one_liner: e.oneLiner,
    status: statusToDb(e.status),
    tags: e.tags,
    source_conversation: e.conversationUrl ?? null,
    sections: e.sections,
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
    sections: fields.sections ?? [],
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
