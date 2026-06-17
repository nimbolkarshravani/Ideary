import { EXTRACTION_PROMPT } from "./extraction-prompt";
import { callGemini, parseJson } from "./gemini";
import type { EurekaSection } from "./types/eureka";

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

export function extractionToSections(e: ExtractionOutput): EurekaSection[] {
  const sections: EurekaSection[] = [];
  if (e.spark)
    sections.push({ kind: "prose", heading: "SPARK", text: e.spark });
  if (e.case_for?.length)
    sections.push({ kind: "bullets", heading: "CASE FOR", bulletKind: "arrow", items: e.case_for });
  if (e.case_against?.length)
    sections.push({ kind: "bullets", heading: "CASE AGAINST", bulletKind: "x", items: e.case_against });
  if (e.key_insight)
    sections.push({ kind: "highlight", heading: "KEY INSIGHT", text: e.key_insight });
  if (e.verdict)
    sections.push({ kind: "prose", heading: "VERDICT", text: e.verdict });
  if (e.revisit_if)
    sections.push({ kind: "prose", heading: "REVISIT IF", text: e.revisit_if });
  if (e.next_step)
    sections.push({ kind: "prose", heading: "NEXT STEPS", text: e.next_step });
  if (e.what_youd_need?.length)
    sections.push({ kind: "bullets", heading: "WHAT YOU'D NEED", bulletKind: "dot", items: e.what_youd_need, column: "right" });
  if (e.at_a_glance?.length)
    sections.push({ kind: "glance", heading: "AT A GLANCE", rows: e.at_a_glance, column: "right" });
  return sections;
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
