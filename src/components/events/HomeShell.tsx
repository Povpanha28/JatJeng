"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import AccountMenu from "./AccountMenu";
import { DateChip, statusDot } from "./DateChip";
import JumpTo from "./JumpTo";
import { ACCENT, EVENTS } from "./data";
import {
  BellIcon,
  GridIcon,
  MenuIcon,
  PanelCloseIcon,
  PanelOpenIcon,
  PlusIcon,
  XIcon,
} from "./icons";

type NavItem = {
  id: string;
  label: string;
  href: string;
  Icon: ComponentType<{ size?: number }>;
  count?: number;
};

const NAV: NavItem[] = [
  { id: "events", label: "Your events", href: "/events/all", Icon: GridIcon, count: EVENTS.length },
];

/**
 * App shell for the events home: a left sidebar (new event, your events, recent events) and the
 * page. Collapses to an icon rail on desktop and becomes a drawer below the md breakpoint.
 */
export default function HomeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  // The rail is a desktop-only state; the mobile drawer always shows the full sidebar.
  const rail = collapsed && !drawerOpen;
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="flex min-h-screen flex-1 bg-[#F6F7FB] text-[#0F172A]">
      {drawerOpen && (
        <div
          aria-hidden="true"
          onClick={closeDrawer}
          className="fixed inset-0 z-30 bg-[#0F172A]/40 md:hidden"
        />
      )}

      <aside
        aria-label="Sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] max-w-[85vw] shrink-0 flex-col border-r border-[#E6E8F0] bg-white transition-[transform,visibility] duration-200 ease-out motion-reduce:transition-none md:sticky md:top-0 md:h-screen md:max-w-none md:translate-x-0 md:visible ${
          drawerOpen ? "translate-x-0" : "invisible -translate-x-full"
        } ${rail ? "md:w-[76px]" : "md:w-[272px]"}`}
      >
        {/* Brand + collapse */}
        <div
          className={`flex items-center pb-3 pt-4 ${rail ? "flex-col gap-3 px-0" : "justify-between pl-5 pr-3.5"}`}
        >
          <Link href="/" aria-label="JatJeng home" className="flex rounded-lg no-underline">
            {rail ? (
              <Image src="/images/Brick.png" alt="" width={32} height={32} className="h-8 w-8" />
            ) : (
              <Logo />
            )}
          </Link>
          <button
            type="button"
            onClick={() => (drawerOpen ? closeDrawer() : setCollapsed((v) => !v))}
            aria-label={drawerOpen ? "Close sidebar" : rail ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border-none bg-transparent text-[#64748B] hover:bg-[#F1F3F9] hover:text-[#0F172A]"
          >
            {drawerOpen ? (
              <XIcon size={20} />
            ) : rail ? (
              <PanelOpenIcon size={20} />
            ) : (
              <PanelCloseIcon size={20} />
            )}
          </button>
        </div>

        <div className={`flex min-h-0 flex-1 flex-col overflow-y-auto pb-5 ${rail ? "items-center px-0" : "px-3.5"}`}>
          {/* Start a new event from the AI prompt */}
          <Link
            href="/events"
            onClick={closeDrawer}
            aria-label={rail ? "New event" : undefined}
            title={rail ? "New event" : undefined}
            className={
              rail
                ? "group mb-3 flex h-11 w-11 items-center justify-center rounded-xl no-underline"
                : "group mb-3 flex h-12 w-full items-center gap-3 rounded-[14px] border border-[#E6E8F0] bg-white pl-2 pr-3 text-sm font-semibold text-[#0F172A] no-underline shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-colors hover:border-[#D5D8F5] hover:bg-[#FAFAFF]"
            }
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#0F172A] text-white transition-colors group-hover:bg-[#4F46E5]">
              <PlusIcon size={16} />
            </span>
            {!rail && "New event"}
          </Link>

          <JumpTo compact={rail} className="mb-3" />

          <nav aria-label="Main" className={`flex flex-col gap-0.5 ${rail ? "items-center" : ""}`}>
            {NAV.map(({ id, label, href, Icon, count }) => {
              const on = pathname === href;
              if (rail) {
                return (
                  <Link
                    key={id}
                    href={href}
                    aria-label={label}
                    title={label}
                    aria-current={on ? "page" : undefined}
                    onClick={closeDrawer}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      on ? "bg-[#EEF0FF]" : "text-[#64748B] hover:bg-[#F1F3F9]"
                    }`}
                    style={on ? { color: ACCENT } : undefined}
                  >
                    <Icon size={20} />
                  </Link>
                );
              }
              return (
                <Link
                  key={id}
                  href={href}
                  aria-current={on ? "page" : undefined}
                  onClick={closeDrawer}
                  className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm no-underline transition-colors ${
                    on
                      ? "bg-[#EEF0FF] font-bold text-[#312E81]"
                      : "font-medium text-[#334155] hover:bg-[#F1F3F9]"
                  }`}
                >
                  <span className="flex" style={{ color: on ? ACCENT : "#64748B" }}>
                    <Icon size={19} />
                  </span>
                  <span className="flex-auto">{label}</span>
                  {count !== undefined && (
                    <span
                      className={`rounded-full px-2 py-px text-xs font-bold ${
                        on ? "bg-white text-[#3730A3]" : "bg-[#EEF0F5] text-[#475569]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Recent events — quick jumps into a workspace */}
          <div className={`mt-6 flex flex-col gap-0.5 ${rail ? "items-center gap-2" : ""}`}>
            {!rail && (
              <div className="flex items-center justify-between px-3 pb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748B]">
                  Recent events
                </span>
                <Link
                  href="/events/all"
                  onClick={closeDrawer}
                  className="text-xs font-semibold text-[#4338CA] no-underline hover:underline"
                >
                  View all
                </Link>
              </div>
            )}
            {EVENTS.map((ev) =>
              rail ? (
                <Link
                  key={ev.id}
                  href={`/events/${ev.id}`}
                  aria-label={ev.title}
                  title={ev.title}
                  className="flex rounded-[10px]"
                >
                  <DateChip event={ev} size="sm" />
                </Link>
              ) : (
                <Link
                  key={ev.id}
                  href={`/events/${ev.id}`}
                  onClick={closeDrawer}
                  className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-[#0F172A] no-underline hover:bg-[#F1F3F9]"
                >
                  <DateChip event={ev} size="sm" />
                  <span className="flex min-w-0 flex-auto flex-col gap-0.5">
                    <span className="truncate text-[13px] font-semibold">{ev.title}</span>
                    <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: statusDot(ev) }}
                      />
                      {ev.status} · {ev.daysLeft} days
                    </span>
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>

        {/* Profile + notifications */}
        <div
          className={`flex border-t border-[#EEF0F5] py-3 ${
            rail ? "flex-col items-center gap-1.5 px-0" : "items-center gap-1.5 px-3.5"
          }`}
        >
          <div className={rail ? "" : "min-w-0 flex-1"}>
            <AccountMenu placement="up" variant={rail ? "avatar" : "row"} />
          </div>
          <button
            type="button"
            aria-label="Notifications, 2 unread"
            title={rail ? "Notifications" : undefined}
            className={`relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border-none bg-transparent text-[#64748B] hover:bg-[#F1F3F9] hover:text-[#0F172A] ${
              rail ? "order-first" : ""
            }`}
          >
            <BellIcon size={20} />
            <span className="absolute right-[11px] top-2.5 h-2 w-2 rounded-full border-2 border-white bg-[#EF4444]" />
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile only: the sidebar holds everything else */}
        <header className="sticky top-0 z-20 flex h-[72px] items-center bg-[#F6F7FB]/85 px-4 backdrop-blur sm:px-6 md:hidden">
          <button
            type="button"
            onClick={() => {
              setCollapsed(false);
              setDrawerOpen(true);
            }}
            aria-label="Open sidebar"
            aria-expanded={drawerOpen}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[#E6E8F0] bg-white text-[#475569]"
          >
            <MenuIcon size={20} />
          </button>
        </header>
        <div className="hidden h-6 md:block" />

        {children}
      </div>
    </div>
  );
}
