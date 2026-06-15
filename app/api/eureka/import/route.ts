import { extractEureka, type ChatMessage } from "@/lib/extract";
import {
  saveRawConversation,
  applyExtraction,
} from "@/lib/db/import";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PROVIDERS = new Set(["claude", "chatgpt", "gemini"]);
const ROLES = new Set(["user", "assistant"]);

interface ImportBody {
  provider: string;
  conversation_id: string;
  messages: ChatMessage[];
}

function validate(body: unknown): { ok: true; value: ImportBody } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Body must be a JSON object." };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.provider !== "string" || !PROVIDERS.has(b.provider)) {
    return { ok: false, error: "provider must be one of: claude, chatgpt, gemini." };
  }
  if (typeof b.conversation_id !== "string" || b.conversation_id.trim() === "") {
    return { ok: false, error: "conversation_id must be a non-empty string." };
  }
  if (!Array.isArray(b.messages) || b.messages.length === 0) {
    return { ok: false, error: "messages must be a non-empty array." };
  }
  for (const [i, m] of b.messages.entries()) {
    if (typeof m !== "object" || m === null) {
      return { ok: false, error: `messages[${i}] must be an object.` };
    }
    const msg = m as Record<string, unknown>;
    if (typeof msg.role !== "string" || !ROLES.has(msg.role)) {
      return { ok: false, error: `messages[${i}].role must be "user" or "assistant".` };
    }
    if (typeof msg.content !== "string") {
      return { ok: false, error: `messages[${i}].content must be a string.` };
    }
  }

  return {
    ok: true,
    value: {
      provider: b.provider,
      conversation_id: b.conversation_id,
      messages: b.messages as ChatMessage[],
    },
  };
}

export async function POST(request: Request) {
  // 1. Parse + validate
  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = validate(parsed);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }
  const { provider, conversation_id, messages } = result.value;

  const userId = process.env.DEFAULT_USER_ID;
  if (!userId) {
    return Response.json(
      { error: "DEFAULT_USER_ID is not configured." },
      { status: 500 },
    );
  }

  // 2 + 3. Look up existing and persist the raw conversation immediately,
  // so the source is preserved even if extraction later fails.
  let id: string;
  let isNew: boolean;
  try {
    const saved = await saveRawConversation({
      provider,
      conversation_id,
      user_id: userId,
      messages,
    });
    id = saved.id;
    isNew = saved.isNew;
  } catch (err) {
    return Response.json(
      { error: `Failed to save conversation: ${(err as Error).message}` },
      { status: 500 },
    );
  }

  // 4 + 5. Extract and apply. On failure, the raw conversation is still saved.
  try {
    const extraction = await extractEureka(messages);
    await applyExtraction(id, extraction);
  } catch (err) {
    console.error("Extraction failed for eureka", id, err);
    return Response.json({ eureka_id: id, status: "extraction_failed" });
  }

  return Response.json({ eureka_id: id, status: isNew ? "created" : "updated" });
}
