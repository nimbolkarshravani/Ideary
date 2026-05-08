import type { Eureka } from "@/lib/types/eureka";

export const EUREKAS: Eureka[] = [
  {
    id: "ai-video-tutor",
    title: "AI Video Tutor",
    oneLiner: "On-demand video teaching with pause-and-ask interactivity",
    status: "PARKED",
    tags: ["EdTech", "Consumer", "AI-Agents", "Solo-hard"],
    capturedDate: "Apr 24, 2026",
    rotate: -1.2,
    sections: [
      {
        kind: "bullets",
        heading: "WHY IT COULD WORK",
        bulletKind: "arrow",
        items: [
          "Text AI tutoring leaves learning value on the table",
          "Pause-and-ask is closer to real tutoring than video or chat",
          "Genuine differentiation from ChatGPT, Khan Academy",
        ],
      },
      {
        kind: "bullets",
        heading: "WHY IT MIGHT NOT",
        bulletKind: "x",
        items: [
          "Video generation is slow, expensive, inaccurate today",
          "Per-session costs likely exceed user willingness to pay",
          "Khanmigo, LearnLM, Synthesis already in the space",
        ],
      },
      {
        kind: "bullets",
        heading: "OPEN QUESTIONS",
        bulletKind: "question",
        items: [
          "Could Manim-style code animations replace video generation?",
          "Is a narrow vertical (JEE physics?) the real wedge?",
        ],
      },
      {
        kind: "prose",
        heading: "VERDICT",
        text: "Right vision, wrong time for a solo builder.",
      },
      {
        kind: "prose",
        heading: "REVISIT IF",
        text: "Video generation costs drop 10x, or you commit to a specific vertical.",
      },
    ],
    quotes: [
      {
        text: "Video generation is a research problem, not an engineering one",
        highlight: "yellow",
        rotate: -1.5,
        marginTop: 0,
      },
      {
        text: "The winners won't be the ones with clever tech — they'll be the ones who owned a specific niche",
        highlight: "pink",
        rotate: 1.2,
        marginTop: 16,
      },
      {
        text: "This is the graveyard that killed most AI video-tutor startups",
        highlight: "green",
        rotate: -0.8,
        marginTop: 16,
      },
    ],
  },
  {
    id: "shield",
    title: "Shield / Shegram",
    oneLiner:
      "A verified women-only community app for female creators to document harassment and build solidarity",
    status: "DEAD",
    tags: ["Consumer", "Social", "Women-Safety", "India", "High-Risk"],
    capturedDate: "Apr 3, 2025",
    rotate: 1.5,
    sections: [
      {
        kind: "prose",
        heading: "SPARK",
        text: "Female creators generate massive value on Instagram — 77% of influencers are women, driving billions in revenue — while being systematically failed by the platform's safety mechanisms. The idea was to build the safety infrastructure Instagram refuses to provide.",
      },
      {
        kind: "bullets",
        heading: "CASE FOR",
        bulletKind: "arrow",
        items: [
          "The problem is real and quantifiable: Instagram failed to act on 90–93% of abuse reports from women. 38% of women globally have experienced online violence.",
          "No direct competitor exists with the specific combination of verified creators, witness system, and coordinated reporting. Peanut exists for women but not specifically for creators or harassment.",
          "India market is underserved: 67.2% male Instagram userbase means Indian female creators face disproportionate harassment in the largest Instagram market globally.",
          "The permission architecture (verified creators post, supporters comment, witness separated from support) resolves real legal and social tensions.",
        ],
      },
      {
        kind: "bullets",
        heading: "CASE AGAINST",
        bulletKind: "x",
        items: [
          "Legal liability is fatal for a solo founder. Coordinating mass reports against named individuals exposes the platform to defamation suits — the reported party sues you, not Instagram.",
          "Report-bombing risk: the exact feature meant to protect women can be weaponized. Trolls join as fake supporters, mass-report innocent people, platform becomes a harassment tool.",
          "Harassment database paradox: a public feed of female creators' experiences becomes a goldmine for coordinated harassment groups to find and target the same women.",
          "Moderation at scale is brutally expensive and causes severe secondary trauma. Cannot be run on volunteers sustainably.",
          "No viable revenue model. Ads incompatible with trauma content. Subscriptions create barriers for those who need it most.",
        ],
      },
      {
        kind: "highlight",
        heading: "KEY INSIGHT",
        text: "The harassment problem was the emotional core of the idea, but the community was always the actual product. A safety-focused platform hits legal minefields; a community-focused platform for female creators doesn't.",
      },
      {
        kind: "prose",
        heading: "VERDICT",
        text: "Abandoned — legal risk isn't worth it for a solo founder without legal counsel and significant capital.",
      },
      {
        kind: "bullets",
        heading: "REVISIT IF",
        bulletKind: "dot",
        items: [
          "Access to a cyber law attorney on retainer",
          "₹50L+ in funding or grant money for moderation and legal infrastructure",
          "Scope shifts to pure community (no harassment documentation, no coordinated reporting)",
        ],
      },
      {
        kind: "bullets",
        heading: "WHAT YOU'D NEED",
        bulletKind: "dot",
        column: "right",
        items: [
          "Legal counsel (cyber law, India-specific) before writing any code",
          "50+ verified female creators committed pre-launch",
          "Grant funding from orgs like UN Women or Equality Now",
          "Full-time paid, trained moderation team with mental health support",
          "Alternative: lightweight community-only version sidesteps most of this",
        ],
      },
      {
        kind: "glance",
        heading: "AT A GLANCE",
        column: "right",
        rows: [
          { label: "Capital", value: "Massive" },
          { label: "Time to build", value: "Year+" },
          { label: "Fit for you", value: "Weak" },
        ],
      },
    ],
  },
];

export function getEureka(id: string): Eureka | undefined {
  return EUREKAS.find((e) => e.id === id);
}
