import { EXTRACTION_PROMPT } from "./extraction-prompt";
import { callGemini, parseJson } from "./gemini";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AtAGlance {
  effort?: string;
  cost?: string;
  fit?: string;
  time?: string;
}

export interface ExtractionOutput {
  title: string;
  one_liner: string;
  status: "exploring" | "parked" | "dead" | "building";
  tags: string[];
  spark?: string | null;
  why_it_could_work?: string[] | null;
  why_it_might_not?: string[] | null;
  key_insight?: string | null;
  verdict: string;
  revisit_if?: string | null;
  what_itd_take?: string[] | null;
  next_step?: string | null;
  at_a_glance?: AtAGlance | null;
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
