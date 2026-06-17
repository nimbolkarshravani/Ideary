export interface TestConversation {
  id: string;
  title: string;
  text: string;
  gold: {
    status: "exploring" | "parked" | "dead" | "building";
    must_capture: string[];
    must_not_hallucinate: string[];
  };
}

export const TEST_CONVERSATIONS: TestConversation[] = [
  {
    id: "pairnotes",
    title: "PairNotes",
    text: `User: I have this idea for an app called PairNotes. Couples leave each other short voice notes throughout the day and at the end of the day the app creates an AI summary of what each person shared. Kind of like a shared journal but async.

Claude: What problem is it solving that existing apps don't?

User: WhatsApp voice notes get buried. This is intentional, daily, and generates a "relationship memory" over time. Searchable journal entries, anniversaries remembered, patterns noticed.

Claude: Who's the primary user?

User: Busy couples. Both working, not much time to talk, this keeps them connected throughout the day.

Claude: What exists in this space?

User: There's Couple app but it's basically a private WhatsApp. There's Between. Nothing with the voice plus AI summary angle.

Claude: Revenue model?

User: Premium subscription. $8/month per couple. Maybe $96/year. Not huge but the market is large.

Claude: Pain points I see: both people need to use it consistently or it dies. One partner forgetting to record breaks the loop. And the AI summaries need to be really good or it feels gimmicky. The privacy angle is also intense — you're storing intimate relationship data.

User: Yeah the dual engagement problem is real. If one person stops recording, the whole thing collapses.

Claude: On privacy: it's a moat AND a risk. If you handle it better than competitors — local processing, no cloud storage of raw audio — privacy becomes a feature. If you mess it up, you're done.

User: I want to think more about this. Not ready to start yet. The dual engagement issue needs a clever solve before I commit. Maybe a minimum viable version is just a shared voice memo folder with no AI at all.

Claude: That's a smart way to validate the core habit before betting on the AI layer.

User: Yeah. Parked for now until I figure out the engagement mechanic.`,
    gold: {
      status: "parked",
      must_capture: [
        "dual engagement problem — one partner stopping kills the whole thing",
        "privacy as both moat and risk",
        "AI summary gimmick risk",
      ],
      must_not_hallucinate: [
        "specific number of users",
        "funding requirements",
        "specific market size data",
      ],
    },
  },
  {
    id: "apiwatch",
    title: "APIWatch",
    text: `User: Every time Stripe, Twilio, or Sendgrid has an incident, my team finds out from angry customer emails, not from monitoring. We have internal API monitoring but nothing that specifically watches third-party API dependencies for performance anomalies.

Claude: How are companies handling this today?

User: Statuspage subscriptions — manual and delayed. Datadog requires custom setup per API. Or just reactive incident response. There's no zero-config solution.

Claude: What's the differentiation from Datadog?

User: Datadog you configure everything yourself. I'm thinking zero-config — you connect your AWS or GCP logs, we detect which third-party APIs you're calling, and immediately start monitoring them for latency spikes and error rate anomalies. No setup at all.

Claude: Who's the buyer?

User: VP Engineering or CTO at Series A through C. 50 to 500 engineers. They're already spending on reliability tooling but third-party failure is a consistent blind spot.

Claude: Competitors?

User: Gremlin does chaos engineering — different use case. Catchpoint does synthetic monitoring. Neither focuses on passive real-traffic anomaly detection for third-party APIs specifically. That's the gap.

Claude: What's the hard technical problem?

User: The anomaly detection needs to distinguish "this API is slow for everyone" versus "this API is slow specifically for me." That requires benchmark data. Either public feeds from aggregated status pages or crowdsourced data from multiple customers.

Claude: The crowdsourcing is your moat but also a classic chicken-and-egg.

User: Exactly. Customers 1 through 50 get worse detection because there's less benchmark data. But once you have 50 plus customers monitoring the same APIs, detection quality improves dramatically.

Claude: This feels like a real and under-served gap. What's your next step?

User: I want to talk to 10 engineering leads this month. If 7 out of 10 say they've had an incident caused by a third-party API they didn't catch in time, I'm building an MVP.

Claude: That's a clean validation criterion. Go do it.`,
    gold: {
      status: "exploring",
      must_capture: [
        "zero-config differentiation from Datadog",
        "crowdsourcing chicken-and-egg as both moat and problem",
        "customer interview validation plan as next step",
      ],
      must_not_hallucinate: [
        "specific pricing numbers",
        "user gave specific company names as customers",
        "revenue projections",
      ],
    },
  },
  {
    id: "localstack-finder",
    title: "LocalStack Finder",
    text: `User: I want to build a dashboard that shows the health of your LocalStack setup. LocalStack is a tool for running AWS services locally during development, and it's always unclear which services are configured, which are partially working, and which are broken.

Claude: Is this a problem people pay for, or just scratching your own itch?

User: Probably mostly scratching my own itch. But every developer I know who uses LocalStack complains about this exact thing.

Claude: What does LocalStack itself offer here?

User: LocalStack Pro has some monitoring features, but it costs $35 per developer per month. My idea would be free and specifically focused on the diagnostic and dashboard angle.

Claude: So you'd be building a free tool that overlaps with LocalStack Pro?

User: Yeah basically. And when I think about it honestly — this could just be a Python script and a GitHub repo. It doesn't need to be a product at all.

Claude: Does a startup make sense here, or is this a weekend open-source project?

User: You're right. This is not a business. There's no monetization path that makes sense — anyone who'd pay is already paying for LocalStack Pro. I should just build it open-source, post it, and see if developers find it useful.

Claude: That's the right call. Maybe if it gets traction you learn something about what developers actually need, which could inform a real product later.

User: Yeah. I'll build it as a script, put it on GitHub, and stop thinking about it as a startup idea. It was never going to be one.`,
    gold: {
      status: "dead",
      must_capture: [
        "not a business — no viable monetization, LocalStack Pro already covers it",
        "conclusion: build as open-source script, not a startup",
      ],
      must_not_hallucinate: [
        "revenue projections",
        "team size requirements",
        "specific user numbers",
        "claims about LocalStack pricing being wrong ($35/dev is what was stated)",
      ],
    },
  },
];
