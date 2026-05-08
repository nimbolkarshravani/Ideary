export type EurekaStatus = "ACTIVE" | "PARKED" | "DEAD" | "REVISIT";
export type BulletKind = "arrow" | "x" | "dot" | "question";

export interface MarginQuote {
  text: string;
  highlight: "yellow" | "pink" | "green";
  rotate: number;
  marginTop?: number;
}

export interface GlanceRow {
  label: string;
  value: string;
}

export type EurekaSection =
  | { kind: "bullets"; heading: string; bulletKind: BulletKind; items: string[]; column?: "left" | "right" }
  | { kind: "prose"; heading: string; text: string; column?: "left" | "right" }
  | { kind: "highlight"; heading: string; text: string; column?: "left" | "right" }
  | { kind: "glance"; heading: string; rows: GlanceRow[]; column?: "left" | "right" };

export interface Eureka {
  id: string;
  title: string;
  oneLiner: string;
  status: EurekaStatus;
  tags: string[];
  capturedDate: string;
  rotate?: number;
  sections: EurekaSection[];
  quotes?: MarginQuote[];
  conversationUrl?: string;
}
