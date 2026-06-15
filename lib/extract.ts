import { EXTRACTION_PROMPT } from "./extraction-prompt";
import { callGemini, parseJson } from "./gemini";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ExtractionOutput {
  title: string;
  one_liner: string;
  status: "active" | "parked" | "dead" | "revisit";
  tags: string[];
  spark?: string | null;
  case_for?: string[] | null;
  case_against?: string[] | null;
  key_insight?: string | null;
  verdict?: string | null;
  revisit_if?: string | null;
  what_youd_need?: string[] | null;
  next_step?: string | null;
  at_a_glance?: { label: string; value: string }[] | null;
}

/** Turn a structured message list into a plain transcript for the model. */
export function messagesToTranscript(messages: ChatMessage[]): string {
  return messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n\n");
}

/**
 * Run Gemini extraction on a conversation and return the structured Eureka.
 * Accepts either a raw transcript string or a list of chat messages.
 * Same code path the eval harness validated (winning prompt, Gemini 2.5 Flash).
 */
export async function extractEureka(
  input: string | ChatMessage[],
): Promise<ExtractionOutput> {
  const conversation =
    typeof input === "string" ? input : messagesToTranscript(input);

  const full = `${EXTRACTION_PROMPT}

--- CONVERSATION ---
${conversation}
--- END CONVERSATION ---

Output only valid JSON. No markdown fences, no explanation.`;

  const raw = await callGemini(full, {
    json: true,
    thinkingBudget: 2048,
    temperature: 0.4,
  });
  return parseJson<ExtractionOutput>(raw);
}
