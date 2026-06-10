# Extraction Eval Results

**Model:** gemini-2.5-flash  
**Date:** 2026-06-10  
**Conversations:** 3  
**Iterations run:** 1  
**Best avg score:** 4.89/5.0  
**Passed threshold (4):** Yes

---

## Iteration 1 — avg 4.89/5.0

### PairNotes (4.83/5.0)

**Scores:**
| Criterion | Score | Reason |
|-----------|-------|--------|
| faithfulness | 5 | — |
| completeness | 5 | — |
| conciseness | 4 | — |
| honesty | 5 | — |
| status_accuracy | 5 | — |
| voice | 5 | — |

**Feedback:** The extraction is excellent, accurately capturing all critical aspects of the conversation in a well-structured and concise format. The 'what_youd_need' section could be slightly more concise, but this is a minor point. This output is ready for the Ideary.

**Extracted:**
```json
{
  "title": "PairNotes",
  "one_liner": "An app for couples to share daily voice notes, AI-summarized for a relationship journal.",
  "status": "parked",
  "tags": [
    "relationship tech",
    "couples",
    "AI",
    "communication",
    "subscription"
  ],
  "spark": "Existing voice notes get buried. This app aims to create intentional, daily relationship memories through async voice communication.",
  "case_for": [
    "Creates searchable relationship memories.",
    "Keeps busy couples connected daily.",
    "Unique voice plus AI summary angle.",
    "Large market for relationship apps.",
    "Privacy as a strong competitive moat."
  ],
  "case_against": [
    "Requires consistent dual partner engagement.",
    "One partner forgetting breaks the loop.",
    "AI summaries must be excellent, not gimmicky.",
    "Storing intimate data poses high privacy risk."
  ],
  "key_insight": "Strong privacy handling, like local processing, can turn a data risk into a core product feature.",
  "verdict": "The idea is parked. A clever solution for the dual engagement problem is needed before committing.",
  "revisit_if": "When a robust solution for the dual engagement mechanic is identified.",
  "what_youd_need": [
    "A clever solution for dual engagement."
  ],
  "next_step": "Validate core habit with a shared voice memo MVP.",
  "at_a_glance": [
    {
      "label": "Revenue Model",
      "value": "$8/month per couple"
    },
    {
      "label": "Target User",
      "value": "Busy couples"
    }
  ]
}
```

### APIWatch (4.83/5.0)

**Scores:**
| Criterion | Score | Reason |
|-----------|-------|--------|
| faithfulness | 5 | — |
| completeness | 5 | — |
| conciseness | 4 | — |
| honesty | 5 | — |
| status_accuracy | 5 | — |
| voice | 5 | — |

**Feedback:** This is a very strong extraction, capturing all critical details and nuances from the conversation. The structure is logical and the language is appropriate for an Ideary journal. Minor improvements could focus on slightly shortening a few bullet points for maximum conciseness.

**Extracted:**
```json
{
  "title": "Third-Party API Watch",
  "one_liner": "Zero-config monitoring for third-party API dependencies, detecting real-traffic anomalies.",
  "status": "active",
  "tags": [
    "API monitoring",
    "DevOps",
    "SaaS",
    "Reliability",
    "B2B"
  ],
  "spark": "Teams learn about third-party API incidents from angry customers, not monitoring. Existing solutions are manual or require custom setup.",
  "case_for": [
    "Addresses a consistent blind spot for engineering teams.",
    "Zero-config setup simplifies adoption versus competitors.",
    "Clear buyer: VPs/CTOs already spending on reliability.",
    "Existing solutions don't focus on passive real-traffic."
  ],
  "case_against": [
    "Crowdsourced data creates a chicken-and-egg problem.",
    "Detection quality suffers for early customers without benchmarks."
  ],
  "key_insight": "The core challenge is distinguishing global API slowness from specific customer issues, requiring benchmark data.",
  "verdict": "This addresses a real, underserved market gap. The next step is customer validation.",
  "revisit_if": null,
  "what_youd_need": [
    "Connect to AWS or GCP logs.",
    "Detect third-party API calls from logs.",
    "Anomaly detection for latency spikes and error rates.",
    "Benchmark data from public feeds or crowdsourcing."
  ],
  "next_step": "Talk to 10 engineering leads this month to validate the problem.",
  "at_a_glance": [
    {
      "label": "Target Buyer",
      "value": "VP Eng / CTO (Series A-C)"
    },
    {
      "label": "Key Differentiator",
      "value": "Zero-config, real-traffic anomaly detection"
    },
    {
      "label": "Moat",
      "value": "Crowdsourced benchmark data"
    },
    {
      "label": "Validation Metric",
      "value": "7/10 leads confirm problem"
    }
  ]
}
```

### LocalStack Finder (5/5.0)

**Scores:**
| Criterion | Score | Reason |
|-----------|-------|--------|
| faithfulness | 5 | — |
| completeness | 5 | — |
| conciseness | 5 | — |
| honesty | 5 | — |
| status_accuracy | 5 | — |
| voice | 5 | — |

**Feedback:** This is an excellent extraction that perfectly captures the essence of the conversation. It is faithful, complete, concise, and accurately reflects the status and reasons for the idea's outcome. No specific improvements are needed; it serves as a strong example.

**Extracted:**
```json
{
  "title": "LocalStack Health Dashboard",
  "one_liner": "A free dashboard to diagnose LocalStack service health and configuration issues.",
  "status": "dead",
  "tags": [
    "Developer Tools",
    "AWS",
    "LocalStack",
    "Open Source"
  ],
  "spark": "It's unclear which LocalStack services are configured, partially working, or broken during development.",
  "case_for": [
    "Every developer using LocalStack complains about this issue.",
    "It would be free, unlike LocalStack Pro's paid features.",
    "Addresses a clear diagnostic pain point for developers."
  ],
  "case_against": [
    "No clear monetization path for a startup business.",
    "Directly overlaps with LocalStack Pro's existing paid monitoring.",
    "Likely scratching your own itch, not a broad market need."
  ],
  "key_insight": "This is an open-source project, not a viable startup product.",
  "verdict": "This is not a business idea. It's better suited as an open-source script to solve a personal pain point.",
  "revisit_if": "If the open-source project gains significant traction and reveals deeper developer needs.",
  "what_youd_need": [
    "A Python script to gather LocalStack diagnostics.",
    "A GitHub repository for hosting and sharing the tool."
  ],
  "next_step": "Build the diagnostic script and publish it on GitHub.",
  "at_a_glance": [
    {
      "label": "Monetization",
      "value": "None"
    },
    {
      "label": "Competition",
      "value": "LocalStack Pro"
    },
    {
      "label": "Scope",
      "value": "Open Source Project"
    },
    {
      "label": "Audience",
      "value": "LocalStack Developers"
    }
  ]
}
```

---

## Winning Prompt

```
You are an extraction assistant for Ideary — a personal startup idea journal. Your job is to read a founder's brainstorming conversation and extract a structured Eureka entry.

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
- If the founder didn't discuss something, use null — don't fill gaps with guesses.
```