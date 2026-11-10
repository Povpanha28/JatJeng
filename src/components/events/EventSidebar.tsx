"use client";

import { useEffect, useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ACCENT, EVENTS, type EventItem } from "./data";
import { DateChip, statusDot } from "./DateChip";
import JumpTo from "./JumpTo";
import {
  CalendarAltIcon,
  ChartIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronsUpDownIcon,
  FileIcon,
  GridIcon,
  PanelCloseIcon,
  PanelOpenIcon,
  PlusIcon,
  ShieldIcon,
  SlidersIcon,
  SparklesIcon,
  TasksIcon,
  UsersIcon,
  WalletIcon,
} from "./icons";

type NavItem = {
  id: string;
  label: string;
  Icon: ComponentType<{ size?: number }>;
  badge?: number;
  /** Sub-path under /events/[id]; items without one are placeholders until their screens exist. */
  path?: string;
};

const GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Plan",
    items: [
      { id: "overview", label: "Overview", Icon: GridIcon, path: "" },
      { id: "calendar", label: "Calendar", Icon: CalendarAltIcon, path: "/calendar" },
      { id: "tasks", label: "Tasks", Icon: TasksIcon, badge: 2, path: "/tasks" },
      { id: "team", label: "Team", Icon: UsersIcon },
      { id: "budget", label: "Budget", Icon: WalletIcon, path: "/budget" },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "stats", label: "Statistics", Icon: ChartIcon, path: "/statistics" },
      { id: "docs", label: "Documents", Icon: FileIcon, path: "/documents" },
    ],
  },
  {
    label: "Manage",
    items: [
      { id: "roles", label: "Roles & permissions", Icon: ShieldIcon, path: "/roles" },
      { id: "settings", label: "Event settings", Icon: SlidersIcon },
    ],
  },
];

const NAV_ITEMS = GROUPS.flatMap((g) => g.items);

const navHref = (event: EventItem, item: NavItem) =>
  item.path === undefined ? "#" : `/events/${event.id}${item.path}`;

/** The nav item whose route matches the current path; Overview when nothing more specific does. */
function useActiveId(event: EventItem) {
  const pathname = usePathname();
  const match = NAV_ITEMS.find((i) => i.path && pathname === `/events/${event.id}${i.path}`);
  return match?.id ?? "overview";
}


function EventSwitcher({ event }: { event: EventItem }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
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

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Switch event. Current: ${event.title}`}
        className="flex w-full cursor-pointer items-center gap-3 rounded-[14px] border border-[#E6E8F0] bg-[#FAFAFC] p-2.5 text-left"
      >
        <DateChip event={event} size="md" />
        <span className="flex min-w-0 flex-auto flex-col gap-0.5">
          <span className="truncate text-sm font-bold text-[#0F172A]">{event.title}</span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusDot(event) }} />
            {event.status} · {event.daysLeft} days left
          </span>
        </span>
        <ChevronsUpDownIcon size={16} className="shrink-0 text-[#64748B]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label="Switch event"
            onKeyDown={onMenuKeyDown}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-[31] flex origin-top flex-col gap-0.5 rounded-2xl border border-[#E6E8F0] bg-white p-2 shadow-[0_18px_40px_-12px_rgba(15,23,42,0.28),0_2px_6px_rgba(15,23,42,0.06)]"
          >
            <span className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748B]">
              Your events
            </span>
            {EVENTS.map((ev) => {
              const current = ev.id === event.id;
              return (
                <Link
                  key={ev.id}
                  href={`/events/${ev.id}`}
                  role="menuitem"
                  tabIndex={-1}
                  aria-current={current ? "true" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-[#0F172A] no-underline outline-none hover:bg-[#F1F3F9] focus-visible:bg-[#F1F3F9] ${
                    current ? "bg-[#F5F5FF]" : ""
                  }`}
                >
                  <DateChip event={ev} size="sm" />
                  <span className="flex min-w-0 flex-auto flex-col gap-0.5">
                    <span className="truncate text-sm font-bold">{ev.title}</span>
                    <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusDot(ev) }} />
                      {ev.status} · {ev.daysLeft} days left
                    </span>
                  </span>
                  {current && <CheckIcon size={18} style={{ color: ACCENT }} />}
                </Link>
              );
            })}
            <div className="mx-1 my-1.5 h-px bg-[#EEF0F5]" />
            <Link
              href="/events/all"
              role="menuitem"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="flex h-10 items-center gap-2.5 rounded-[10px] px-2.5 text-[13px] font-semibold text-[#334155] no-underline outline-none hover:bg-[#F1F3F9] focus-visible:bg-[#F1F3F9]"
            >
              <GridIcon size={16} strokeWidth={2} />
              View all events
            </Link>
            <Link
              href="/events"
              role="menuitem"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="flex h-10 items-center gap-2.5 rounded-[10px] px-2.5 text-[13px] font-bold text-[#4338CA] no-underline outline-none hover:bg-[#F1F3F9] focus-visible:bg-[#F1F3F9]"
            >
              <PlusIcon size={16} />
              Create new event
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EventSidebar({ event }: { event: EventItem }) {
  const [collapsed, setCollapsed] = useState(false);
  const active = useActiveId(event);

  if (collapsed) {
    return (
      <aside
        aria-label="Event workspace"
        className="print:hidden flex flex-[0_0_76px] flex-col items-center gap-1.5 border-r border-[#E6E8F0] bg-white py-4"
      >
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[#E6E8F0] bg-white text-[#475569] hover:bg-[#F1F3F9]"
        >
          <PanelOpenIcon size={18} />
        </button>
        <span className="mb-2.5 mt-2" title={event.title}>
          <span className="sr-only">{event.title}</span>
          <DateChip event={event} size="md" />
        </span>
        {NAV_ITEMS.map((item) => {
          const { id, label, Icon, badge } = item;
          const on = id === active;
          return (
            <Link
              key={id}
              href={navHref(event, item)}
              aria-label={label}
              title={label}
              aria-current={on ? "page" : undefined}
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${
                on ? "bg-[#EEF0FF]" : "text-[#64748B] hover:bg-[#F1F3F9]"
              }`}
              style={on ? { color: ACCENT } : undefined}
            >
              <Icon size={20} />
              {badge ? (
                <span className="absolute right-[7px] top-[7px] h-2 w-2 rounded-full border-2 border-white bg-[#E11D48]" />
              ) : null}
            </Link>
          );
        })}
        <button
          type="button"
          aria-label="AI Assistant"
          title="AI Assistant"
          className="mt-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border-none bg-[#0F172A] text-white"
        >
          <SparklesIcon size={18} />
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Event workspace"
      className="box-border flex max-w-full flex-[1_1_280px] flex-col print:hidden border-r border-[#E6E8F0] bg-white px-3.5 pb-6 pt-4"
    >
      <div className="flex items-center justify-between px-0.5 pb-3">
        <Link
          href="/events/all"
          className="flex min-h-9 items-center gap-1.5 rounded-lg pl-1 pr-2 text-[13px] font-semibold text-[#475569] no-underline hover:text-[#0F172A]"
        >
          <ChevronLeftIcon size={16} />
          All events
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Collapse sidebar"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-[#E6E8F0] bg-white text-[#475569] hover:bg-[#F1F3F9]"
        >
          <PanelCloseIcon size={18} />
        </button>
      </div>

      <EventSwitcher event={event} />

      <JumpTo className="mt-3" />

      <nav aria-label="Workspace" className="mt-[18px] flex flex-col gap-[18px]">
        {GROUPS.map((g) => (
          <div key={g.label} className="flex flex-col gap-0.5">
            <span className="px-2.5 pb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748B]">
              {g.label}
            </span>
            {g.items.map((item) => {
              const { id, label, Icon, badge } = item;
              const on = id === active;
              return (
                <Link
                  key={id}
                  href={navHref(event, item)}
                  aria-current={on ? "page" : undefined}
                  className={`flex h-10 items-center gap-3 rounded-[10px] px-2.5 text-sm no-underline ${
                    on
                      ? "bg-[#EEF0FF] font-bold text-[#312E81]"
                      : "font-medium text-[#334155] hover:bg-[#F1F3F9]"
                  }`}
                >
                  <span className="flex" style={{ color: on ? ACCENT : "#64748B" }}>
                    <Icon size={19} />
                  </span>
                  <span className="flex-auto">{label}</span>
                  {badge ? (
                    <span
                      aria-label={`${badge} tasks due`}
                      className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFE4E6] px-1.5 text-[11px] font-extrabold text-[#BE123C]"
                    >
                      {badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <button
        type="button"
        className="mt-6 flex w-full cursor-pointer items-center gap-3 rounded-[14px] border-none bg-[#0F172A] p-3 text-left text-white"
      >
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-white/[0.12]">
          <SparklesIcon size={18} />
        </span>
        <span className="flex flex-auto flex-col gap-px">
          <span className="text-sm font-bold">AI Assistant</span>
          <span className="text-xs text-[#CBD5E1]">Ask about tasks, budget, guests</span>
        </span>
      </button>
    </aside>
  );
}
