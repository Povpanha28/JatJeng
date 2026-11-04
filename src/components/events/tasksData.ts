// Mock data for the event Tasks screen. Shared by every event until a backend exists.
// Due dates match the Calendar mock; "today" is the Calendar's fixed TODAY.

import { PEOPLE, type Person } from "./data";

export type TaskStatus = "not_started" | "in_progress" | "done";
export type TaskPriority = "high" | "medium" | "low";
export type TaskCategory = "Technical" | "Marketing" | "Logistics" | "Guests" | "Venue" | "Program";
export type Assignee = keyof typeof PEOPLE;

export type Task = {
  id: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: Assignee;
  due: Date;
  /** Completed and total checklist items. */
  subtasks?: [number, number];
};

/** The signed-in user, for the "My tasks" tab. */
export const ME: Assignee = "DO";

export const ASSIGNEES: Record<Assignee, Person & { name: string }> = {
  DO: { ...PEOPLE.DO, name: "Dyna Ou" },
  SC: { ...PEOPLE.SC, name: "Sarah Chen" },
  DL: { ...PEOPLE.DL, name: "David Lee" },
  AK: { ...PEOPLE.AK, name: "Anna Kim" },
};

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Technical: "#8B5CF6",
  Marketing: "#EC4899",
  Logistics: "#0EA5E9",
  Guests: "#F59E0B",
  Venue: "#14B8A6",
  Program: "#6366F1",
};

export const STATUS_META: Record<
  TaskStatus,
  { label: string; bg: string; fg: string; dot: string }
> = {
  not_started: { label: "Not started", bg: "#F1F5F9", fg: "#475569", dot: "#94A3B8" },
  in_progress: { label: "In progress", bg: "#EEF0FF", fg: "#3730A3", dot: "#4F46E5" },
  done: { label: "Done", bg: "#DCFCE7", fg: "#166534", dot: "#16A34A" },
};

export const PRIORITY_META: Record<TaskPriority, { label: string; color: string }> = {
  high: { label: "High", color: "#DC2626" },
  medium: { label: "Medium", color: "#EA580C" },
  low: { label: "Low", color: "#64748B" },
};

const d = (m: number, day: number) => new Date(2026, m, day);

export const TASKS: Task[] = [
  {
    id: "t1",
    title: "Confirm AV vendor",
    category: "Technical",
    status: "in_progress",
    priority: "high",
    assignee: "DL",
    due: d(9, 24),
    subtasks: [2, 3],
  },
  {
    id: "t2",
    title: "Book photographer",
    category: "Marketing",
    status: "not_started",
    priority: "medium",
    assignee: "AK",
    due: d(9, 26),
  },
  {
    id: "t3",
    title: "Finalize catering menu",
    category: "Logistics",
    status: "in_progress",
    priority: "high",
    assignee: "SC",
    due: d(10, 4),
    subtasks: [1, 4],
  },
  {
    id: "t4",
    title: "Send invitations",
    category: "Guests",
    status: "not_started",
    priority: "high",
    assignee: "AK",
    due: d(10, 16),
  },
  {
    id: "t5",
    title: "AV & stage plan sign-off",
    category: "Technical",
    status: "not_started",
    priority: "medium",
    assignee: "DL",
    due: d(11, 4),
  },
  {
    id: "t6",
    title: "Seating chart final",
    category: "Guests",
    status: "not_started",
    priority: "medium",
    assignee: "SC",
    due: d(11, 11),
  },
  {
    id: "t7",
    title: "Supplier close-out",
    category: "Logistics",
    status: "not_started",
    priority: "low",
    assignee: "DO",
    due: d(11, 21),
  },
  {
    id: "t8",
    title: "Confirm venue",
    category: "Venue",
    status: "done",
    priority: "high",
    assignee: "SC",
    due: d(9, 2),
  },
  {
    id: "t9",
    title: "Sign ballroom contract",
    category: "Venue",
    status: "done",
    priority: "high",
    assignee: "SC",
    due: d(9, 9),
  },
  {
    id: "t10",
    title: "Set event budget",
    category: "Logistics",
    status: "done",
    priority: "high",
    assignee: "DL",
    due: d(9, 5),
  },
  {
    id: "t11",
    title: "Choose event theme",
    category: "Program",
    status: "done",
    priority: "medium",
    assignee: "AK",
    due: d(9, 7),
  },
  {
    id: "t12",
    title: "Shortlist caterers",
    category: "Logistics",
    status: "done",
    priority: "medium",
    assignee: "SC",
    due: d(9, 12),
  },
  {
    id: "t13",
    title: "Pay catering deposit",
    category: "Logistics",
    status: "done",
    priority: "high",
    assignee: "DL",
    due: d(9, 16),
  },
  {
    id: "t14",
    title: "Book MC for the night",
    category: "Program",
    status: "done",
    priority: "medium",
    assignee: "AK",
    due: d(9, 14),
  },
  {
    id: "t15",
    title: "Book live band",
    category: "Program",
    status: "done",
    priority: "medium",
    assignee: "SC",
    due: d(9, 19),
  },
  {
    id: "t16",
    title: "Draft guest list",
    category: "Guests",
    status: "done",
    priority: "high",
    assignee: "AK",
    due: d(9, 20),
  },
  {
    id: "t17",
    title: "Design invitation card",
    category: "Marketing",
    status: "done",
    priority: "medium",
    assignee: "AK",
    due: d(9, 21),
  },
  {
    id: "t18",
    title: "Upload marketing plan",
    category: "Marketing",
    status: "done",
    priority: "low",
    assignee: "AK",
    due: d(9, 22),
  },
  {
    id: "t19",
    title: "Draft run of show",
    category: "Program",
    status: "done",
    priority: "medium",
    assignee: "DL",
    due: d(9, 23),
  },
  {
    id: "t20",
    title: "Collect dietary requirements form",
    category: "Guests",
    status: "done",
    priority: "low",
    assignee: "SC",
    due: d(9, 23),
  },
];
