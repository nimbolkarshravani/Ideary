import { config } from "dotenv";
config({ path: ".env.local" });

/**
 * End-to-end test for POST /api/eureka/import.
 *
 * 1. POST a mock conversation            → expect status "created"
 * 2. POST the SAME conversation_id again
 *    with one extra message              → expect status "updated", same id
 *
 * Requires the dev server running (npm run dev). Override the target with
 * IMPORT_URL, e.g. IMPORT_URL=https://your-app.vercel.app npm run test-import
 */

const BASE = process.env.IMPORT_URL ?? "http://localhost:3000";
const ENDPOINT = `${BASE}/api/eureka/import`;

// Unique per run so the first POST is always a fresh "created".
const conversationId = `test-${Date.now()}`;

const baseMessages = [
  {
    role: "user" as const,
    content:
      "Idea: SnipReview. A tool that watches your GitHub PRs and posts a 3-bullet plain-English summary of what changed, aimed at non-technical stakeholders who need to follow product progress.",
  },
  {
    role: "assistant" as const,
    content:
      "Who's the buyer, and how is this different from just reading the PR description?",
  },
  {
    role: "user" as const,
    content:
      "Buyer is a head of product at a 20-50 person startup. PR descriptions are written for engineers; this translates them for PMs and founders. Differentiation is the audience-targeting, not the summarization itself.",
  },
  {
    role: "assistant" as const,
    content:
      "The risk is that LLM summaries of diffs are commoditized. Your moat has to be the translation quality and the workflow integration, not the raw summary. Worth building a quick prototype to test whether non-technical readers actually find it useful.",
  },
  {
    role: "user" as const,
    content:
      "Agreed. I'll build a Slack bot prototype this weekend and test it with two founder friends.",
  },
];

const extraMessage = {
  role: "user" as const,
  content:
    "Update: one founder said they'd pay $20/month immediately. Pricing signal is encouraging. Definitely moving forward.",
};

async function post(messages: typeof baseMessages) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "claude",
      conversation_id: conversationId,
      messages,
    }),
  });
  const json = await res.json().catch(() => ({}));
  return { httpStatus: res.status, body: json };
}

async function main() {
  console.log("─".repeat(60));
  console.log(`POST 1 (create)  → ${ENDPOINT}`);
  console.log(`conversation_id: ${conversationId}`);
  const first = await post(baseMessages);
  console.log("HTTP", first.httpStatus, JSON.stringify(first.body));

  console.log("\nPOST 2 (re-import, +1 message → update)");
  const second = await post([...baseMessages, extraMessage]);
  console.log("HTTP", second.httpStatus, JSON.stringify(second.body));
  console.log("─".repeat(60));

  // Assertions
  const problems: string[] = [];
  if (first.body.status !== "created")
    problems.push(`expected first status "created", got "${first.body.status}"`);
  if (second.body.status !== "updated")
    problems.push(`expected second status "updated", got "${second.body.status}"`);
  if (
    first.body.eureka_id &&
    second.body.eureka_id &&
    first.body.eureka_id !== second.body.eureka_id
  )
    problems.push(
      `expected same eureka_id, got ${first.body.eureka_id} vs ${second.body.eureka_id}`,
    );

  if (problems.length === 0) {
    console.log("✅ PASS — created then updated, same eureka_id, no duplicate.");
  } else {
    console.log("❌ FAIL");
    for (const p of problems) console.log("   - " + p);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("test-import failed to run:", err);
  process.exit(1);
});
