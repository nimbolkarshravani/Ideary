import EurekaPage from "@/app/components/EurekaPage";

const demoEureka = {
  title: "AI Video Tutor",
  oneLiner: "On-demand video teaching with pause-and-ask interactivity",
  status: "PARKED",
  pros: [
    "Text AI tutoring leaves learning value on the table",
    "Pause-and-ask is closer to real tutoring than video or chat",
    "Genuine differentiation from ChatGPT, Khan Academy",
  ],
  cons: [
    "Video generation is slow, expensive, inaccurate today",
    "Per-session costs likely exceed user willingness to pay",
    "Khanmigo, LearnLM, Synthesis already in the space",
  ],
  questions: [
    "Could Manim-style code animations replace video generation?",
    "Is a narrow vertical (JEE physics?) the real wedge?",
  ],
  quotes: [
    {
      text: "Video generation is a research problem, not an engineering one",
      highlight: "yellow" as const,
      rotate: -1.5,
      marginTop: 0,
    },
    {
      text: "The winners won't be the ones with clever tech — they'll be the ones who owned a specific niche",
      highlight: "pink" as const,
      rotate: 1.2,
      marginTop: 16,
    },
    {
      text: "This is the graveyard that killed most AI video-tutor startups",
      highlight: "green" as const,
      rotate: -0.8,
      marginTop: 16,
    },
  ],
  verdict: "Right vision, wrong time for a solo builder.",
  revisitIf:
    "Video generation costs drop 10x, or you commit to a specific vertical.",
  tags: ["EdTech", "Consumer", "AI-Agents", "Solo-hard"],
  capturedDate: "Apr 24, 2026",
};

export default function DemoEurekaPage() {
  return <EurekaPage {...demoEureka} />;
}
