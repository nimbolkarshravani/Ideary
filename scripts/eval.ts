import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { callGemini, parseJson } from "../lib/gemini";
import { EXTRACTION_PROMPT as INITIAL_PROMPT } from "../lib/extraction-prompt";
import { TEST_CONVERSATIONS, type TestConversation } from "./test-conversations";

// ── Config ──────────────────────────────────────────────────────────────────
const EXTRACT_MODEL = "gemini-2.5-flash";
const JUDGE_MODEL = "gemini-2.5-flash";
const REFINE_MODEL = "gemini-2.5-flash";
const THRESHOLD = 4.0;
const MAX_ITERATIONS = 4;

const CRITERIA = [
  "faithfulness",
  "completeness",
  "conciseness",
  "honesty",
  "statusAccuracy",
  "voice",
] as const;
type Criterion = (typeof CRITERIA)[number];
type Scores = Record<Criterion, number> & { notes: string };

interface ConvResult {
  conv: TestConversation;
  extraction: unknown;
  extractionError?: string;
  scores: Scores;
}
interface IterationResult {
  iteration: number;
  prompt: string;
  results: ConvResult[];
  avg: number;
  perCriterion: Record<Criterion, number>;
}

// ── Extraction ────────────────────────────────────────────────────────────────
async function extract(prompt: string, conv: TestConversation): Promise<unknown> {
  const filled = prompt.replace("{{CONVERSATION}}", conv.transcript);
  const raw = await callGemini(filled, {
    model: EXTRACT_MODEL,
    json: true,
    temperature: 0.3,
    thinkingBudget: 0,
  });
  return parseJson(raw);
}

// ── Judge ─────────────────────────────────────────────────────────────────────
async function judge(
  conv: TestConversation,
  extraction: unknown,
): Promise<Scores> {
  const judgePrompt = `You are a strict evaluator for "Ideary", which turns an AI brainstorming conversation into a structured "Eureka" — an honest post-mortem of a startup idea.

Score the EXTRACTION against the ORIGINAL CONVERSATION on each criterion from 1 to 5 (integers; 5 = excellent, 3 = acceptable, 1 = poor). Be discerning — reserve 5 for genuinely excellent output.

CRITERIA:
- faithfulness: Every claim traces to the conversation. No invented facts, numbers, or competitors.
- completeness: Captures the key reasoning — the case for, the case against, and the conclusion. Nothing important dropped.
- conciseness: Terse and punchy. No fluff, no padding, no repetition. Notebook-style, not essay-style.
- honesty: Preserves the real skepticism and verdict. A dead idea reads as dead; an alive idea as alive. No spin.
- statusAccuracy: The status (ACTIVE/PARKED/DEAD/REVISIT) matches where the conversation actually landed. For reference, the intended status here is "${conv.expectedStatus}".
- voice: Direct, first-person founder's-notebook tone. No marketing language, no hedging.

ORIGINAL CONVERSATION:
${conv.transcript}

EXTRACTION (JSON):
${JSON.stringify(extraction, null, 2)}

Return ONLY JSON:
{"faithfulness":n,"completeness":n,"conciseness":n,"honesty":n,"statusAccuracy":n,"voice":n,"notes":"one sentence on the biggest weakness"}`;

  const raw = await callGemini(judgePrompt, {
    model: JUDGE_MODEL,
    json: true,
    temperature: 0,
  });
  const parsed = parseJson<Partial<Scores>>(raw);
  const scores = { notes: parsed.notes ?? "" } as Scores;
  for (const c of CRITERIA) scores[c] = clamp(Number(parsed[c]));
  return scores;
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(5, n));
}

// ── Refine ────────────────────────────────────────────────────────────────────
async function refine(
  currentPrompt: string,
  iter: IterationResult,
): Promise<string> {
  const feedback = iter.results
    .map((r) => {
      const s = r.scores;
      const low = CRITERIA.filter((c) => s[c] <= 3)
        .map((c) => `${c}=${s[c]}`)
        .join(", ");
      return `• ${r.conv.id} (target ${r.conv.expectedStatus}): ${CRITERIA.map((c) => `${c} ${s[c]}`).join(", ")}\n  weak: ${low || "none"} — ${s.notes}`;
    })
    .join("\n");

  const refinePrompt = `You are improving an extraction prompt for "Ideary". The prompt turns an AI brainstorming conversation into a structured "Eureka" JSON. A judge scored its outputs and the average (${iter.avg.toFixed(2)}) is below the target of ${THRESHOLD}.

CURRENT PROMPT:
"""
${currentPrompt}
"""

JUDGE FEEDBACK PER TEST CASE (scores are 1-5):
${feedback}

Per-criterion averages: ${CRITERIA.map((c) => `${c} ${iter.perCriterion[c].toFixed(2)}`).join(", ")}

Rewrite the prompt to fix the weakest criteria. Keep what works. Be concrete about the failure modes the feedback reveals. You MUST keep the literal placeholder {{CONVERSATION}} exactly once where the transcript is injected, and keep the JSON output contract intact.

Return ONLY the improved prompt text — no commentary, no code fences.`;

  let next = await callGemini(refinePrompt, {
    model: REFINE_MODEL,
    temperature: 0.5,
  });
  next = next.trim();
  if (next.startsWith("```")) {
    next = next.replace(/^```[a-z]*\s*/i, "").replace(/```\s*$/, "").trim();
  }
  if (!next.includes("{{CONVERSATION}}")) {
    next += `\n\nCONVERSATION:\n{{CONVERSATION}}`;
  }
  return next;
}

// ── Aggregation ────────────────────────────────────────────────────────────────
function aggregate(
  iteration: number,
  prompt: string,
  results: ConvResult[],
): IterationResult {
  const perCriterion = {} as Record<Criterion, number>;
  for (const c of CRITERIA) {
    perCriterion[c] =
      results.reduce((sum, r) => sum + r.scores[c], 0) / results.length;
  }
  const avg =
    CRITERIA.reduce((sum, c) => sum + perCriterion[c], 0) / CRITERIA.length;
  return { iteration, prompt, results, avg, perCriterion };
}

// ── Report ─────────────────────────────────────────────────────────────────────
function buildReport(
  iterations: IterationResult[],
  winner: IterationResult,
  thresholdMet: boolean,
): string {
  const lines: string[] = [];
  lines.push("# Extraction Eval Results\n");
  lines.push(`_Generated: ${new Date().toISOString()}_\n`);
  lines.push(
    `- Extraction model: \`${EXTRACT_MODEL}\`\n- Judge model: \`${JUDGE_MODEL}\`\n- Threshold: ${THRESHOLD.toFixed(1)} · Max iterations: ${MAX_ITERATIONS}\n`,
  );
  lines.push(
    `**Outcome:** ${thresholdMet ? `✅ Threshold met` : `⚠️ Threshold not met — best prompt kept`} · Winning iteration **#${winner.iteration}** · avg **${winner.avg.toFixed(2)}**\n`,
  );

  lines.push("## Score progression\n");
  lines.push("| Iteration | " + CRITERIA.join(" | ") + " | **avg** |");
  lines.push("|" + "---|".repeat(CRITERIA.length + 2));
  for (const it of iterations) {
    lines.push(
      `| ${it.iteration} | ` +
        CRITERIA.map((c) => it.perCriterion[c].toFixed(2)).join(" | ") +
        ` | **${it.avg.toFixed(2)}** |`,
    );
  }
  lines.push("");

  for (const it of iterations) {
    lines.push(`## Iteration ${it.iteration} — avg ${it.avg.toFixed(2)}\n`);
    lines.push("| Test case | " + CRITERIA.join(" | ") + " | notes |");
    lines.push("|" + "---|".repeat(CRITERIA.length + 2));
    for (const r of it.results) {
      lines.push(
        `| ${r.conv.id} | ` +
          CRITERIA.map((c) => r.scores[c]).join(" | ") +
          ` | ${r.scores.notes.replace(/\|/g, "/")} |`,
      );
    }
    lines.push("");
    // Show the first extraction as a sample.
    const sample = it.results[0];
    lines.push(`<details><summary>Sample extraction (${sample.conv.id})</summary>\n`);
    lines.push("```json");
    lines.push(
      sample.extractionError
        ? `// ERROR: ${sample.extractionError}`
        : JSON.stringify(sample.extraction, null, 2),
    );
    lines.push("```\n</details>\n");
  }

  lines.push("## Winning prompt\n");
  lines.push("```text");
  lines.push(winner.prompt);
  lines.push("```");
  return lines.join("\n");
}

// ── Write winning prompt back to lib/extraction-prompt.ts ──────────────────────
function toTemplateLiteral(s: string): string {
  return (
    "`" +
    s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") +
    "`"
  );
}

function saveWinningPrompt(prompt: string): void {
  const file = `// The extraction prompt that converts a raw AI conversation into an Eureka.
// This file is overwritten by \`npm run eval\` with the highest-scoring prompt.
// {{CONVERSATION}} is replaced with the raw transcript at call time.

export const EXTRACTION_PROMPT = ${toTemplateLiteral(prompt)};
`;
  writeFileSync(join(process.cwd(), "lib/extraction-prompt.ts"), file, "utf8");
}

// ── Main loop ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🔬 Ideary extraction eval");
  console.log(
    `   ${TEST_CONVERSATIONS.length} test conversations · threshold ${THRESHOLD} · up to ${MAX_ITERATIONS} iterations\n`,
  );

  let currentPrompt = INITIAL_PROMPT;
  const iterations: IterationResult[] = [];
  let thresholdMet = false;

  for (let i = 1; i <= MAX_ITERATIONS; i++) {
    console.log(`━━━ Iteration ${i} ━━━`);

    const results: ConvResult[] = [];
    for (const conv of TEST_CONVERSATIONS) {
      process.stdout.write(`  • ${conv.id}: extracting… `);
      let extraction: unknown = null;
      let extractionError: string | undefined;
      try {
        extraction = await extract(currentPrompt, conv);
      } catch (err) {
        extractionError = err instanceof Error ? err.message : String(err);
      }

      let scores: Scores;
      if (extractionError) {
        process.stdout.write(`FAILED (${extractionError.slice(0, 60)})\n`);
        scores = { notes: `extraction failed: ${extractionError}` } as Scores;
        for (const c of CRITERIA) scores[c] = 1;
      } else {
        process.stdout.write(`judging… `);
        scores = await judge(conv, extraction);
        const avg =
          CRITERIA.reduce((s, c) => s + scores[c], 0) / CRITERIA.length;
        console.log(`avg ${avg.toFixed(2)}`);
      }
      results.push({ conv, extraction, extractionError, scores });
      await new Promise((r) => setTimeout(r, 3000)); // pace for free-tier RPM
    }

    const iter = aggregate(i, currentPrompt, results);
    iterations.push(iter);
    console.log(
      `  → iteration avg ${iter.avg.toFixed(2)}  [` +
        CRITERIA.map((c) => `${c[0]}:${iter.perCriterion[c].toFixed(1)}`).join(" ") +
        `]\n`,
    );

    if (iter.avg >= THRESHOLD) {
      thresholdMet = true;
      console.log(`✅ Threshold ${THRESHOLD} met at iteration ${i}.\n`);
      break;
    }
    if (i < MAX_ITERATIONS) {
      console.log(`  ↻ below threshold — refining prompt…\n`);
      currentPrompt = await refine(currentPrompt, iter);
    } else {
      console.log(`  ⚠️ max iterations reached without hitting threshold.\n`);
    }
  }

  // Winner = highest average across all iterations.
  const winner = iterations.reduce((best, it) =>
    it.avg > best.avg ? it : best,
  );

  saveWinningPrompt(winner.prompt);
  console.log(
    `💾 Saved winning prompt (iteration ${winner.iteration}, avg ${winner.avg.toFixed(2)}) → lib/extraction-prompt.ts`,
  );

  const report = buildReport(iterations, winner, thresholdMet);
  const reportPath = join(process.cwd(), "scripts/eval-results.md");
  writeFileSync(reportPath, report, "utf8");
  console.log(`📄 Wrote report → scripts/eval-results.md\n`);
}

main().catch((err) => {
  console.error("\n💥 Eval failed:", err);
  process.exit(1);
});
