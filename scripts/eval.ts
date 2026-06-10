import { config } from "dotenv";
config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";
import { TEST_CONVERSATIONS, type TestConversation } from "./test-conversations";

const API_KEY = process.env.GEMINI_API_KEY!;
const MODEL = "gemini-2.5-flash";
const MAX_ITERATIONS = 4;
const PASS_THRESHOLD = 4.0;

// ── Types ─────────────────────────────────────────────────────────────────────

interface ExtractionOutput {
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

interface EvalScore {
  faithfulness: number;
  completeness: number;
  conciseness: number;
  honesty: number;
  status_accuracy: number;
  voice: number;
  average: number;
  feedback: string;
}

interface IterationResult {
  iteration: number;
  prompt: string;
  scores: { conv: TestConversation; extraction: ExtractionOutput; score: EvalScore }[];
  avgScore: number;
}

// ── Gemini call ───────────────────────────────────────────────────────────────

async function callGemini(prompt: string, thinkingBudget = 512): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      thinkingConfig: { thinkingBudget },
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 300)}`);
  }

  const data = await res.json() as any;
  const parts: any[] = data.candidates[0].content.parts;
  const textPart = parts.find((p) => !p.thought) ?? parts[parts.length - 1];
  return textPart.text as string;
}

function extractJson(raw: string): any {
  // Strip markdown code fences if present
  const stripped = raw.replace(/^```(?:json)?\s*/m, "").replace(/\s*```\s*$/m, "").trim();
  return JSON.parse(stripped);
}

// ── Extraction ────────────────────────────────────────────────────────────────

async function extractEureka(
  prompt: string,
  conversation: string,
): Promise<ExtractionOutput> {
  const full = `${prompt}

--- CONVERSATION ---
${conversation}
--- END CONVERSATION ---

Output only valid JSON. No markdown fences, no explanation.`;

  const raw = await callGemini(full, 1024);
  return extractJson(raw) as ExtractionOutput;
}

// ── Scoring ───────────────────────────────────────────────────────────────────

async function scoreExtraction(
  conv: TestConversation,
  extraction: ExtractionOutput,
): Promise<EvalScore> {
  const scoringPrompt = `You are evaluating an extraction from a startup idea conversation for a personal journal called Ideary.

ORIGINAL CONVERSATION:
${conv.text}

EXTRACTED OUTPUT:
${JSON.stringify(extraction, null, 2)}

GOLD ANNOTATIONS:
- Expected status: ${conv.gold.status}
- Must capture: ${conv.gold.must_capture.join("; ")}
- Must NOT hallucinate: ${conv.gold.must_not_hallucinate.join("; ")}

Score each criterion 1-5 (5 = perfect):

FAITHFULNESS (1-5): Does the extraction only contain claims actually made in the conversation? No invented numbers, stats, or competitor names?

COMPLETENESS (1-5): Are the key arguments from must_capture represented in some form?

CONCISENESS (1-5): Are bullets under 20 words? Is the one_liner tight? No filler or corporate speak?

HONESTY (1-5): Are negatives and risks represented fairly without softening?

STATUS_ACCURACY (1-5): Does the inferred status match the expected "${conv.gold.status}" given conversation tone?

VOICE (1-5): Is the writing direct, startup-smart, second-person where appropriate? No "leveraging synergies" type language?

Output ONLY this JSON (no explanation, no markdown):
{
  "faithfulness": <1-5>,
  "faithfulness_reason": "<one sentence>",
  "completeness": <1-5>,
  "completeness_reason": "<one sentence>",
  "conciseness": <1-5>,
  "conciseness_reason": "<one sentence>",
  "honesty": <1-5>,
  "honesty_reason": "<one sentence>",
  "status_accuracy": <1-5>,
  "status_accuracy_reason": "<one sentence>",
  "voice": <1-5>,
  "voice_reason": "<one sentence>",
  "overall_feedback": "<2-3 sentences: what specifically needs to improve>"
}`;

  const raw = await callGemini(scoringPrompt, 256);
  const parsed = extractJson(raw);

  const avg =
    (parsed.faithfulness +
      parsed.completeness +
      parsed.conciseness +
      parsed.honesty +
      parsed.status_accuracy +
      parsed.voice) /
    6;

  return {
    faithfulness: parsed.faithfulness,
    completeness: parsed.completeness,
    conciseness: parsed.conciseness,
    honesty: parsed.honesty,
    status_accuracy: parsed.status_accuracy,
    voice: parsed.voice,
    average: Math.round(avg * 100) / 100,
    feedback: parsed.overall_feedback,
  };
}

// ── Prompt refinement ─────────────────────────────────────────────────────────

async function refinePrompt(
  currentPrompt: string,
  results: IterationResult["scores"],
): Promise<string> {
  const failureSummary = results
    .map(
      (r) =>
        `Conversation: ${r.conv.title}
Scores: faithfulness=${r.score.faithfulness} completeness=${r.score.completeness} conciseness=${r.score.conciseness} honesty=${r.score.honesty} status_accuracy=${r.score.status_accuracy} voice=${r.score.voice} avg=${r.score.average}
Feedback: ${r.score.feedback}
Extraction title: "${r.extraction.title}", status: "${r.extraction.status}"`,
    )
    .join("\n\n");

  const refinementPrompt = `You are improving an extraction prompt for Ideary, a personal startup idea journal.

CURRENT PROMPT:
${currentPrompt}

EVALUATION RESULTS FROM CURRENT PROMPT:
${failureSummary}

Analyze the failure patterns across these results and produce an improved prompt that:
1. Addresses the specific weaknesses noted in the feedback
2. Keeps the parts that scored well
3. Is clear and specific about what needs to change

Output ONLY the improved prompt text (no explanation, no "Here is the improved prompt:" prefix).`;

  return callGemini(refinementPrompt, 1024);
}

// ── Initial extraction prompt ─────────────────────────────────────────────────

const INITIAL_PROMPT = `You are an extraction assistant for Ideary — a personal startup idea journal. Your job is to read a founder's brainstorming conversation and extract a structured Eureka entry.

OUTPUT FORMAT (JSON only):
{
  "title": "2-4 word name for the idea",
  "one_liner": "One tight sentence: what it is + the core angle (under 15 words)",
  "status": "active" | "parked" | "dead" | "revisit",
  "tags": ["2-5 tags: domain, audience, risk profile"],
  "spark": "The original insight or problem that sparked this (1-2 sentences). Null if not stated.",
  "case_for": ["3-5 bullets: strongest reasons this could work. Punchy, specific, under 20 words each. Null if not discussed."],
  "case_against": ["3-5 bullets: strongest reasons this might fail. Honest, no softening, under 20 words each. Null if not discussed."],
  "key_insight": "The single most important insight that reframes the whole idea (1 sentence). Null if none.",
  "verdict": "1-2 punchy sentences: what the conversation concluded. Null if no conclusion.",
  "revisit_if": "Specific conditions that would change the verdict. Null if not stated.",
  "what_youd_need": ["Concrete requirements to actually build or validate. Null if not discussed."],
  "next_step": "Single most important next action if mentioned. Null if not stated.",
  "at_a_glance": [{"label": "X", "value": "Y"}]
}

STATUS RULES:
- "active": founder is energized, no fatal blockers, clear next steps discussed
- "parked": interesting idea but timing, resources, or a specific problem needs solving first
- "dead": fatal flaw found — legal, competitive, technical, or economic
- "revisit": explicitly waiting for a specific external condition to change

VOICE RULES:
- Bullets under 20 words. No leading bullet characters or dashes in the text.
- Direct and honest. Don't soften bad news.
- Startup-smart: assume the reader understands markets, unit economics, competition.
- Use second person ("you", "your") for personal notes where natural.
- No corporate speak.

FAITHFULNESS RULES:
- Only extract claims that appear in the conversation.
- Never invent numbers, competitor names, or market data not explicitly mentioned.
- If the founder didn't discuss something, use null — don't fill gaps with guesses.`;

// ── Main eval loop ────────────────────────────────────────────────────────────

async function main() {
  console.log("═".repeat(60));
  console.log("  Ideary Extraction Eval — Gemini 2.5 Flash");
  console.log("═".repeat(60));
  console.log(`  Conversations: ${TEST_CONVERSATIONS.length}`);
  console.log(`  Max iterations: ${MAX_ITERATIONS}`);
  console.log(`  Pass threshold: ${PASS_THRESHOLD}/5.0`);
  console.log("═".repeat(60));

  const allIterations: IterationResult[] = [];
  let currentPrompt = INITIAL_PROMPT;
  let bestIteration: IterationResult | null = null;

  for (let iter = 1; iter <= MAX_ITERATIONS; iter++) {
    console.log(`\n▶ ITERATION ${iter}/${MAX_ITERATIONS}`);
    console.log("─".repeat(40));

    const iterScores: IterationResult["scores"] = [];

    for (const conv of TEST_CONVERSATIONS) {
      process.stdout.write(`  Extracting: ${conv.title} ... `);
      const extraction = await extractEureka(currentPrompt, conv.text);
      process.stdout.write(`done\n`);

      process.stdout.write(`  Scoring:    ${conv.title} ... `);
      const score = await scoreExtraction(conv, extraction);
      process.stdout.write(`done (avg ${score.average})\n`);

      iterScores.push({ conv, extraction, score });

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 500));
    }

    const avgScore =
      Math.round(
        (iterScores.reduce((s, r) => s + r.score.average, 0) / iterScores.length) * 100,
      ) / 100;

    const result: IterationResult = {
      iteration: iter,
      prompt: currentPrompt,
      scores: iterScores,
      avgScore,
    };
    allIterations.push(result);

    if (!bestIteration || avgScore > bestIteration.avgScore) {
      bestIteration = result;
    }

    console.log(`\n  📊 Iteration ${iter} avg score: ${avgScore}/5.0`);
    for (const r of iterScores) {
      console.log(
        `     ${r.conv.title.padEnd(22)} faith=${r.score.faithfulness} comp=${r.score.completeness} conc=${r.score.conciseness} honest=${r.score.honesty} status=${r.score.status_accuracy} voice=${r.score.voice} → ${r.score.average}`,
      );
    }

    if (avgScore >= PASS_THRESHOLD) {
      console.log(`\n  ✅ Passed threshold (${avgScore} ≥ ${PASS_THRESHOLD}). Stopping.`);
      break;
    }

    if (iter < MAX_ITERATIONS) {
      console.log(`\n  ↻  Score ${avgScore} < ${PASS_THRESHOLD}. Refining prompt...`);
      currentPrompt = await refinePrompt(currentPrompt, iterScores);
      console.log(`  Prompt refined (${currentPrompt.length} chars).`);
      await new Promise((r) => setTimeout(r, 500));
    } else {
      console.log(`\n  ⚠️  Max iterations reached. Best score: ${bestIteration!.avgScore}`);
    }
  }

  // ── Save winning prompt ───────────────────────────────────────────────────

  const winningPrompt = bestIteration!.prompt;
  const promptTs = `// Auto-generated by scripts/eval.ts — best avg score: ${bestIteration!.avgScore}/5.0
export const EXTRACTION_PROMPT = ${JSON.stringify(winningPrompt)};
`;
  fs.writeFileSync(path.join(__dirname, "../lib/extraction-prompt.ts"), promptTs, "utf-8");
  console.log("\n  💾 Winning prompt saved to lib/extraction-prompt.ts");

  // ── Write eval-results.md ─────────────────────────────────────────────────

  const lines: string[] = [
    "# Extraction Eval Results",
    "",
    `**Model:** ${MODEL}  `,
    `**Date:** ${new Date().toISOString().slice(0, 10)}  `,
    `**Conversations:** ${TEST_CONVERSATIONS.length}  `,
    `**Iterations run:** ${allIterations.length}  `,
    `**Best avg score:** ${bestIteration!.avgScore}/5.0  `,
    `**Passed threshold (${PASS_THRESHOLD}):** ${bestIteration!.avgScore >= PASS_THRESHOLD ? "Yes" : "No"}`,
    "",
    "---",
    "",
  ];

  for (const iter of allIterations) {
    lines.push(`## Iteration ${iter.iteration} — avg ${iter.avgScore}/5.0`);
    lines.push("");

    for (const r of iter.scores) {
      lines.push(`### ${r.conv.title} (${r.score.average}/5.0)`);
      lines.push("");
      lines.push("**Scores:**");
      lines.push(`| Criterion | Score | Reason |`);
      lines.push(`|-----------|-------|--------|`);

      const criteria = [
        "faithfulness",
        "completeness",
        "conciseness",
        "honesty",
        "status_accuracy",
        "voice",
      ] as const;

      for (const c of criteria) {
        const scoreVal = r.score[c];
        const reasonKey = `${c}_reason` as keyof typeof r.score;
        lines.push(`| ${c} | ${scoreVal} | — |`);
      }

      lines.push("");
      lines.push(`**Feedback:** ${r.score.feedback}`);
      lines.push("");
      lines.push(`**Extracted:**`);
      lines.push("```json");
      lines.push(JSON.stringify(r.extraction, null, 2));
      lines.push("```");
      lines.push("");
    }

    lines.push("---");
    lines.push("");
  }

  lines.push("## Winning Prompt");
  lines.push("");
  lines.push("```");
  lines.push(winningPrompt);
  lines.push("```");

  const mdPath = path.join(__dirname, "eval-results.md");
  fs.writeFileSync(mdPath, lines.join("\n"), "utf-8");
  console.log("  📄 Results written to scripts/eval-results.md");
  console.log("\n" + "═".repeat(60));
  console.log(`  Done. Best score: ${bestIteration!.avgScore}/5.0 (iteration ${bestIteration!.iteration})`);
  console.log("═".repeat(60) + "\n");
}

main().catch((err) => {
  console.error("Eval failed:", err);
  process.exit(1);
});
