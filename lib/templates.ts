import type { BulletKind } from "./types/eureka";

export interface TemplateSectionDef {
  key: string;
  heading: string;
  kind: "prose" | "bullets" | "highlight" | "glance";
  bulletKind?: BulletKind;
  column?: "left" | "right";
  description: string;
}

export interface Template {
  id: string;
  name: string;
  sections: TemplateSectionDef[];
}

export const DEFAULT_TEMPLATE: Template = {
  id: "default",
  name: "Startup Idea",
  sections: [
    { key: "spark", heading: "SPARK", kind: "prose", description: "Original insight or problem" },
    { key: "case_for", heading: "CASE FOR", kind: "bullets", bulletKind: "arrow", description: "Strongest reasons this could work" },
    { key: "case_against", heading: "CASE AGAINST", kind: "bullets", bulletKind: "x", description: "Strongest reasons this might fail" },
    { key: "key_insight", heading: "KEY INSIGHT", kind: "highlight", description: "The single most important realization" },
    { key: "verdict", heading: "VERDICT", kind: "prose", description: "Overall judgment" },
    { key: "revisit_if", heading: "REVISIT IF", kind: "prose", description: "Conditions that would change the verdict" },
    { key: "next_step", heading: "NEXT STEPS", kind: "prose", description: "Single most important next action" },
    { key: "what_youd_need", heading: "WHAT YOU'D NEED", kind: "bullets", bulletKind: "dot", column: "right", description: "Concrete requirements to build or validate" },
    { key: "at_a_glance", heading: "AT A GLANCE", kind: "glance", column: "right", description: "Quick facts about the idea" },
  ],
};

export function getTemplate(id?: string | null): Template {
  return DEFAULT_TEMPLATE;
}
