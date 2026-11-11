"use client";

import { useState } from "react";
import Link from "next/link";
import { ACCENT, EVENTS, PEOPLE, type EventItem } from "./data";
import { ArrowRightIcon, FilterIcon, HeartIcon, MapPinIcon, PlusIcon, SearchIcon } from "./icons";

type Tab = "all" | "active" | "planning" | "completed";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "planning", label: "Planning" },
  { id: "completed", label: "Completed" },
];

function matchesTab(e: EventItem, tab: Tab) {
  if (tab === "all") return true;
  if (tab === "active") return e.status === "Active";
  if (tab === "planning") return e.status === "Planning";
  return e.status === "Completed";
}

export default function EventsList() {
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [fav, setFav] = useState<Record<string, boolean>>({ ad: true });

  const q = query.trim().toLowerCase();
  const list = EVENTS.filter(
    (e) =>
      matchesTab(e, tab) &&
      (!q || e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)),
  );

  return (
    <section aria-labelledby="events-title" className="flex flex-col gap-[18px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h2 id="events-title" className="m-0 text-[22px] font-extrabold tracking-[-0.02em]">
            All events
          </h2>
          <div
            role="tablist"
            aria-label="Filter events"
            className="flex flex-wrap gap-1 rounded-xl bg-[#ECEEF4] p-1"
          >
            {TABS.map((t) => {
              const on = t.id === tab;
              const count = EVENTS.filter((e) => matchesTab(e, t.id)).length;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(t.id)}
                  className={`flex h-9 cursor-pointer items-center gap-1.5 rounded-[9px] border-none px-3 text-[13px] font-semibold ${
                    on
                      ? "bg-white text-[#0F172A] shadow-[0_1px_3px_rgba(15,23,42,0.12)]"
                      : "bg-transparent text-[#475569] hover:text-[#0F172A]"
                  }`}
                >
                  {t.label}
                  <span
                    className={`rounded-full px-[7px] py-px text-xs font-bold ${
                      on ? "bg-[#EEF0FF] text-[#3730A3]" : "bg-[#DFE2EA] text-[#475569]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label htmlFor="ev-search" className="sr-only">
            Search events
          </label>
          <div className="flex h-11 w-60 max-w-full items-center gap-2 rounded-xl border border-[#E6E8F0] bg-white px-3.5">
            <SearchIcon size={17} className="shrink-0 text-[#64748B]" />
            <input
              id="ev-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events"
              className="min-w-0 flex-auto border-none bg-transparent text-sm text-[#0F172A] outline-none placeholder:text-[#8A93A6]"
            />
          </div>
          <button
            type="button"
            className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#E6E8F0] bg-white px-3.5 text-sm font-semibold text-[#334155]"
          >
            <FilterIcon size={17} />
            Soonest first
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-5">
        {list.map((e) => (
          <EventCard
            key={e.id}
            event={e}
            isFav={!!fav[e.id]}
            onToggleFav={() => setFav((f) => ({ ...f, [e.id]: !f[e.id] }))}
          />
        ))}

        {list.length === 0 && (
          <div className="flex min-h-[360px] flex-col justify-center gap-1.5 rounded-[22px] border border-[#E6E8F0] bg-white p-8">
            {tab === "completed" && !q ? (
              <>
                <span className="text-base font-bold">No completed events yet</span>
                <span className="text-sm text-[#64748B]">
                  Events move here after their date passes and you close them out.
                </span>
              </>
            ) : (
              <>
                <span className="text-base font-bold">No matching events</span>
                <span className="text-sm text-[#64748B]">
                  Try a different search or filter.
                </span>
              </>
            )}
          </div>
        )}

        <Link
          href="/events"
          className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-[22px] border-[1.5px] border-dashed border-[#C7CCDA] bg-transparent p-6 text-[#0F172A] no-underline hover:border-[#A5ACC0] hover:bg-white/60"
        >
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#EEF0FF] text-[#4F46E5]">
            <PlusIcon size={24} />
          </span>
          <span className="text-base font-bold">Start a new event</span>
          <span className="max-w-[200px] text-center text-[13px] leading-normal text-[#64748B]">
            Describe it to the AI planner and get a ready-made workspace
          </span>
        </Link>
      </div>
    </section>
  );
}

function EventCard({
  event: e,
  isFav,
  onToggleFav,
}: {
  event: EventItem;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const people = [PEOPLE.DO, PEOPLE.SC, PEOPLE.DL];
  const statusDot = e.status === "Active" ? "#16A34A" : "#F59E0B";

  return (
    <article className="flex flex-col overflow-hidden rounded-[22px] border border-[#E6E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_-18px_rgba(15,23,42,0.18)]">
      {/* Cover */}
      <div className="relative h-[150px] overflow-hidden" style={{ background: e.tint }}>
        <svg
          aria-hidden="true"
          width="220"
          height="220"
          viewBox="0 0 220 220"
          className="absolute -right-[50px] -top-[60px]"
          fill="none"
          stroke={e.ink}
          strokeOpacity={0.16}
          strokeWidth={1.5}
        >
          <circle cx="110" cy="110" r="40" />
          <circle cx="110" cy="110" r="70" />
          <circle cx="110" cy="110" r="100" />
        </svg>

        <div className="absolute left-3.5 right-3.5 top-3.5 flex items-center justify-between">
          <span className="flex h-7 items-center gap-1.5 rounded-full bg-white px-2.5 text-xs font-bold text-[#0F172A]">
            <span className="h-[7px] w-[7px] rounded-full" style={{ background: statusDot }} />
            {e.status}
          </span>
          <button
            type="button"
            onClick={onToggleFav}
            aria-label={isFav ? `Remove ${e.title} from favorites` : `Add ${e.title} to favorites`}
            aria-pressed={isFav}
            className="-mr-2 -mt-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-none bg-transparent"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <HeartIcon
                size={16}
                fill={isFav ? "#E11D48" : "none"}
                stroke={isFav ? "#E11D48" : "#475569"}
              />
            </span>
          </button>
        </div>

        <div className="absolute bottom-3.5 left-3.5 flex items-end gap-3">
          <div className="w-[58px] overflow-hidden rounded-[14px] bg-white text-center shadow-[0_6px_16px_-8px_rgba(15,23,42,0.35)]">
            <div
              className="py-[3px] text-[11px] font-bold tracking-[0.08em] text-white"
              style={{ background: e.ink }}
            >
              {e.mon}
            </div>
            <div className="pb-[7px] pt-1.5 text-2xl font-extrabold leading-none text-[#0F172A]">
              {e.day}
            </div>
          </div>
          <div className="flex flex-col gap-px pb-1">
            <span className="text-xs font-semibold" style={{ color: e.inkText }}>
              Starts in
            </span>
            <span className="text-[17px] font-extrabold tracking-[-0.01em] text-[#0F172A]">
              {e.countdown}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-auto flex-col gap-3.5 px-[18px] pb-4 pt-[18px]">
        <div className="flex flex-col gap-1.5">
          <span
            className="text-xs font-bold uppercase tracking-[0.06em]"
            style={{ color: e.inkText }}
          >
            {e.category}
          </span>
          <h3 className="m-0 text-[19px] font-bold leading-tight tracking-[-0.015em]">
            {e.title}
          </h3>
          <span className="flex items-center gap-1.5 text-sm text-[#64748B]">
            <MapPinIcon size={15} />
            {e.venue}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[13px]">
            <span className="font-medium text-[#64748B]">Planning progress</span>
            <span className="font-bold text-[#0F172A]">{e.progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Planning progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={e.progress}
            className="h-2 overflow-hidden rounded-full bg-[#EEF0F5]"
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${e.progress}%`, background: e.ink }}
            />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2.5 border-t border-[#EEF0F5] pt-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex">
              {people.map((p) => (
                <span
                  key={p.t}
                  className="-mr-2 flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-white text-[11px] font-bold"
                  style={{ background: p.bg, color: p.fg }}
                >
                  {p.t}
                </span>
              ))}
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-white bg-[#F1F5F9] text-[11px] font-bold text-[#475569]">
                +{e.members - people.length}
              </span>
            </div>
            <span className="text-[13px] font-medium text-[#64748B]">{e.members} members</span>
          </div>
          <Link
            href={`/events/${e.id}`}
            aria-label={`Open ${e.title}`}
            className="flex min-h-11 items-center gap-1 px-1 text-sm font-bold no-underline hover:opacity-80"
            style={{ color: ACCENT }}
          >
            Open
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
