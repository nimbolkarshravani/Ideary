// Test conversations for the extraction eval harness.
// Each is a raw transcript of a solo founder brainstorming a startup idea with
// an AI assistant. They deliberately land on different conclusions so the
// extractor's status accuracy can be judged.

export interface TestConversation {
  id: string;
  /** What a correct extraction should roughly conclude — used only for the judge's reference. */
  expectedStatus: "ACTIVE" | "PARKED" | "DEAD" | "REVISIT";
  transcript: string;
}

export const TEST_CONVERSATIONS: TestConversation[] = [
  {
    id: "cold-email-saas",
    expectedStatus: "DEAD",
    transcript: `User: I want to build an AI SaaS that writes hyper-personalized cold emails by scraping the prospect's LinkedIn, recent posts, and company news. Pay per email or monthly seats. Thoughts?

Assistant: It's a clear, sellable value prop — "book more meetings" always sells. But let's pressure-test it. The cold email tooling space is extremely crowded: Instantly, Smartlead, Clay, Lemlist, Apollo, plus dozens of "AI SDR" startups that raised in 2023-2024. What's your wedge?

User: My emails would be genuinely better because I pull from more signals. Most tools just do mail-merge with a token.

Assistant: Clay already does deep enrichment + AI messaging with 100+ data sources, and it has a big community moat. Beating "better personalization" on quality alone is hard to defend — it's a feature, not a company. There are also two structural problems worth sitting with:

1. Deliverability is getting worse, not better. Google and Microsoft tightened bulk-sender rules in 2024. AI-generated cold email at volume is exactly what spam filters and the new regulations target. You'd be selling a product whose core channel is actively degrading.

2. It's a commodity wrapper. The actual intelligence is the LLM. Anyone can replicate "scrape + prompt + send" in a weekend. Your margin gets compressed between the model providers above you and the sending infrastructure below you.

User: What if I niche down to, say, YC startups selling to other startups?

Assistant: Niching helps go-to-market, but it doesn't fix the two structural problems — deliverability decay and commodity wrapper economics still apply. You'd also be picking a niche that is the most saturated with exactly this kind of tooling and the most allergic to cold outreach.

User: Hmm. And legally, scraping LinkedIn is a gray area too, right?

Assistant: Correct — LinkedIn aggressively litigates scrapers (hiQ v. LinkedIn went back and forth for years). Building your core data pipeline on a source that may cut you off or sue you is a real platform risk.

User: Yeah. I think the honest read is the channel is dying and I'd be a thin wrapper in a knife fight. I don't have an unfair advantage here.

Assistant: That's a fair and honest conclusion. The market is huge but the defensibility and the channel trajectory are both working against a solo founder. If anything ever changes it, it would be owning a proprietary data source nobody else has, or a totally new channel — not better copy.`,
  },
  {
    id: "local-first-notes",
    expectedStatus: "PARKED",
    transcript: `User: Idea: a local-first, end-to-end encrypted notes app. Markdown, works offline, syncs across devices, but the server never sees plaintext. Privacy-first Obsidian basically.

Assistant: There's a real, passionate audience for this — the privacy + local-first crowd is small but loyal and willing to pay. The technical premise is sound and increasingly buildable: CRDTs (Yjs, Automerge) make offline-first sync tractable, and E2E encryption on top is well-understood. So the "can it be built" answer is yes.

User: Right, and Obsidian sync isn't actually E2E by default, and it's closed source. I'd be more trustworthy.

Assistant: True, that's a genuine differentiator on paper. But here's the hard part: Obsidian has enormous mindshare, a plugin ecosystem of thousands, and a community moat that took years to build. "More private Obsidian" is a real wedge but a narrow one — privacy alone rarely drives mass adoption; people say they want it but switch for features and ecosystem.

User: So it's not that the idea is bad, it's that the timing/competition is brutal?

Assistant: Exactly. Three honest headwinds:

1. The ecosystem gap. Obsidian's value is its plugins. You'd launch with none. Replicating that is a multi-year effort, not a feature.

2. Sync is the hard 20% that's 80% of the work. E2E + CRDT conflict resolution + cross-platform (iOS, Android, desktop, web) is a brutal surface area for one person to maintain reliably. Sync bugs destroy trust instantly in a notes app.

3. Monetization is thin. The privacy crowd resists subscriptions and self-hosts to avoid paying. Your most-aligned users are your least-monetizable.

User: None of that is fatal though. It's more "not now, not solo."

Assistant: That's the right framing. It's not a dead idea — it's a strong idea blocked by timing and scope for a solo builder. The premise could become compelling if local-first tooling matures enough that you're not rebuilding sync from scratch, or if you found a specific vertical (lawyers? journalists? therapists?) where E2E privacy is a hard requirement, not a nice-to-have.

User: Yeah. I'll shelve it rather than kill it. If the local-first sync libraries get good enough that I'm not maintaining the hard part myself, this changes.

Assistant: Reasonable. Park it with a clear trigger: revisit when local-first sync is a solved dependency you can adopt, or when you find a vertical where privacy is non-negotiable and budgeted for.`,
  },
  {
    id: "freelancer-tax-india",
    expectedStatus: "ACTIVE",
    transcript: `User: Idea: invoicing + GST + income tax helper built specifically for Indian freelancers and solo consultants. Generate compliant invoices, track expenses, estimate advance tax, and pre-fill the stuff they need at filing time.

Assistant: This one has real shape. Let me reflect why it's stronger than a generic "invoicing app":

1. Specific, underserved user with a painful, recurring problem. Indian freelancers genuinely struggle with GST registration thresholds, quarterly advance tax, and ITR-3/ITR-4 filing. Existing tools are either enterprise accounting (Zoho Books, too heavy) or generic global invoicers (Stripe Invoicing, not India-tax-aware).

2. The compliance layer is the moat. "Invoicing" is a commodity. "Invoicing that knows Indian tax rules, deadlines, and pre-fills your filing" is specific domain knowledge that's annoying to replicate and creates real switching cost once someone's data lives there.

3. Clear monetization. This audience already pays CAs ₹5–15k/year for filing. A ₹500–1000/month tool that reduces that pain and bill is an easy sell with obvious ROI.

User: My worry is it's a lot of tax logic to get right, and rules change every budget.

Assistant: That's a real cost, but reframe it — that's exactly what makes it defensible. The regulatory complexity that scares off generic SaaS builders is the barrier protecting you once you've done the work. You'd want to scope tightly: start with just GST-compliant invoicing + expense tracking + advance-tax estimation for the simplest freelancer profile, and expand. Don't try to be a full accounting suite on day one.

User: I could launch with just invoicing + advance tax estimation and add filing later. And I actually know this pain — I've filed as a freelancer myself.

Assistant: That founder-problem fit matters a lot here. You understand the user because you are the user, the wedge is narrow and concrete, the willingness-to-pay is proven, and the compliance depth is a moat rather than a liability. The main risks are execution scope (resist feature creep) and keeping rules current — both manageable.

User: Yeah, I'm genuinely excited about this one. I think I start building the invoicing core this week and validate with a few freelancer friends.

Assistant: That's the right next step — build the narrow core, put it in front of five real freelancers, and watch whether they'd pay. Everything about this fits a solo founder: focused scope, real pain, proven budget, defensible domain knowledge.`,
  },
];
