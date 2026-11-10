// Mock data for the Budget, Statistics, Documents and Roles screens. Shared by every event until a
// backend exists. Budget totals match the Overview card ($7,500 of $12,000).

import type { Assignee } from "./tasksData";

/* ---------- Budget ---------- */

export type BudgetCategory = {
  name: string;
  budget: number;
  spent: number;
};

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { name: "Venue", budget: 5000, spent: 4000 },
  { name: "Catering", budget: 3000, spent: 1850 },
  { name: "Equipment", budget: 1500, spent: 780 },
  { name: "Marketing", budget: 1200, spent: 620 },
  { name: "Transportation", budget: 800, spent: 250 },
  { name: "Contingency", budget: 500, spent: 0 },
];

export const BUDGET_TOTAL = BUDGET_CATEGORIES.reduce((s, c) => s + c.budget, 0);
export const BUDGET_SPENT = BUDGET_CATEGORIES.reduce((s, c) => s + c.spent, 0);

export type ExpenseStatus = "paid" | "approved" | "pending";

export const EXPENSE_STATUS: Record<ExpenseStatus, { label: string; bg: string; fg: string }> = {
  paid: { label: "Paid", bg: "#DCFCE7", fg: "#166534" },
  approved: { label: "Approved", bg: "#EEF0FF", fg: "#3730A3" },
  pending: { label: "Pending", bg: "#FEF3C7", fg: "#92400E" },
};

export const EXPENSES: {
  title: string;
  category: string;
  date: string;
  by: string;
  amount: number;
  status: ExpenseStatus;
}[] = [
  { title: "Grand Ballroom deposit", category: "Venue", date: "20 Nov", by: "David Lee", amount: 4000, status: "paid" },
  { title: "Dinner menu deposit", category: "Catering", date: "25 Nov", by: "David Lee", amount: 1850, status: "paid" },
  { title: "Audio equipment rental", category: "Equipment", date: "3 Dec", by: "David Lee", amount: 780, status: "pending" },
  { title: "Event poster printing", category: "Marketing", date: "1 Dec", by: "Anna Kim", amount: 620, status: "approved" },
  { title: "Team transportation", category: "Transportation", date: "4 Dec", by: "Dyna Ou", amount: 250, status: "paid" },
];

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;

/* ---------- Statistics ---------- */

/** Tasks completed per week over the last six weeks; sums to the done tasks in the Tasks mock. */
export const WEEKLY_DONE: { week: string; range: string; done: number }[] = [
  { week: "W1", range: "28 Sep – 4 Oct", done: 1 },
  { week: "W2", range: "5 – 11 Oct", done: 2 },
  { week: "W3", range: "12 – 18 Oct", done: 3 },
  { week: "W4", range: "19 – 25 Oct", done: 2 },
  { week: "W5", range: "26 Oct – 1 Nov", done: 3 },
  { week: "W6", range: "2 – 8 Nov", done: 2 },
];

/** Team invites sent but not yet accepted. */
export const PENDING_INVITES = 2;

/* ---------- Documents ---------- */

export const DOC_CATEGORIES = ["Planning", "Contracts", "Marketing", "Finance", "Logistics", "Other"] as const;
export type DocCategory = (typeof DOC_CATEGORIES)[number];

export const DOC_CATEGORY_COLORS: Record<DocCategory, { bg: string; fg: string }> = {
  Planning: { bg: "#EEF0FF", fg: "#4F46E5" },
  Contracts: { bg: "#E0F2FE", fg: "#0369A1" },
  Marketing: { bg: "#FCE7F3", fg: "#BE185D" },
  Finance: { bg: "#DCFCE7", fg: "#15803D" },
  Logistics: { bg: "#FEF3C7", fg: "#B45309" },
  Other: { bg: "#F1F5F9", fg: "#475569" },
};

export const DOCUMENTS: {
  id: string;
  name: string;
  category: DocCategory;
  type: "PDF" | "XLSX" | "DOCX";
  size: string;
  by: string;
  date: string;
}[] = [
  { id: "proposal", name: "Event Proposal.pdf", category: "Planning", type: "PDF", size: "2.4 MB", by: "Dyna Ou", date: "1 Dec" },
  { id: "contract", name: "Venue Contract.pdf", category: "Contracts", type: "PDF", size: "1.8 MB", by: "Sarah Chen", date: "2 Dec" },
  { id: "budget", name: "Budget Tracker.xlsx", category: "Finance", type: "XLSX", size: "1.2 MB", by: "David Lee", date: "4 Dec" },
  { id: "marketing", name: "Marketing Plan.pdf", category: "Marketing", type: "PDF", size: "3.1 MB", by: "Anna Kim", date: "5 Dec" },
  { id: "guests", name: "Guest List.xlsx", category: "Logistics", type: "XLSX", size: "860 KB", by: "Sarah Chen", date: "6 Dec" },
];

/* ---------- Roles ---------- */

export const PERMISSION_AREAS = [
  "Event",
  "Calendar",
  "Tasks",
  "Team",
  "Budget",
  "Documents",
  "Statistics",
  "Roles",
] as const;
export type PermissionArea = (typeof PERMISSION_AREAS)[number];

export const ROLES: {
  id: string;
  name: string;
  description: string;
  bg: string;
  fg: string;
  access: PermissionArea[];
  members: Assignee[];
}[] = [
  {
    id: "admin",
    name: "Event Admin",
    description: "Full event management and team access",
    bg: "#EEF0FF",
    fg: "#4F46E5",
    access: [...PERMISSION_AREAS],
    members: ["DO", "SC"],
  },
  {
    id: "marketing",
    name: "Marketing Lead",
    description: "Manage marketing tasks and documents",
    bg: "#FCE7F3",
    fg: "#BE185D",
    access: ["Event", "Calendar", "Tasks", "Documents"],
    members: ["AK"],
  },
  {
    id: "finance",
    name: "Finance Lead",
    description: "Manage budgets, expenses and reports",
    bg: "#DCFCE7",
    fg: "#15803D",
    access: ["Event", "Budget", "Documents", "Statistics"],
    members: ["DL"],
  },
  {
    id: "technical",
    name: "Technical Lead",
    description: "Manage technical tasks and schedules",
    bg: "#FEF3C7",
    fg: "#B45309",
    access: ["Event", "Calendar", "Tasks"],
    members: [],
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "View event information without editing",
    bg: "#F1F5F9",
    fg: "#475569",
    access: ["Event"],
    members: [],
  },
];

/** Role name for a team member, for the Statistics team table. */
export const roleOf = (who: Assignee) => ROLES.find((r) => r.members.includes(who))?.name ?? "Member";
