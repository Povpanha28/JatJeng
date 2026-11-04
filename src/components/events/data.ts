// Mock data for the Events screen, mirroring the prototype until a backend exists.

export const ACCENT = "#4F46E5";

export type Person = { t: string; bg: string; fg: string };

export const PEOPLE: Record<"DO" | "SC" | "DL" | "AK", Person> = {
  DO: { t: "DO", bg: "#E0E7FF", fg: "#3730A3" },
  SC: { t: "SC", bg: "#FCE7F3", fg: "#9D174D" },
  DL: { t: "DL", bg: "#E0F2FE", fg: "#075985" },
  AK: { t: "AK", bg: "#FEF3C7", fg: "#92400E" },
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
  /** Countdown in days, shown in the workspace header and switcher. */
  daysLeft: number;
  /** Full start date and time, e.g. "Sun, 20 Dec 2026 · 17:30". */
  when: string;
  venue: string;
  guests: number;
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
  { id: "ad", title: "Company Annual Dinner", category: "Corporate event", status: "Planning", mon: "DEC", day: "20", countdown: "54 days", daysLeft: 54, when: "Sun, 20 Dec 2026 · 17:30", venue: "Sofitel Phnom Penh", guests: 250, progress: 65, members: 8, tint: "#E9EAFE", ink: "#4F46E5", inkText: "#4338CA" },
  { id: "pl", title: "Product Launch 2027", category: "Product launch", status: "Active", mon: "JAN", day: "16", countdown: "81 days", daysLeft: 81, when: "Sat, 16 Jan 2027 · 09:00", venue: "Koh Pich, Phnom Penh", guests: 400, progress: 42, members: 12, tint: "#DDF1FB", ink: "#0284C7", inkText: "#0369A1" },
  { id: "lw", title: "Leadership Workshop", category: "Workshop", status: "Planning", mon: "FEB", day: "08", countdown: "104 days", daysLeft: 104, when: "Mon, 8 Feb 2027 · 08:30", venue: "Siem Reap", guests: 40, progress: 28, members: 5, tint: "#FFEAD9", ink: "#EA580C", inkText: "#C2410C" },
];

export const AI_SUGGESTIONS = [
  "Wedding reception, 300 guests",
  "Team offsite in Kampot",
  "Charity run with Bakong sign-ups",
];

export const getEvent = (id: string) => EVENTS.find((e) => e.id === id);

/** Short event date without year or time, e.g. "Sun, 20 Dec". */
export const shortDate = (e: EventItem) => e.when.split(" · ")[0].replace(/ \d{4}$/, "");
