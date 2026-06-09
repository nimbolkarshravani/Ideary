# Extraction Eval Results

_Generated: 2026-06-09T14:43:35.547Z_

- Extraction model: `gemini-2.5-flash`
- Judge model: `gemini-2.5-flash`
- Threshold: 4.0 · Max iterations: 4

**Outcome:** ✅ Threshold met · Winning iteration **#1** · avg **4.83**

## Score progression

| Iteration | faithfulness | completeness | conciseness | honesty | statusAccuracy | voice | **avg** |
|---|---|---|---|---|---|---|---|
| 1 | 5.00 | 5.00 | 4.67 | 5.00 | 5.00 | 4.33 | **4.83** |

## Iteration 1 — avg 4.83

| Test case | faithfulness | completeness | conciseness | honesty | statusAccuracy | voice | notes |
|---|---|---|---|---|---|---|---|
| cold-email-saas | 5 | 5 | 5 | 5 | 5 | 4 | The verdict section, while direct, could adopt a more explicit first-person founder's perspective. |
| local-first-notes | 5 | 5 | 4 | 5 | 5 | 4 | The voice is mostly good, but a few phrases like 'There's a need for...' in SPARK are less direct than ideal. |
| freelancer-tax-india | 5 | 5 | 5 | 5 | 5 | 5 | This extraction is exceptionally strong across all criteria, with no significant weaknesses. |

<details><summary>Sample extraction (cold-email-saas)</summary>

```json
{
  "title": "AI Cold Email",
  "oneLiner": "An AI SaaS to write hyper-personalized cold emails by scraping prospect data.",
  "status": "DEAD",
  "tags": [
    "SaaS",
    "AI",
    "Sales",
    "B2B"
  ],
  "sections": [
    {
      "kind": "prose",
      "heading": "SPARK",
      "text": "Build an AI SaaS that writes hyper-personalized cold emails by scraping LinkedIn, recent posts, and company news. Pay per email or monthly seats."
    },
    {
      "kind": "CASE FOR",
      "heading": "CASE FOR",
      "bulletKind": "arrow",
      "items": [
        "Clear, sellable value prop: 'book more meetings' always sells.",
        "Emails would be genuinely better due to more signals than basic mail-merge tools."
      ]
    },
    {
      "kind": "CASE AGAINST",
      "heading": "CASE AGAINST",
      "bulletKind": "x",
      "items": [
        "Extremely crowded cold email tooling space (Instantly, Smartlead, Clay, Lemlist, Apollo, AI SDR startups).",
        "Beating 'better personalization' on quality alone is hard to defend; it's a feature, not a company.",
        "Deliverability is getting worse; Google/Microsoft tightened bulk-sender rules in 2024. AI-generated cold email at volume is a spam target.",
        "Commodity wrapper: 'scrape + prompt + send' is easily replicable. Margin compressed between LLM providers and sending infrastructure.",
        "Scraping LinkedIn is a legal gray area; LinkedIn aggressively litigates scrapers, posing platform risk.",
        "Niching down (e.g., YC startups selling to startups) doesn't fix structural problems and targets a saturated, cold-outreach-averse niche."
      ]
    },
    {
      "kind": "KEY INSIGHT",
      "heading": "KEY INSIGHT",
      "text": "The cold email channel is dying, and this idea would be a thin wrapper in a knife fight with no unfair advantage."
    },
    {
      "kind": "VERDICT",
      "heading": "VERDICT",
      "text": "Not worth pursuing. The market is huge, but defensibility and channel trajectory are both working against a solo founder. Fundamental problems with deliverability, commoditization, and legal risk."
    },
    {
      "kind": "REVISIT IF",
      "heading": "REVISIT IF",
      "bulletKind": "dot",
      "items": [
        "I owned a proprietary data source nobody else has.",
        "A totally new channel for outreach emerged, not just better copy."
      ]
    }
  ]
}
```
</details>

## Winning prompt

```text
You are the extraction engine for Ideary, a tool where a solo founder saves "Eurekas" — short, honest post-mortems of startup ideas they explored with an AI.

Read the conversation below and distill it into ONE Eureka as JSON.

OUTPUT — return ONLY valid JSON, no prose, matching this shape:
{
  "title": string,            // 2-5 words, the idea's name
  "oneLiner": string,         // one crisp sentence describing the idea
  "status": "ACTIVE" | "PARKED" | "DEAD" | "REVISIT",
  "tags": string[],           // 2-5 short tags, e.g. ["EdTech","Consumer","Solo-hard"]
  "sections": Section[]
}

Section is one of:
  { "kind": "prose",     "heading": string, "text": string }
  { "kind": "highlight", "heading": string, "text": string }   // for the single sharpest insight
  { "kind": "bullets",   "heading": string, "bulletKind": "arrow"|"x"|"dot"|"question", "items": string[] }

Use these headings when the content exists (omit a section if the conversation has nothing for it):
  - "SPARK" (prose): what triggered the idea / the core premise
  - "CASE FOR" (bullets, arrow): reasons it could work
  - "CASE AGAINST" (bullets, x): reasons it might not
  - "OPEN QUESTIONS" (bullets, question): unresolved questions
  - "KEY INSIGHT" (highlight): the single most important realization
  - "VERDICT" (prose): the honest conclusion
  - "REVISIT IF" (bullets, dot, or prose): what would have to change to revive it

STATUS RULES:
  - ACTIVE  — the founder is excited and committing to build / next-step it
  - PARKED  — a good idea blocked by timing, scope, or competition; shelved not killed
  - DEAD    — concluded not worth pursuing; fundamental problems
  - REVISIT — explicitly deferred pending a specific future trigger

VOICE: terse, first-person founder's-notebook. Direct and honest. No marketing fluff, no hedging, no "this could potentially." Preserve the conversation's real skepticism — never make a dead idea sound alive.

CONVERSATION:
{{CONVERSATION}}
```