# Extraction Eval Results

**Model:** gemini-2.5-flash  
**Date:** 2026-06-17  
**Conversations:** 3  
**Iterations run:** 1  
**Best avg score:** 4.83/5.0  
**Passed threshold (4):** Yes

---

## Iteration 1 — avg 4.83/5.0

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

**Feedback:** This is an excellent extraction that captures the essence of the conversation accurately and comprehensively. The only minor area for improvement would be to slightly tighten a couple of the longer bullet points in 'why_it_could_work' and 'why_it_might_not' to ensure maximum conciseness.

**Extracted:**
```json
{
  "title": "PairNotes",
  "one_liner": "App for couples to share daily voice notes, summarized by AI into a shared journal.",
  "status": "parked",
  "tags": [
    "relationships",
    "couples",
    "asynchronous communication",
    "consumer app"
  ],
  "spark": "WhatsApp voice notes get buried; couples lack an intentional, daily, async way to build shared relationship memories.",
  "why_it_could_work": [
    "Creates a persistent, searchable 'relationship memory' from daily interactions, helping couples remember anniversaries and notice patterns.",
    "Offers an intentional, daily connection point for busy, working couples who lack time for extensive conversations.",
    "Unique combination of voice notes and AI summaries differentiates it from existing private messaging apps for couples like Couple or Between.",
    "Viable premium subscription model ($8/month per couple) in a potentially large market.",
    "Strong privacy handling (local processing, no cloud storage of raw audio) could become a significant competitive moat."
  ],
  "why_it_might_not": [
    "Requires consistent dual engagement from both partners; if one person stops recording, the entire value proposition collapses.",
    "AI summaries must be exceptionally high quality to avoid feeling gimmicky and to truly provide value.",
    "Handling intimate relationship data raises significant privacy and security risks; a breach could be fatal.",
    "The core habit of daily voice notes might be difficult to establish and maintain for both partners."
  ],
  "key_insight": "The dual engagement problem is critical and needs a clever solution, as the entire concept collapses if one partner disengages.",
  "verdict": "This idea is parked until a robust solution for the dual engagement problem can be figured out.",
  "revisit_if": "A clever mechanic to ensure consistent dual engagement is identified and validated.",
  "next_step": "Think more about the engagement mechanic, perhaps by validating a minimum viable version as a shared voice memo folder without AI."
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

**Feedback:** This is an excellent extraction that captures the essence of the startup idea very well. To improve further, focus on making all bullet points under 20 words where possible, especially in the 'why_it_could_work' and 'key_insight' sections, for maximum conciseness.

**Extracted:**
```json
{
  "title": "Third-Party API Watch",
  "one_liner": "A zero-config service automatically monitoring third-party API dependencies for performance anomalies.",
  "status": "exploring",
  "tags": [
    "API Monitoring",
    "DevOps",
    "B2B SaaS",
    "Reliability"
  ],
  "spark": "Teams currently find out about third-party API incidents from angry customer emails, not proactive monitoring, as existing internal tools don't specifically watch external dependencies for performance anomalies.",
  "why_it_could_work": [
    "It addresses a consistent blind spot for VPs of Engineering and CTOs at Series A-C companies who are already investing in reliability tooling.",
    "The zero-config approach differentiates it from existing solutions like Datadog, which require extensive custom setup for each API.",
    "A crowdsourced benchmark for third-party API performance creates a strong defensibility and improves detection quality significantly after initial customer adoption.",
    "Current competitors like Gremlin and Catchpoint don't focus on passive, real-traffic anomaly detection specifically for third-party APIs."
  ],
  "why_it_might_not": [
    "The core crowdsourcing moat presents a classic chicken-and-egg problem, as early customers will experience worse detection quality due to limited benchmark data.",
    "The technical challenge of distinguishing global API slowness from specific customer issues requires robust, aggregated benchmark data, which is hard to acquire initially."
  ],
  "key_insight": "The pivotal realization is that a crowdsourced benchmark of third-party API performance is both the hardest technical problem to solve and the ultimate defensibility for accurate, zero-config anomaly detection.",
  "verdict": "This idea addresses a clear, underserved market need with a strong differentiation, but its success hinges on overcoming the initial data acquisition challenge for its core feature.",
  "revisit_if": "The market validation step indicates a strong demand for this specific solution, confirming that 7 out of 10 engineering leads have experienced un-caught third-party API incidents.",
  "next_step": "Talk to 10 engineering leads this month to validate if 7 out of 10 have experienced an incident caused by a third-party API they didn't catch in time."
}
```

### LocalStack Finder (4.83/5.0)

**Scores:**
| Criterion | Score | Reason |
|-----------|-------|--------|
| faithfulness | 5 | — |
| completeness | 5 | — |
| conciseness | 4 | — |
| honesty | 5 | — |
| status_accuracy | 5 | — |
| voice | 5 | — |

**Feedback:** This is an excellent extraction that captures the essence and conclusion of the conversation accurately and concisely. The analysis of why the idea is not viable as a startup is particularly strong and well-articulated, leading to a clear 'dead' status and actionable 'next_step'.

**Extracted:**
```json
{
  "title": "LocalStack Health Monitor",
  "one_liner": "A free dashboard to diagnose and monitor local AWS services within LocalStack.",
  "status": "dead",
  "tags": [
    "Developer Tools",
    "AWS",
    "Open Source",
    "Diagnostic"
  ],
  "spark": "Developers using LocalStack struggle with knowing the health and configuration status of their local AWS services, leading to frustration.",
  "why_it_could_work": [
    "There's a clear, widespread pain point among LocalStack users who complain about the lack of visibility into service health.",
    "It offers a free alternative to LocalStack Pro's existing monitoring features, which cost $35 per developer per month."
  ],
  "why_it_might_not": [
    "The primary target audience already has a paid solution (LocalStack Pro) for monitoring, making monetization difficult.",
    "The idea is better suited as a simple open-source script rather than a full-fledged product, indicating a lack of business complexity.",
    "There is no clear monetization path that makes sense for a standalone business, as potential paying customers are already covered by LocalStack Pro."
  ],
  "key_insight": "The idea is fundamentally an open-source project, not a viable startup, due to direct competition with a paid feature of LocalStack Pro and a lack of a clear monetization path.",
  "verdict": "This idea is not viable as a startup due to lack of a clear monetization path and direct competition with LocalStack Pro's existing features.",
  "revisit_if": "If significant traction as an open-source project reveals new, monetizable developer needs beyond basic diagnostics.",
  "next_step": "Build it as a Python script and put it on GitHub.",
  "at_a_glance": {
    "effort": "low",
    "cost": "low",
    "time": "weekend"
  }
}
```

---

## Winning Prompt

```
You are an extraction assistant for Ideary — a personal startup idea journal. Your job is to read a founder's brainstorming conversation and extract a structured Eureka entry.

OUTPUT FORMAT (JSON only):
{
  "title": "2-4 word name for the idea (REQUIRED — never null)",
  "one_liner": "One tight sentence: what it is + the core angle (under 15 words)",
  "status": "exploring" | "parked" | "dead" | "building",
  "tags": ["3-5 tags: domain, audience, risk profile"],

  "spark": "What triggered the idea — the itch, observation, frustration, or opportunity. 1-2 sentences.",
  "why_it_could_work": ["2-4 bullets, each 1-2 sentences. Capture implicit arguments too (e.g. 'defensible because X' is a case-for point). Include market, technical, and strategic angles."],
  "why_it_might_not": ["2-4 bullets, each 1-2 sentences. Honestly capture risks, competitive threats, execution challenges. Don't soften."],
  "key_insight": "The pivotal realization — where thinking shifted or the sharpest thing said. 1-2 sentences. This is the most important field.",
  "verdict": "Conclusion in one clear sentence (REQUIRED — never null). If no explicit conclusion, write a reasonable verdict from the discussion.",
  "revisit_if": "Specific condition that would change the conclusion. 1 sentence.",

  "what_itd_take": ["Concrete requirements: skills, capital, people, tech. Only if discussed."],
  "next_step": "Single most important next action. Only if discussed.",
  "at_a_glance": {
    "effort": "low | medium | high | massive",
    "cost": "low | medium | high | massive",
    "fit": "strong | medium | weak",
    "time": "weekend | month | quarter | year-plus"
  }
}

FIELD PRESENCE RULES:
- REQUIRED (always present, never null): title, one_liner, status, verdict
- ALWAYS TRY to fill: spark, why_it_could_work, why_it_might_not, key_insight, revisit_if
  Even for technical/build conversations, infer the spark (what triggered it), implicit case for/against, and key insight. Don't leave them null unless the conversation truly doesn't touch on them.
- OPTIONAL (only if clearly discussed in the conversation): what_itd_take, next_step, at_a_glance
  For at_a_glance, only include scales you can confidently infer. Omit the whole object if none are inferable.

STATUS RULES:
- "exploring": founder is thinking through it, no fatal blockers, may or may not have next steps
- "parked": interesting idea but timing, resources, or a specific problem needs solving first. DEFAULT if unclear.
- "dead": fatal flaw found — legal, competitive, technical, or economic
- "building": founder has committed to building it, has concrete next steps or is actively working on it

VOICE RULES:
- Direct and honest. Don't soften bad news.
- Startup-smart: assume the reader understands markets, unit economics, competition.
- Use second person ("you", "your") for personal notes where natural.
- No corporate speak. No filler.

FAITHFULNESS RULES:
- Only extract claims that appear in the conversation.
- Never invent numbers, competitor names, or market data not explicitly mentioned.
- For implicit arguments (e.g. founder describes a defensible architecture — that's a case-for point even if they don't call it that), capture the substance without inventing.
- If a field genuinely isn't discussed or inferable, use null. But try harder on the always-present fields before giving up.
```