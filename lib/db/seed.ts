import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import type { DbInsert } from "./eurekas";

// Seed creates its own client so it's usable as a standalone script
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
);

const SEED_DATA: DbInsert[] = [
  {
    title: "AI Video Tutor",
    one_liner: "On-demand video teaching with pause-and-ask interactivity",
    status: "parked",
    tags: ["EdTech", "Consumer", "AI-Agents", "Solo-hard"],
    source_conversation: "https://claude.ai/chat/",
    spark: null,
    case_for: [
      "Text AI tutoring leaves learning value on the table",
      "Pause-and-ask is closer to real tutoring than video or chat",
      "Genuine differentiation from ChatGPT, Khan Academy",
    ],
    case_against: [
      "Video generation is slow, expensive, inaccurate today",
      "Per-session costs likely exceed user willingness to pay",
      "Khanmigo, LearnLM, Synthesis already in the space",
    ],
    key_insight: null,
    verdict: "Right vision, wrong time for a solo builder.",
    revisit_if: "Video generation costs drop 10x, or you commit to a specific vertical.",
    what_youd_need: null,
    numbers: null,
    next_step: null,
    at_a_glance: null,
    custom_notes: [
      {
        kind: "bullets",
        heading: "OPEN QUESTIONS",
        bulletKind: "question",
        items: [
          "Could Manim-style code animations replace video generation?",
          "Is a narrow vertical (JEE physics?) the real wedge?",
        ],
      },
    ],
  },
  {
    title: "Shield / Shegram",
    one_liner:
      "A verified women-only community app for female creators to document harassment and build solidarity",
    status: "dead",
    tags: ["Consumer", "Social", "Women-Safety", "India", "High-Risk"],
    source_conversation: null,
    spark:
      "Female creators generate massive value on Instagram — 77% of influencers are women, driving billions in revenue — while being systematically failed by the platform's safety mechanisms. The idea was to build the safety infrastructure Instagram refuses to provide.",
    case_for: [
      "The problem is real and quantifiable: Instagram failed to act on 90–93% of abuse reports from women. 38% of women globally have experienced online violence.",
      "No direct competitor exists with the specific combination of verified creators, witness system, and coordinated reporting. Peanut exists for women but not specifically for creators or harassment.",
      "India market is underserved: 67.2% male Instagram userbase means Indian female creators face disproportionate harassment in the largest Instagram market globally.",
      "The permission architecture (verified creators post, supporters comment, witness separated from support) resolves real legal and social tensions.",
    ],
    case_against: [
      "Legal liability is fatal for a solo founder. Coordinating mass reports against named individuals exposes the platform to defamation suits — the reported party sues you, not Instagram.",
      "Report-bombing risk: the exact feature meant to protect women can be weaponized. Trolls join as fake supporters, mass-report innocent people, platform becomes a harassment tool.",
      "Harassment database paradox: a public feed of female creators' experiences becomes a goldmine for coordinated harassment groups to find and target the same women.",
      "Moderation at scale is brutally expensive and causes severe secondary trauma. Cannot be run on volunteers sustainably.",
      "No viable revenue model. Ads incompatible with trauma content. Subscriptions create barriers for those who need it most.",
    ],
    key_insight:
      "The harassment problem was the emotional core of the idea, but the community was always the actual product. A safety-focused platform hits legal minefields; a community-focused platform for female creators doesn't.",
    verdict:
      "Abandoned — legal risk isn't worth it for a solo founder without legal counsel and significant capital.",
    revisit_if:
      "Access to a cyber law attorney on retainer\n₹50L+ in funding or grant money for moderation and legal infrastructure\nScope shifts to pure community (no harassment documentation, no coordinated reporting)",
    what_youd_need: [
      "Legal counsel (cyber law, India-specific) before writing any code",
      "50+ verified female creators committed pre-launch",
      "Grant funding from orgs like UN Women or Equality Now",
      "Full-time paid, trained moderation team with mental health support",
      "Alternative: lightweight community-only version sidesteps most of this",
    ],
    numbers: null,
    next_step: null,
    at_a_glance: [
      { label: "Capital", value: "Massive" },
      { label: "Time to build", value: "Year+" },
      { label: "Fit for you", value: "Weak" },
    ],
    custom_notes: null,
  },
];

async function seed() {
  console.log("Seeding eurekas...");

  const { error } = await supabase.from("eurekas").insert(SEED_DATA);

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Inserted ${SEED_DATA.length} eurekas.`);
}

seed();
