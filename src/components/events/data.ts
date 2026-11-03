// Mock data for the Events screen, mirroring the prototype until a backend exists.

export const ACCENT = "#4F46E5";

export type Person = { t: string; bg: string; fg: string };

export const PEOPLE: Record<"DO" | "SC" | "DL", Person> = {
  DO: { t: "DO", bg: "#E0E7FF", fg: "#3730A3" },
  SC: { t: "SC", bg: "#FCE7F3", fg: "#9D174D" },
  DL: { t: "DL", bg: "#E0F2FE", fg: "#075985" },
};

export type EventStatus = "Planning" | "Active" | "Completed";

export type EventItem = {
  id: string;
  title: string;
  category: string;
  status: EventStatus;
  mon: string;
  day: string;
  countdown: string;
  venue: string;
  progress: number;
  members: number;
  /** Cover background. */
  tint: string;
  /** Strong color for the date header and progress bar. */
  ink: string;
  /** Text-safe variant of `ink`. */
  inkText: string;
};

export const EVENTS: EventItem[] = [
  { id: "ad", title: "Company Annual Dinner", category: "Corporate event", status: "Planning", mon: "DEC", day: "20", countdown: "54 days", venue: "Sofitel Phnom Penh", progress: 65, members: 8, tint: "#E9EAFE", ink: "#4F46E5", inkText: "#4338CA" },
  { id: "pl", title: "Product Launch 2027", category: "Product launch", status: "Active", mon: "JAN", day: "16", countdown: "81 days", venue: "Koh Pich, Phnom Penh", progress: 42, members: 12, tint: "#DDF1FB", ink: "#0284C7", inkText: "#0369A1" },
  { id: "lw", title: "Leadership Workshop", category: "Workshop", status: "Planning", mon: "FEB", day: "08", countdown: "104 days", venue: "Siem Reap", progress: 28, members: 5, tint: "#FFEAD9", ink: "#EA580C", inkText: "#C2410C" },
];

export const AI_SUGGESTIONS = [
  "Wedding reception, 300 guests",
  "Team offsite in Kampot",
  "Charity run with Bakong sign-ups",
];
