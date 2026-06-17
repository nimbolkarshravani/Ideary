import { getSupabaseAdmin } from "@/lib/supabase";
import type { ChatMessage, ExtractionOutput } from "@/lib/extract";
import { extractionToSections } from "@/lib/extract";

const VALID_STATUS = new Set(["active", "parked", "dead", "revisit"]);

export interface ImportIdentity {
  provider: string;
  conversation_id: string;
  user_id: string;
  messages: ChatMessage[];
}

/** Look up an existing Eureka by its conversation key. Returns its id or null. */
export async function findEurekaByConversation(
  provider: string,
  conversationId: string,
): Promise<string | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("eurekas")
    .select("id")
    .eq("provider", provider)
    .eq("conversation_id", conversationId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data?.id ?? null;
}

/**
 * Persist the raw conversation immediately, before extraction runs, so the
 * source is never lost. Creates the row if new, otherwise refreshes its raw
 * conversation. Returns the row id and whether it was newly created.
 */
export async function saveRawConversation(
  identity: ImportIdentity,
): Promise<{ id: string; isNew: boolean }> {
  const existingId = await findEurekaByConversation(
    identity.provider,
    identity.conversation_id,
  );

  const db = getSupabaseAdmin();

  if (existingId) {
    const { error } = await db
      .from("eurekas")
      .update({ raw_conversation: identity.messages })
      .eq("id", existingId);
    if (error) throw new Error(error.message);
    return { id: existingId, isNew: false };
  }

  // New conversation: insert a placeholder row that holds the raw source.
  // Extraction fills in the real fields next; if it fails, the source survives.
  const { data, error } = await db
    .from("eurekas")
    .insert({
      provider: identity.provider,
      conversation_id: identity.conversation_id,
      user_id: identity.user_id,
      raw_conversation: identity.messages,
      title: "Imported conversation",
      one_liner: "",
      status: "active",
      sections: [],
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return { id: data.id, isNew: true };
}

/** Overwrite a row's extracted fields with a fresh extraction result. */
export async function applyExtraction(
  id: string,
  e: ExtractionOutput,
  messages?: ChatMessage[],
): Promise<void> {
  const status = VALID_STATUS.has(e.status) ? e.status : "active";

  // Gemini occasionally returns null for title on ambiguous transcripts.
  // Fall back to the first user message (truncated) so the row is never "Untitled".
  let title = e.title || null;
  if (!title && messages) {
    const firstUser = messages.find((m) => m.role === "user");
    if (firstUser) {
      title = firstUser.content.slice(0, 60).replace(/\s+/g, " ").trim() + (firstUser.content.length > 60 ? "…" : "");
    }
  }
  title = title || "Untitled";

  const { error } = await getSupabaseAdmin()
    .from("eurekas")
    .update({
      title,
      one_liner: e.one_liner ?? "",
      status,
      tags: e.tags ?? [],
      sections: extractionToSections(e),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
