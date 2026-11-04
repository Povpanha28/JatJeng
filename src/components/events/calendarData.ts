// Mock data for the event Calendar (Calendar prototype). Shared by every event until a backend exists.
// "Today" is fixed so prerendered HTML matches the client; dates must not be computed from the clock at render.

export const TODAY = new Date(2026, 9, 27);
export const EVENT_DAY = new Date(2026, 11, 20);

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const MON3 = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
export const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type ItemType = "task" | "meeting" | "milestone" | "event";

export const TYPES: Record<ItemType, { label: string; dot: string; bg: string; fg: string }> = {
  task: { label: "Task", dot: "#4F46E5", bg: "#EEF0FF", fg: "#312E81" },
  meeting: { label: "Meeting", dot: "#0284C7", bg: "#E0F2FE", fg: "#0C4A6E" },
  milestone: { label: "Milestone", dot: "#16A34A", bg: "#DCFCE7", fg: "#14532D" },
  event: { label: "Event day", dot: "#FFFFFF", bg: "#4F46E5", fg: "#FFFFFF" },
};

export type CalendarItem = {
  date: Date;
  /** Start time; all-day when absent. */
  t?: string;
  title: string;
  type: ItemType;
  owner: string;
  done?: boolean;
  overdue?: boolean;
};

const item = (m: number, d: number, rest: Omit<CalendarItem, "date">): CalendarItem => ({
  date: new Date(2026, m, d),
  ...rest,
});

const checkIn = (m: number, d: number) =>
  item(m, d, { t: "10:00", title: "Weekly team check-in", type: "meeting", owner: "Whole team" });

export const ITEMS: CalendarItem[] = [
  item(9, 9, { title: "Venue & date confirmed", type: "milestone", owner: "Dyna Ou", done: true }),
  item(9, 23, {
    title: "Program & suppliers locked",
    type: "milestone",
    owner: "Dyna Ou",
    done: true,
  }),
  item(9, 24, { title: "Confirm AV vendor", type: "task", owner: "David Lee", overdue: true }),
  item(9, 26, { title: "Book photographer", type: "task", owner: "Anna Kim", overdue: true }),
  checkIn(9, 30),
  item(10, 4, { title: "Finalize catering menu", type: "task", owner: "Sarah Chen" }),
  checkIn(10, 6),
  item(10, 6, { t: "14:00", title: "Venue walkthrough", type: "meeting", owner: "Dyna Ou" }),
  item(10, 12, { title: "Guest list deadline", type: "milestone", owner: "Anna Kim" }),
  checkIn(10, 13),
  item(10, 16, { title: "Send invitations", type: "task", owner: "Anna Kim" }),
  checkIn(10, 20),
  checkIn(10, 27),
  item(11, 4, { title: "AV & stage plan sign-off", type: "task", owner: "David Lee" }),
  checkIn(11, 4),
  item(11, 11, { title: "Seating chart final", type: "task", owner: "Sarah Chen" }),
  checkIn(11, 11),
  item(11, 16, { t: "15:00", title: "Final rehearsal", type: "meeting", owner: "Dyna Ou" }),
  item(11, 18, { title: "Final readiness review", type: "milestone", owner: "Dyna Ou" }),
  checkIn(11, 18),
  item(11, 20, {
    t: "17:30",
    title: "Company Annual Dinner",
    type: "event",
    owner: "Sofitel Phnom Penh",
  }),
  item(11, 21, { t: "09:00", title: "Supplier close-out", type: "task", owner: "Dyna Ou" }),
  item(11, 21, { t: "11:00", title: "Team retrospective", type: "meeting", owner: "Whole team" }),
];

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);
