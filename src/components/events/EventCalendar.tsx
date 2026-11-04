"use client";

import { useState } from "react";
import Link from "next/link";
import { ACCENT } from "./data";
import {
  DOW,
  EVENT_DAY,
  ITEMS,
  MON3,
  MONTHS,
  TODAY,
  TYPES,
  daysBetween,
  sameDay,
  type CalendarItem,
  type ItemType,
} from "./calendarData";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  FlagIcon,
  MoreVerticalIcon,
  PlusIcon,
} from "./icons";

type View = "month" | "agenda";

const VIEWS: { id: View; label: string }[] = [
  { id: "month", label: "Month" },
  { id: "agenda", label: "Agenda" },
];

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const TYPE_KEYS = Object.keys(TYPES) as ItemType[];
const ALL_ON: Record<ItemType, boolean> = {
  task: true,
  meeting: true,
  milestone: true,
  event: true,
};

/** Months are tracked as `year * 12 + month` so prev/next is plain arithmetic. */
const monthIndex = (d: Date) => d.getFullYear() * 12 + d.getMonth();

function decorate(x: CalendarItem) {
  const t = TYPES[x.type];
  const overdue = !!x.overdue;
  return {
    ...x,
    dot: overdue ? "#E11D48" : t.dot,
    bg: overdue ? "#FFE4E6" : t.bg,
    fg: overdue ? "#881337" : t.fg,
    chip: (x.t ? `${x.t} ` : "") + x.title,
    timeLabel: x.t ?? "All day",
    typeLabel: overdue ? "Overdue task" : t.label,
    state: x.done ? "Done" : overdue ? "Overdue" : "Scheduled",
    stateBg: x.done ? "#DCFCE7" : overdue ? "#FFE4E6" : "#F1F5F9",
    stateFg: x.done ? "#166534" : overdue ? "#9F1239" : "#475569",
  };
}

type Decorated = ReturnType<typeof decorate>;

// Event day first, then by start time (all-day items lead).
const byTime = (a: CalendarItem, b: CalendarItem) =>
  Number(b.type === "event") - Number(a.type === "event") ||
  (a.t ?? "00").localeCompare(b.t ?? "00");

// Legend dot for the event-day filter; its chip dot is white on accent.
const legendDot = (k: ItemType) => (k === "event" ? ACCENT : TYPES[k].dot);

export default function EventCalendar({ eventId }: { eventId: string }) {
  const [ym, setYm] = useState(monthIndex(TODAY));
  const [sel, setSel] = useState(TODAY);
  const [view, setView] = useState<View>("month");
  const [filters, setFilters] = useState(ALL_ON);

  const y = Math.floor(ym / 12);
  const m = ym % 12;
  const visible = ITEMS.filter((x) => filters[x.type]);
  const itemsOn = (d: Date) =>
    visible
      .filter((x) => sameDay(x.date, d))
      .sort(byTime)
      .map(decorate);
  const inMonth = (x: CalendarItem) => monthIndex(x.date) === ym;

  const select = (d: Date) => {
    setSel(d);
    setYm(monthIndex(d));
  };

  // Month grid: whole weeks covering the month.
  const offset = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = Array.from(
    { length: Math.ceil((offset + daysInMonth) / 7) * 7 },
    (_, i) => new Date(y, m, 1 - offset + i),
  );

  // Agenda view: visible items in this month, grouped by day.
  const agendaDays = Array.from(new Set(visible.filter(inMonth).map((x) => x.date.getDate())))
    .sort((a, b) => a - b)
    .map((num) => new Date(y, m, num));

  const upcoming = ITEMS.filter((x) => x.date > TODAY && x.title !== "Weekly team check-in").slice(
    0,
    5,
  );
  const overdue = ITEMS.filter((x) => x.overdue);

  return (
    <div className="flex flex-wrap items-start gap-[22px]">
      {/* Calendar card */}
      <section
        aria-label={`${MONTHS[m]} ${y}`}
        className="min-w-0 flex-[999_1_620px] overflow-hidden rounded-[20px] border border-[#E6E8F0] bg-white"
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-[18px] py-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="m-0 mr-1.5 min-w-[168px] text-xl font-extrabold tracking-[-0.02em]">
              {MONTHS[m]} {y}
            </h2>
            <div className="flex overflow-hidden rounded-xl border border-[#E6E8F0]">
              <button
                type="button"
                onClick={() => setYm(ym - 1)}
                aria-label="Previous month"
                className="flex h-10 w-10 cursor-pointer items-center justify-center border-y-0 border-l-0 border-r border-solid border-[#E6E8F0] bg-white text-[#334155] hover:bg-[#F1F3F9]"
              >
                <ChevronLeftIcon size={18} />
              </button>
              <button
                type="button"
                onClick={() => select(TODAY)}
                className="h-10 cursor-pointer border-none bg-white px-3.5 text-[13px] font-bold text-[#0F172A] hover:bg-[#F1F3F9]"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setYm(ym + 1)}
                aria-label="Next month"
                className="flex h-10 w-10 cursor-pointer items-center justify-center border-y-0 border-l border-r-0 border-solid border-[#E6E8F0] bg-white text-[#334155] hover:bg-[#F1F3F9]"
              >
                <ChevronRightIcon size={18} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                select(EVENT_DAY);
                setView("month");
              }}
              className="flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-dashed border-[#C7CBF5] bg-[#F7F7FF] px-3 text-[13px] font-bold text-[#3730A3]"
            >
              <FlagIcon size={15} />
              Jump to event day
            </button>
          </div>
          <div
            role="tablist"
            aria-label="Calendar view"
            className="flex gap-1 rounded-xl bg-[#F1F3F8] p-1"
          >
            {VIEWS.map((v) => {
              const on = v.id === view;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setView(v.id)}
                  className={`h-[34px] cursor-pointer rounded-[9px] border-none px-3.5 text-[13px] font-semibold ${
                    on
                      ? "bg-white text-[#0F172A] shadow-[0_1px_3px_rgba(15,23,42,0.12)]"
                      : "bg-transparent text-[#475569] hover:text-[#0F172A]"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters / legend */}
        <div className="flex flex-wrap items-center gap-2 px-[18px] pb-3.5">
          <span className="mr-0.5 text-xs font-semibold text-[#64748B]">Show</span>
          {TYPE_KEYS.map((k) => {
            const on = filters[k];
            return (
              <button
                key={k}
                type="button"
                aria-pressed={on}
                onClick={() => setFilters({ ...filters, [k]: !on })}
                className={`flex h-8 cursor-pointer items-center gap-[7px] rounded-full border px-3 text-xs font-semibold ${
                  on
                    ? "border-[#D5D9E4] bg-white text-[#0F172A]"
                    : "border-[#EEF0F5] bg-[#F8FAFC] text-[#64748B]"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-[3px]"
                  style={{ background: legendDot(k), opacity: on ? 1 : 0.35 }}
                />
                {TYPES[k].label}
                <span className="font-bold text-[#64748B]">
                  {ITEMS.filter((x) => inMonth(x) && x.type === k).length}
                </span>
              </button>
            );
          })}
        </div>

        {view === "month" ? (
          <div className="overflow-x-auto border-t border-[#E6E8F0]">
            <div className="min-w-[700px]">
              <div
                aria-hidden="true"
                className="grid grid-cols-7 border-b border-[#E6E8F0] bg-[#FAFBFD]"
              >
                {WEEKDAYS.map((w, i) => (
                  <span
                    key={w}
                    className={`px-3 py-2.5 text-[11px] font-bold tracking-[0.08em] ${
                      i === 0 || i === 6 ? "text-[#94A3B8]" : "text-[#64748B]"
                    }`}
                  >
                    {w}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-[#EDEFF4]">
                {cells.map((d) => {
                  const current = d.getMonth() === m;
                  const isToday = sameDay(d, TODAY);
                  const isSel = sameDay(d, sel);
                  const weekend = d.getDay() === 0 || d.getDay() === 6;
                  const its = itemsOn(d);
                  return (
                    <button
                      key={d.getTime()}
                      type="button"
                      onClick={() => select(d)}
                      aria-pressed={isSel}
                      aria-label={`${DOW[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}, ${its.length} ${
                        its.length === 1 ? "item" : "items"
                      }`}
                      className={`flex min-h-[118px] cursor-pointer flex-col gap-1 border-none p-2 text-left text-inherit hover:bg-[#F8F9FF] ${
                        isSel
                          ? "bg-[#F5F5FF] shadow-[inset_0_0_0_2px_#4F46E5]"
                          : !current
                            ? "bg-[#FAFBFD]"
                            : weekend
                              ? "bg-[#FCFCFE]"
                              : "bg-white"
                      }`}
                    >
                      <span className="flex w-full items-center justify-between">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] ${
                            isToday || isSel ? "font-extrabold" : "font-semibold"
                          } ${isToday ? "text-white" : current ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
                          style={isToday ? { background: ACCENT } : undefined}
                        >
                          {d.getDate()}
                        </span>
                        {isToday && (
                          <span
                            className="text-[10px] font-extrabold tracking-[0.06em]"
                            style={{ color: ACCENT }}
                          >
                            TODAY
                          </span>
                        )}
                      </span>
                      {its.slice(0, 3).map((e) => (
                        <span
                          key={e.chip}
                          className="box-border flex h-6 w-full items-center gap-1.5 overflow-hidden rounded-[7px] px-[7px] text-xs font-semibold"
                          style={{ background: e.bg, color: e.fg }}
                        >
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-sm"
                            style={{ background: e.dot }}
                          />
                          <span className={`truncate ${e.done ? "line-through" : ""}`}>
                            {e.chip}
                          </span>
                        </span>
                      ))}
                      {its.length > 3 && (
                        <span className="pl-1 text-xs font-bold text-[#475569]">
                          +{its.length - 3} more
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t border-[#E6E8F0] px-2.5 pb-3.5 pt-2">
            {agendaDays.map((d) => (
              <div
                key={d.getTime()}
                className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-b border-[#F1F3F8] px-2 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-[#64748B]">
                    {DOW[d.getDay()].slice(0, 3)}
                  </span>
                  <span
                    className="text-xl font-extrabold tracking-[-0.02em]"
                    style={{ color: sameDay(d, TODAY) ? ACCENT : "#0F172A" }}
                  >
                    {d.getDate()}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {itemsOn(d).map((e) => (
                    <div
                      key={e.chip}
                      className="flex items-center gap-3 rounded-xl border border-[#EEF0F5] bg-[#FAFBFD] px-3 py-2.5"
                    >
                      <span className="w-1 self-stretch rounded" style={{ background: e.dot }} />
                      <span className="w-[52px] text-[13px] font-bold tabular-nums text-[#334155]">
                        {e.timeLabel}
                      </span>
                      <span className="flex min-w-0 flex-auto flex-col gap-0.5">
                        <span className={`text-sm font-semibold ${e.done ? "line-through" : ""}`}>
                          {e.title}
                        </span>
                        <span className="text-xs text-[#64748B]">
                          {e.typeLabel} · {e.owner}
                        </span>
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                        style={{ background: e.stateBg, color: e.stateFg }}
                      >
                        {e.state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {agendaDays.length === 0 && (
              <p className="m-0 px-2 py-8 text-center text-sm text-[#64748B]">
                Nothing scheduled this month.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Right panel */}
      <aside aria-label="Day details" className="flex min-w-0 flex-[1_1_300px] flex-col gap-[18px]">
        <Link
          href={`/events/${eventId}/tasks`}
          className="flex items-center gap-3 rounded-2xl border border-[#FECDD3] bg-[#FFF1F2] px-4 py-3.5 text-[#0F172A] no-underline"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#FFE4E6] text-[#BE123C]">
            <ClockIcon size={18} strokeWidth={2} />
          </span>
          <span className="flex flex-auto flex-col gap-0.5">
            <span className="text-sm font-bold">{overdue.length} tasks overdue</span>
            <span className="text-xs text-[#9F1239]">
              {overdue.map((x) => x.title).join(" · ")}
            </span>
          </span>
          <ChevronRightIcon size={16} className="text-[#9F1239]" />
        </Link>

        <SelectedDay date={sel} items={itemsOn(sel)} />

        <section
          aria-labelledby="cal-up-title"
          className="rounded-[20px] border border-[#E6E8F0] bg-white px-2.5 pb-2.5 pt-[18px]"
        >
          <h2 id="cal-up-title" className="mx-2 mb-2 mt-0 text-base font-bold tracking-[-0.01em]">
            Coming up
          </h2>
          <ul className="m-0 list-none p-0">
            {upcoming.map((x) => {
              const n = daysBetween(TODAY, x.date);
              return (
                <li key={x.title + x.date.getTime()}>
                  <button
                    type="button"
                    onClick={() => {
                      select(x.date);
                      setView("month");
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-none bg-transparent px-2 py-[9px] text-left text-inherit hover:bg-[#F8F9FC]"
                  >
                    <span className="w-[42px] shrink-0 overflow-hidden rounded-[10px] border border-[#E6E8F0] text-center">
                      <span className="block bg-[#F8FAFC] py-0.5 text-[9px] font-extrabold tracking-[0.08em] text-[#64748B]">
                        {MON3[x.date.getMonth()]}
                      </span>
                      <span className="block pb-1 pt-[3px] text-base font-extrabold">
                        {x.date.getDate()}
                      </span>
                    </span>
                    <span className="flex min-w-0 flex-auto flex-col gap-[3px]">
                      <span className="truncate text-sm font-semibold">{x.title}</span>
                      <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
                        <span
                          className="h-1.5 w-1.5 rounded-sm"
                          style={{ background: legendDot(x.type) }}
                        />
                        {TYPES[x.type].label} · {n === 1 ? "tomorrow" : `in ${n} days`}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </aside>
    </div>
  );
}

function SelectedDay({ date, items }: { date: Date; items: Decorated[] }) {
  const isToday = sameDay(date, TODAY);
  const isEventDay = sameDay(date, EVENT_DAY);
  const diff = daysBetween(TODAY, date);
  const tag = isEventDay
    ? "Event day"
    : isToday
      ? null
      : diff > 0
        ? `In ${diff} days`
        : `${Math.abs(diff)} days ago`;

  return (
    <section
      aria-labelledby="sel-title"
      className="overflow-hidden rounded-[20px] border border-[#E6E8F0] bg-white"
    >
      <div className="flex items-start justify-between gap-2.5 px-[18px] pb-3 pt-[18px]">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-[#64748B]">
            {isToday ? `Today · ${DOW[date.getDay()]}` : DOW[date.getDay()]}
          </span>
          <h2 id="sel-title" className="m-0 text-xl font-extrabold tracking-[-0.02em]">
            {date.getDate()} {MONTHS[date.getMonth()]} {date.getFullYear()}
          </h2>
        </div>
        {tag && (
          <span
            className={`rounded-full px-[9px] py-[3px] text-[11px] font-extrabold ${
              isEventDay ? "text-white" : "bg-[#F1F5F9] text-[#475569]"
            }`}
            style={isEventDay ? { background: ACCENT } : undefined}
          >
            {tag}
          </span>
        )}
      </div>

      {items.length > 0 ? (
        <ul className="m-0 list-none px-2.5 pb-1.5 pt-0">
          {items.map((e) => (
            <li key={e.chip} className="flex gap-3 rounded-xl px-2 py-2.5 hover:bg-[#F8F9FC]">
              <span className="w-1 rounded" style={{ background: e.dot }} />
              <span className="flex min-w-0 flex-auto flex-col gap-[3px]">
                <span className="text-xs font-bold text-[#64748B]">
                  {e.timeLabel} · {e.typeLabel}
                </span>
                <span className={`text-sm font-bold ${e.done ? "line-through" : ""}`}>
                  {e.title}
                </span>
                <span className="text-xs text-[#64748B]">{e.owner}</span>
              </span>
              <button
                type="button"
                aria-label={`More actions for ${e.title}`}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[9px] border-none bg-transparent text-[#64748B] hover:bg-[#F1F3F9]"
              >
                <MoreVerticalIcon size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-[18px] mb-1.5 flex flex-col gap-1 rounded-[14px] border border-dashed border-[#D5D9E4] bg-[#FAFBFD] p-5 text-center">
          <span className="text-sm font-bold">Nothing scheduled</span>
          <span className="text-[13px] text-[#64748B]">This day is free.</span>
        </div>
      )}

      <div className="px-[18px] pb-[18px] pt-2.5">
        <button
          type="button"
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E6E8F0] bg-white text-[13px] font-bold text-[#0F172A] hover:bg-[#F8FAFC]"
        >
          <PlusIcon size={16} />
          Add to this day
        </button>
      </div>
    </section>
  );
}
