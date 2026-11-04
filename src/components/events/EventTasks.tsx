"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACCENT } from "./data";
import { MONTHS, TODAY, daysBetween } from "./calendarData";
import {
  ASSIGNEES,
  CATEGORY_COLORS,
  ME,
  PRIORITY_META,
  STATUS_META,
  TASKS,
  type Assignee,
  type Task,
  type TaskCategory,
  type TaskPriority,
  type TaskStatus,
} from "./tasksData";
import {
  BoardIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FilterIcon,
  FlagIcon,
  ListBulletIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  TasksIcon,
  UserIcon,
} from "./icons";

type Tab = "all" | "mine" | "overdue" | "completed";
type View = "list" | "board";
type GroupId = "overdue" | "soon" | "later" | "completed";

/** A task with its live status (after checkbox toggles) and derived due-date state. */
type Row = Task & { overdue: boolean; days: number };

const GROUPS: { id: GroupId; label: string; dot: string; labelColor: string }[] = [
  { id: "overdue", label: "Overdue", dot: "#E11D48", labelColor: "#BE123C" },
  { id: "soon", label: "Next 2 weeks", dot: ACCENT, labelColor: "#0F172A" },
  { id: "later", label: "Later", dot: "#94A3B8", labelColor: "#0F172A" },
  { id: "completed", label: "Completed", dot: "#16A34A", labelColor: "#0F172A" },
];

const groupOf = (r: Row): GroupId =>
  r.status === "done" ? "completed" : r.overdue ? "overdue" : r.days <= 14 ? "soon" : "later";

const matchesTab = (r: Row, tab: Tab) =>
  tab === "all" ||
  (tab === "mine" && r.assignee === ME) ||
  (tab === "overdue" && r.overdue) ||
  (tab === "completed" && r.status === "done");

const TABS: { id: Tab; label: string; pill: string }[] = [
  { id: "all", label: "All", pill: "bg-[#EEF0FF] text-[#3730A3]" },
  { id: "mine", label: "My tasks", pill: "bg-[#F1F5F9] text-[#475569]" },
  { id: "overdue", label: "Overdue", pill: "bg-[#FFE4E6] text-[#BE123C]" },
  { id: "completed", label: "Completed", pill: "bg-[#F1F5F9] text-[#475569]" },
];

const COLUMNS = "grid-cols-[28px_minmax(0,1fr)_136px_110px_176px_140px_36px]";

const formatDue = (date: Date) => `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}`;

function dueNote(r: Row) {
  if (r.status === "done") return "Done";
  if (r.overdue) return `${-r.days} ${r.days === -1 ? "day" : "days"} late`;
  if (r.days === 0) return "Today";
  return r.days === 1 ? "Tomorrow" : `in ${r.days} days`;
}

export default function EventTasks() {
  // Checkbox toggles, keyed by task id: true = done, false = reopened.
  const [doneOverride, setDoneOverride] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<Tab>("all");
  const [view, setView] = useState<View>("list");
  const [query, setQuery] = useState("");
  const [assignee, setAssignee] = useState<Assignee | null>(null);
  const [priority, setPriority] = useState<TaskPriority | null>(null);
  const [category, setCategory] = useState<TaskCategory | null>(null);
  const [collapsed, setCollapsed] = useState<Record<GroupId, boolean>>({
    overdue: false,
    soon: false,
    later: false,
    completed: true,
  });

  const rows: Row[] = TASKS.map((t) => {
    const override = doneOverride[t.id];
    const status: TaskStatus =
      override === undefined
        ? t.status
        : override
          ? "done"
          : t.status === "done"
            ? "not_started"
            : t.status;
    const days = daysBetween(TODAY, t.due);
    return { ...t, status, days, overdue: status !== "done" && days < 0 };
  }).sort((a, b) => a.due.getTime() - b.due.getTime());

  const toggleDone = (r: Row) => setDoneOverride((o) => ({ ...o, [r.id]: r.status !== "done" }));

  const q = query.trim().toLowerCase();
  const filtered = rows.filter(
    (r) =>
      (!q || r.title.toLowerCase().includes(q)) &&
      (!assignee || r.assignee === assignee) &&
      (!priority || r.priority === priority) &&
      (!category || r.category === category),
  );
  const visible = filtered.filter((r) => matchesTab(r, tab));

  const done = rows.filter((r) => r.status === "done").length;
  const overdue = rows.filter((r) => r.overdue).length;
  const inProgress = rows.filter((r) => r.status === "in_progress" && !r.overdue).length;
  const notStarted = rows.length - done - overdue - inProgress;
  const pct = Math.round((done / rows.length) * 100);
  const segments = [
    { label: "Done", count: done, color: "#16A34A" },
    { label: "In progress", count: inProgress, color: ACCENT },
    { label: "Not started", count: notStarted, color: "#CBD5E1" },
    { label: "Overdue", count: overdue, color: "#E11D48" },
  ];

  return (
    <>
      {/* Summary */}
      <section
        aria-label="Task progress"
        className="flex flex-wrap items-center gap-6 rounded-[20px] border border-[#E6E8F0] bg-white p-5"
      >
        <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-3.5 pl-1">
          <div className="flex items-center gap-2.5">
            <span className="flex items-baseline gap-1">
              <span className="text-[28px] font-extrabold leading-none tracking-[-0.03em]">
                {done}
              </span>
              <span className="text-[17px] font-semibold tracking-[-0.01em] text-[#64748B]">
                of {rows.length} done
              </span>
            </span>
            <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[13px] font-bold text-[#15803D]">
              {pct}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Tasks done"
            aria-valuemin={0}
            aria-valuemax={rows.length}
            aria-valuenow={done}
            className="flex h-2 gap-[3px]"
          >
            {segments
              .filter((s) => s.count > 0)
              .map((s) => (
                <div
                  key={s.label}
                  className="rounded-full"
                  style={{ flex: `${s.count} 1 0`, background: s.color }}
                />
              ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[#475569]">
            {segments.map((s) => (
              <span key={s.label} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-[3px]" style={{ background: s.color }} />
                {s.label}
                <span className="font-bold text-[#0F172A]">{s.count}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-[1_1_300px] items-center gap-3 rounded-2xl border border-[#E0E2FB] bg-[#F5F5FF] px-4 py-3.5">
          <span
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border border-[#E0E2FB] bg-white"
            style={{ color: ACCENT }}
          >
            <SparklesIcon size={18} />
          </span>
          <span className="flex flex-col gap-0.5 text-sm leading-[1.45] text-[#1E293B]">
            <span className="font-bold text-[#3730A3]">AI tip</span>
            Anna Kim has 2 open tasks this week. Move “Book photographer” to John Smith?
          </span>
        </div>
      </section>

      {/* Task list */}
      <section
        aria-label="Tasks"
        className="overflow-hidden rounded-[20px] border border-[#E6E8F0] bg-white"
      >
        <div
          role="tablist"
          aria-label="Task filter"
          className="flex flex-wrap gap-2 border-b border-[#EEF0F5] px-4"
        >
          {TABS.map((t) => {
            const on = t.id === tab;
            const count = rows.filter((r) => matchesTab(r, t.id)).length;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.id)}
                className={`-mb-px flex h-[50px] cursor-pointer items-center gap-2 border-x-0 border-b-2 border-t-0 border-solid bg-transparent px-3 text-[15px] ${
                  on
                    ? "border-[#4F46E5] font-bold text-[#0F172A]"
                    : "border-transparent font-semibold text-[#475569] hover:text-[#0F172A]"
                }`}
              >
                {t.label}
                <span className={`rounded-full px-2 py-px text-xs font-bold ${t.pill}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-[18px] py-4">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="task-search" className="sr-only">
              Search tasks
            </label>
            <div className="flex h-10 w-64 max-w-full items-center gap-2 rounded-xl border border-[#E6E8F0] bg-white px-3.5">
              <SearchIcon size={16} className="shrink-0 text-[#64748B]" />
              <input
                id="task-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks"
                className="min-w-0 flex-auto border-none bg-transparent text-sm text-[#0F172A] outline-none placeholder:text-[#8A93A6]"
              />
            </div>
            <FilterMenu
              label="Assignee"
              allLabel="Everyone"
              Icon={UserIcon}
              value={assignee}
              onChange={setAssignee}
              options={(Object.keys(ASSIGNEES) as Assignee[]).map((k) => ({
                value: k,
                label: ASSIGNEES[k].name,
              }))}
            />
            <FilterMenu
              label="Priority"
              allLabel="Any priority"
              Icon={FlagIcon}
              value={priority}
              onChange={setPriority}
              options={(Object.keys(PRIORITY_META) as TaskPriority[]).map((k) => ({
                value: k,
                label: PRIORITY_META[k].label,
              }))}
            />
            <FilterMenu
              label="Category"
              allLabel="All categories"
              Icon={FilterIcon}
              value={category}
              onChange={setCategory}
              options={(Object.keys(CATEGORY_COLORS) as TaskCategory[]).map((k) => ({
                value: k,
                label: k,
              }))}
            />
          </div>
          <div
            role="tablist"
            aria-label="Task view"
            className="flex gap-1 rounded-xl bg-[#F1F3F8] p-1"
          >
            {(
              [
                { id: "list", label: "List", Icon: ListBulletIcon },
                { id: "board", label: "Board", Icon: BoardIcon },
              ] as const
            ).map(({ id, label, Icon }) => {
              const on = id === view;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setView(id)}
                  className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-[9px] border-none px-3 text-[13px] font-semibold ${
                    on
                      ? "bg-white text-[#0F172A] shadow-[0_1px_3px_rgba(15,23,42,0.12)]"
                      : "bg-transparent text-[#475569] hover:text-[#0F172A]"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-1 border-t border-[#EEF0F5] px-6 py-12 text-center">
            <span className="text-base font-bold">No matching tasks</span>
            <span className="text-sm text-[#64748B]">Try a different search, tab or filter.</span>
          </div>
        ) : view === "list" ? (
          <div className="overflow-x-auto">
            <div role="table" aria-label="Tasks" className="min-w-[900px]">
              <div
                role="row"
                className={`grid ${COLUMNS} items-center gap-x-3 border-y border-[#EEF0F5] bg-[#FAFBFD] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748B]`}
              >
                <span role="columnheader">
                  <span className="sr-only">Done</span>
                </span>
                <span role="columnheader">Task</span>
                <span role="columnheader">Status</span>
                <span role="columnheader">Priority</span>
                <span role="columnheader">Assignee</span>
                <span role="columnheader">Due</span>
                <span role="columnheader">
                  <span className="sr-only">Actions</span>
                </span>
              </div>

              {GROUPS.map((g) => {
                const items = visible.filter((r) => groupOf(r) === g.id);
                if (items.length === 0) return null;
                const open = tab === "completed" || !collapsed[g.id];
                return (
                  <div key={g.id} role="rowgroup">
                    <div role="row" className="border-b border-[#EEF0F5]">
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setCollapsed((c) => ({ ...c, [g.id]: open }))}
                        className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-6 py-3 text-left"
                      >
                        {open ? (
                          <ChevronDownIcon size={16} className="text-[#64748B]" />
                        ) : (
                          <ChevronRightIcon size={16} className="text-[#64748B]" />
                        )}
                        <span className="h-2 w-2 rounded-full" style={{ background: g.dot }} />
                        <span className="text-sm font-bold" style={{ color: g.labelColor }}>
                          {g.label}
                        </span>
                        <span className="text-sm font-semibold text-[#64748B]">{items.length}</span>
                      </button>
                    </div>
                    {open &&
                      items.map((r) => (
                        <TaskRow key={r.id} row={r} onToggle={() => toggleDone(r)} />
                      ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <TaskBoard rows={visible} onToggle={toggleDone} />
        )}

        <div className="px-6 py-3">
          <button
            type="button"
            className="flex h-11 cursor-pointer items-center gap-2 border-none bg-transparent px-1 text-sm font-bold text-[#4338CA] hover:text-[#3730A3]"
          >
            <PlusIcon size={16} />
            Add task
          </button>
        </div>
      </section>
    </>
  );
}

function DoneCheckbox({ row, onToggle }: { row: Row; onToggle: () => void }) {
  const checked = row.status === "done";
  return (
    <span className="relative flex h-[22px] w-[22px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        aria-label={checked ? `Mark ${row.title} as not done` : `Mark ${row.title} as done`}
        className="peer m-0 h-[22px] w-[22px] cursor-pointer appearance-none rounded-md border-[1.5px] border-solid border-[#CBD2E0] bg-white checked:border-[#16A34A] checked:bg-[#16A34A] hover:border-[#94A3B8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]"
      />
      <CheckIcon
        size={14}
        strokeWidth={3}
        className="pointer-events-none absolute left-1 top-1 hidden text-white peer-checked:block"
      />
    </span>
  );
}

function Avatar({ who }: { who: Assignee }) {
  const p = ASSIGNEES[who];
  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold"
      style={{ background: p.bg, color: p.fg }}
    >
      {p.t}
    </span>
  );
}

function StatusPill({ status }: { status: TaskStatus }) {
  const s = STATUS_META[status];
  return (
    <span
      className="flex h-7 w-fit items-center gap-1.5 rounded-full px-2.5 text-[13px] font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

function Priority({ priority }: { priority: TaskPriority }) {
  const p = PRIORITY_META[priority];
  return (
    <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: p.color }}>
      <FlagIcon size={15} />
      {p.label}
    </span>
  );
}

function CategoryLine({ row }: { row: Row }) {
  return (
    <span className="flex items-center gap-2.5 text-[13px] text-[#64748B]">
      <span className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-sm"
          style={{ background: CATEGORY_COLORS[row.category] }}
        />
        {row.category}
      </span>
      {row.subtasks && (
        <span
          className="flex items-center gap-1"
          aria-label={`${row.subtasks[0]} of ${row.subtasks[1]} subtasks done`}
        >
          <TasksIcon size={13} />
          {row.subtasks[0]}/{row.subtasks[1]}
        </span>
      )}
    </span>
  );
}

function TaskRow({ row: r, onToggle }: { row: Row; onToggle: () => void }) {
  const done = r.status === "done";
  return (
    <div
      role="row"
      className={`grid ${COLUMNS} items-center gap-x-3 border-b border-[#EEF0F5] px-6 py-3 ${
        r.overdue ? "bg-[#FFF8F7] hover:bg-[#FFF1F0]" : "hover:bg-[#F8F9FC]"
      }`}
    >
      <span role="cell">
        <DoneCheckbox row={r} onToggle={onToggle} />
      </span>
      <span role="cell" className="flex min-w-0 flex-col gap-1">
        <span
          className={`truncate text-[15px] font-semibold ${done ? "text-[#64748B] line-through" : "text-[#0F172A]"}`}
        >
          {r.title}
        </span>
        <CategoryLine row={r} />
      </span>
      <span role="cell">
        <StatusPill status={r.status} />
      </span>
      <span role="cell">
        <Priority priority={r.priority} />
      </span>
      <span
        role="cell"
        className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-[#0F172A]"
      >
        <Avatar who={r.assignee} />
        <span className="truncate">{ASSIGNEES[r.assignee].name}</span>
      </span>
      <span role="cell" className="flex flex-col gap-0.5">
        <span
          className={`text-sm font-semibold ${r.overdue ? "text-[#DC2626]" : "text-[#0F172A]"}`}
        >
          {formatDue(r.due)}
        </span>
        <span
          className={`text-[13px] ${r.overdue ? "font-bold text-[#DC2626]" : "text-[#64748B]"}`}
        >
          {dueNote(r)}
        </span>
      </span>
      <span role="cell">
        <button
          type="button"
          aria-label={`More actions for ${r.title}`}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[9px] border-none bg-transparent text-[#64748B] hover:bg-[#F1F3F9] hover:text-[#0F172A]"
        >
          <MoreHorizontalIcon size={18} />
        </button>
      </span>
    </div>
  );
}

const BOARD_COLUMNS: TaskStatus[] = ["not_started", "in_progress", "done"];

function TaskBoard({ rows, onToggle }: { rows: Row[]; onToggle: (r: Row) => void }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 border-t border-[#EEF0F5] bg-[#FAFBFD] p-[18px]">
      {BOARD_COLUMNS.map((status) => {
        const items = rows.filter((r) => r.status === status);
        return (
          <section
            key={status}
            aria-label={STATUS_META[status].label}
            className="flex flex-col gap-2.5"
          >
            <div className="flex items-center gap-2 px-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: STATUS_META[status].dot }}
              />
              <span className="text-sm font-bold">{STATUS_META[status].label}</span>
              <span className="text-sm font-semibold text-[#64748B]">{items.length}</span>
            </div>
            {items.map((r) => (
              <article
                key={r.id}
                className={`flex flex-col gap-3 rounded-2xl border bg-white p-3.5 ${
                  r.overdue ? "border-[#FECDD3]" : "border-[#E6E8F0]"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <DoneCheckbox row={r} onToggle={() => onToggle(r)} />
                  <span className="flex min-w-0 flex-col gap-1">
                    <span
                      className={`text-sm font-semibold ${r.status === "done" ? "text-[#64748B] line-through" : ""}`}
                    >
                      {r.title}
                    </span>
                    <CategoryLine row={r} />
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Priority priority={r.priority} />
                  <span className="flex items-center gap-2">
                    <span
                      className={`text-[13px] font-semibold ${r.overdue ? "text-[#DC2626]" : "text-[#64748B]"}`}
                    >
                      {formatDue(r.due)}
                      {r.overdue && ` · ${dueNote(r)}`}
                    </span>
                    <span title={ASSIGNEES[r.assignee].name}>
                      <Avatar who={r.assignee} />
                    </span>
                  </span>
                </div>
              </article>
            ))}
            {items.length === 0 && (
              <p className="m-0 rounded-2xl border border-dashed border-[#D5D9E4] p-5 text-center text-[13px] text-[#64748B]">
                No tasks
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}

function FilterMenu<T extends string>({
  label,
  allLabel,
  Icon,
  value,
  onChange,
  options,
}: {
  label: string;
  /** Text for the option that clears the filter, e.g. "Everyone". */
  allLabel: string;
  Icon: ComponentType<{ size?: number }>;
  value: T | null;
  onChange: (v: T | null) => void;
  options: { value: T; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    menuRef.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const pick = (v: T | null) => {
    onChange(v);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const item = (v: T | null, text: ReactNode) => {
    const checked = v === value;
    return (
      <button
        key={v ?? "all"}
        type="button"
        role="menuitemradio"
        aria-checked={checked}
        tabIndex={-1}
        onClick={() => pick(v)}
        className="flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-[10px] border-none bg-transparent px-2.5 text-left text-sm font-medium text-[#0F172A] outline-none hover:bg-[#F1F3F9] focus-visible:bg-[#F1F3F9]"
      >
        <span className="flex-auto">{text}</span>
        {checked && <CheckIcon size={16} style={{ color: ACCENT }} />}
      </button>
    );
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm font-semibold ${
          selected
            ? "border-[#C7CBF5] bg-[#F7F7FF] text-[#3730A3]"
            : "border-[#E6E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]"
        }`}
      >
        <Icon size={16} />
        {selected ? selected.label : label}
        <ChevronDownIcon
          size={15}
          className={`text-[#64748B] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label={label}
            onKeyDown={onMenuKeyDown}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-[calc(100%+6px)] z-20 flex w-52 origin-top-left flex-col gap-0.5 rounded-2xl border border-[#E6E8F0] bg-white p-1.5 shadow-[0_18px_40px_-12px_rgba(15,23,42,0.28),0_2px_6px_rgba(15,23,42,0.06)]"
          >
            {item(null, allLabel)}
            <div className="mx-1 my-1 h-px bg-[#EEF0F5]" />
            {options.map((o) => item(o.value, o.label))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
