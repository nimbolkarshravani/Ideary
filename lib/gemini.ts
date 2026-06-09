// Minimal Gemini REST client (no SDK dependency).
// Used by the extraction pipeline and the eval harness.

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export interface GeminiOptions {
  model?: string;
  json?: boolean;
  temperature?: number;
  /** Set to 0 to disable thinking on 2.5 models (faster, cheaper). */
  thinkingBudget?: number;
}

export async function callGemini(
  prompt: string,
  opts: GeminiOptions = {},
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const model = opts.model ?? "gemini-2.5-flash";

  const generationConfig: Record<string, unknown> = {
    temperature: opts.temperature ?? 0.4,
  };
  if (opts.json) generationConfig.responseMimeType = "application/json";
  if (opts.thinkingBudget !== undefined) {
    generationConfig.thinkingConfig = { thinkingBudget: opts.thinkingBudget };
  }

  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig,
  });

  let lastErr: unknown;
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const res = await fetch(
        `${ENDPOINT}/${model}:generateContent?key=${apiKey}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body },
      );
      if (!res.ok) {
        const text = await res.text();
        // 429 / 5xx are retryable; other 4xx are not.
        if (res.status !== 429 && res.status < 500) {
          throw new Error(`Gemini ${res.status}: ${text}`);
        }
        // Honor the server's requested retry delay when present.
        if (res.status === 429) {
          const m = text.match(/"retryDelay":\s*"(\d+)s"/) ?? text.match(/retry in ([\d.]+)s/);
          const wait = m ? Math.min(Number(m[1]) + 1, 60) : 5 * (attempt + 1);
          await new Promise((r) => setTimeout(r, wait * 1000));
        }
        throw new Error(`retryable Gemini ${res.status}: ${text}`);
      }
      const data = await res.json();
      const text: string =
        data?.candidates?.[0]?.content?.parts
          ?.map((p: { text?: string }) => p.text ?? "")
          .join("") ?? "";
      if (!text.trim()) {
        throw new Error(
          `Empty Gemini response: ${JSON.stringify(data).slice(0, 400)}`,
        );
      }
      return text;
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.startsWith("Gemini ")) throw err; // non-retryable
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw lastErr;
}

/** Parse a JSON object from a model response, tolerating ```json fences. */
export function parseJson<T = unknown>(raw: string): T {
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  }
  // Grab the outermost JSON object/array if there's leading/trailing prose.
  const first = s.search(/[{[]/);
  const last = Math.max(s.lastIndexOf("}"), s.lastIndexOf("]"));
  if (first > 0 || last < s.length - 1) {
    if (first !== -1 && last !== -1) s = s.slice(first, last + 1);
  }
  return JSON.parse(s) as T;
}
