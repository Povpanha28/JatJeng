// Mock data for the event workspace (Overview prototype). Shared by every event until a backend exists.

export type MilestoneState = "done" | "current" | "todo";

export const MILESTONES: { date: string; title: string; note: string; s: MilestoneState }[] = [
  { date: "9 Oct", title: "Venue & date confirmed", note: "Ballroom contract signed", s: "done" },
  { date: "23 Oct", title: "Program & suppliers locked", note: "Catering, AV, entertainment", s: "done" },
  { date: "12 Nov", title: "Invitations & guest list", note: "RSVPs and dietary needs", s: "current" },
  { date: "18 Dec", title: "Final readiness review", note: "Run of show, staffing", s: "todo" },
  { date: "20 Dec", title: "Event day", note: "Arrival, program, close-out", s: "todo" },
];

export const AGENDA_CATEGORY_COLORS: Record<string, string> = {
  Welcome: "#14B8A6",
  Program: "#6366F1",
  Break: "#F59E0B",
  Social: "#EC4899",
  Operations: "#64748B",
  Meeting: "#0EA5E9",
};

export type AgendaDay = "day" | "close";

export const AGENDA_DAYS: { id: AgendaDay; label: string; date: string }[] = [
  { id: "day", label: "Event day", date: "Sun 20 Dec" },
  { id: "close", label: "Close-out", date: "Mon 21 Dec" },
];

export const AGENDA: Record<AgendaDay, { time: string; title: string; cat: string; dur: string }[]> = {
  day: [
    { time: "17:30", title: "Guest arrival and welcome drinks", cat: "Welcome", dur: "60 min" },
    { time: "18:30", title: "Opening remarks and year in review", cat: "Program", dur: "30 min" },
    { time: "19:00", title: "Dinner service", cat: "Break", dur: "60 min" },
    { time: "20:00", title: "Awards and team recognition", cat: "Program", dur: "60 min" },
    { time: "21:00", title: "Entertainment and networking", cat: "Social", dur: "90 min" },
  ],
  close: [
    { time: "09:00", title: "Supplier close-out and venue handover", cat: "Operations", dur: "2 h" },
    { time: "11:00", title: "Team retrospective", cat: "Meeting", dur: "60 min" },
  ],
};

export const UPCOMING = [
  { mon: "NOV", day: "4", title: "Finalize catering menu", kind: "Task", owner: "Sarah Chen", inDays: "in 7 days", tagBg: "#EEF0FF", tagFg: "#3730A3" },
  { mon: "NOV", day: "6", title: "Venue walkthrough", kind: "Meeting", owner: "Dyna Ou", inDays: "in 9 days", tagBg: "#E0F2FE", tagFg: "#075985" },
  { mon: "NOV", day: "12", title: "Guest list deadline", kind: "Milestone", owner: "Anna Kim", inDays: "in 15 days", tagBg: "#DCFCE7", tagFg: "#166534" },
];

export const ACTIVITY = [
  { who: "SC", name: "Sarah Chen", verb: "completed", obj: "Confirm venue", when: "18 minutes ago", bg: "#FCE7F3", fg: "#9D174D" },
  { who: "DL", name: "David Lee", verb: "added an expense", obj: "Catering deposit", when: "2 hours ago", bg: "#E0F2FE", fg: "#075985" },
  { who: "AK", name: "Anna Kim", verb: "uploaded", obj: "Marketing Plan.pdf", when: "Yesterday", bg: "#FEF3C7", fg: "#92400E" },
  { who: "AI", name: "JatJeng AI", verb: "drafted", obj: "the event agenda", when: "Yesterday", bg: "#EEF0FF", fg: "#3730A3" },
];
