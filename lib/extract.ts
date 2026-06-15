import { EXTRACTION_PROMPT } from "./extraction-prompt";

const MODEL = "gemini-2.5-flash";

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

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return key;
}

function extractJson(raw: string): unknown {
  const stripped = raw
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```\s*$/m, "")
    .trim();
  return JSON.parse(stripped);
}

/** Low-level text generation call to Gemini. */
export async function callGemini(prompt: string, thinkingBudget = 1024): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey()}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, thinkingConfig: { thinkingBudget } },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    candidates: { content: { parts: { text?: string; thought?: boolean }[] } }[];
  };
  const parts = data.candidates[0].content.parts;
  const textPart = parts.find((p) => !p.thought) ?? parts[parts.length - 1];
  return textPart.text ?? "";
}

/**
 * Run Gemini extraction on a raw conversation and return the structured Eureka.
 * This is the same code path the eval harness uses, with the winning prompt.
 */
export async function extractEureka(conversation: string): Promise<ExtractionOutput> {
  const full = `${EXTRACTION_PROMPT}

--- CONVERSATION ---
${conversation}
--- END CONVERSATION ---

Output only valid JSON. No markdown fences, no explanation.`;

  const raw = await callGemini(full, 2048);
  return extractJson(raw) as ExtractionOutput;
}
