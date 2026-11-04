import Link from "next/link";
import { ACCENT, type EventItem } from "./data";
import { ACTIVITY, MILESTONES, UPCOMING } from "./workspaceData";
import { CheckIcon, ChevronRightIcon, ClockIcon, MailIcon, SparklesIcon } from "./icons";

const card = "rounded-[20px] border border-[#E6E8F0] bg-white";
const cardTitle = "m-0 text-[17px] font-bold tracking-[-0.01em]";
const cardLink =
  "flex min-h-11 items-center text-[13px] font-bold text-[#4338CA] no-underline hover:text-[#3730A3]";

export function Milestones({ eventId }: { eventId: string }) {
  const done = MILESTONES.filter((m) => m.s === "done").length;

  return (
    <section aria-labelledby="tl-title" className={`${card} px-6 py-[22px]`}>
      <div className="mb-[22px] flex items-center justify-between gap-3">
        <div>
          <h2 id="tl-title" className={cardTitle}>
            Milestones
          </h2>
          <p className="m-0 mt-1 text-[13px] text-[#64748B]">
            {done} of {MILESTONES.length} complete · next due 12 Nov
          </p>
        </div>
        <Link href={`/events/${eventId}/calendar`} className={cardLink}>
          View in calendar
        </Link>
      </div>
      <div className="overflow-x-auto">
        <ol className="m-0 grid min-w-[620px] list-none grid-cols-5 p-0">
          {MILESTONES.map((m, i) => {
            const next = MILESTONES[i + 1];
            const isDone = m.s === "done";
            const isCurrent = m.s === "current";
            const line = !next
              ? "transparent"
              : isDone && next.s !== "todo"
                ? "#16A34A"
                : "#E2E8F0";
            return (
              <li key={m.title} className="flex flex-col gap-2.5 pr-3">
                <div className="flex items-center">
                  <span
                    className="box-border flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-white"
                    style={{
                      background: isDone ? "#16A34A" : "#FFFFFF",
                      borderColor: isDone ? "#16A34A" : isCurrent ? ACCENT : "#CBD5E1",
                    }}
                  >
                    {isDone && <CheckIcon size={14} strokeWidth={3} />}
                    {isCurrent && (
                      <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
                    )}
                  </span>
                  <span className="ml-2 h-0.5 flex-auto rounded-sm" style={{ background: line }} />
                </div>
                <div className="flex flex-col gap-[3px]">
                  <span
                    className="text-xs font-bold"
                    style={{ color: isCurrent ? ACCENT : isDone ? "#15803D" : "#64748B" }}
                  >
                    {m.date}
                  </span>
                  <span className="text-sm font-bold leading-[1.3]">{m.title}</span>
                  <span className="text-xs leading-[1.45] text-[#64748B]">{m.note}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function AboutEvent({ event }: { event: EventItem }) {
  const facts = [
    { label: "Organizer", value: "Dyna Ou" },
    { label: "Expected guests", value: String(event.guests) },
    { label: "Team", value: `${event.members} members` },
    { label: "Close-out", value: "Mon, 21 Dec" },
  ];

  return (
    <section aria-labelledby="ab-title" className={`${card} flex flex-col gap-[18px] px-6 py-[22px]`}>
      <div className="flex items-center justify-between gap-3">
        <h2 id="ab-title" className={cardTitle}>
          About this event
        </h2>
        <a href="#" className={cardLink}>
          Edit
        </a>
      </div>
      <p className="m-0 text-[15px] leading-relaxed text-[#334155]">
        Annual celebration for employees, partners, and invited guests.
      </p>
      <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 border-t border-[#EEF0F5] pt-[18px]">
        {facts.map((f) => (
          <div key={f.label} className="flex flex-col gap-1">
            <dt className="text-xs font-semibold text-[#64748B]">{f.label}</dt>
            <dd className="m-0 text-sm font-semibold">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const attention = [
  {
    title: "2 tasks overdue",
    meta: "Oldest: Confirm AV vendor · 3 days",
    path: "/tasks",
    Icon: ClockIcon,
    bg: "#FFE4E6",
    fg: "#BE123C",
  },
  {
    title: "2 team invites pending",
    meta: "Sent 5 days ago · resend?",
    path: undefined,
    Icon: MailIcon,
    bg: "#FEF3C7",
    fg: "#B45309",
  },
];

export function NeedsAttention({ eventId }: { eventId: string }) {
  return (
    <section aria-labelledby="at-title" className={`${card} overflow-hidden`}>
      <div className="flex items-center justify-between px-5 pb-2 pt-5">
        <h2 id="at-title" className={cardTitle}>
          Needs attention
        </h2>
        <span className="box-border flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[#FFE4E6] px-[7px] text-xs font-extrabold text-[#BE123C]">
          {attention.length}
        </span>
      </div>
      <ul className="m-0 list-none px-2 pb-2 pt-1">
        {attention.map(({ title, meta, Icon, bg, fg, path }) => (
          <li key={title}>
            <Link
              href={path ? `/events/${eventId}${path}` : "#"}
              className="flex items-center gap-3 rounded-xl p-3 text-[#0F172A] no-underline hover:bg-[#F8F9FC]"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: bg, color: fg }}
              >
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="flex flex-auto flex-col gap-0.5">
                <span className="text-sm font-semibold">{title}</span>
                <span className="text-xs text-[#64748B]">{meta}</span>
              </span>
              <ChevronRightIcon size={16} className="text-[#64748B]" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mx-3 mb-3 flex flex-col gap-3 rounded-[14px] border border-[#E0E2FB] bg-[#F5F5FF] p-4">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.04em] text-[#3730A3]">
          <SparklesIcon size={14} strokeWidth={2} />
          AI suggestion
        </span>
        <p className="m-0 text-sm leading-[1.55] text-[#1E293B]">
          Lock the catering menu by <strong>4 Nov</strong> — the guest-list deadline depends on it.
          Budget is 63% used with 7 tasks open, so you&apos;re on pace.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="h-9 cursor-pointer rounded-[10px] border-none bg-[#4F46E5] px-3.5 text-[13px] font-bold text-white hover:bg-[#4338CA]"
          >
            Create task
          </button>
          <button
            type="button"
            className="h-9 cursor-pointer rounded-[10px] border border-[#D9DCF5] bg-white px-3 text-[13px] font-semibold text-[#3730A3]"
          >
            All suggestions
          </button>
        </div>
      </div>
    </section>
  );
}

export function ComingUp({ eventId }: { eventId: string }) {
  return (
    <section aria-labelledby="up-title" className={`${card} overflow-hidden`}>
      <div className="flex items-center justify-between px-5 pb-2 pt-5">
        <h2 id="up-title" className={cardTitle}>
          Coming up
        </h2>
        <Link href={`/events/${eventId}/calendar`} className={cardLink}>
          Calendar
        </Link>
      </div>
      <ul className="m-0 list-none px-2 pb-2">
        {UPCOMING.map((u) => (
          <li key={u.title}>
            <Link
              href={`/events/${eventId}/calendar`}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[#0F172A] no-underline hover:bg-[#F8F9FC]"
            >
              <span className="w-11 shrink-0 overflow-hidden rounded-[10px] border border-[#E6E8F0] text-center">
                <span className="block bg-[#F8FAFC] py-0.5 text-[10px] font-extrabold tracking-[0.08em] text-[#64748B]">
                  {u.mon}
                </span>
                <span className="block pb-1 pt-[3px] text-[17px] font-extrabold">{u.day}</span>
              </span>
              <span className="flex min-w-0 flex-auto flex-col gap-[3px]">
                <span className="text-sm font-semibold">{u.title}</span>
                <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <span
                    className="rounded-full px-[7px] py-px text-[11px] font-bold"
                    style={{ background: u.tagBg, color: u.tagFg }}
                  >
                    {u.kind}
                  </span>
                  {u.owner}
                </span>
              </span>
              <span className="whitespace-nowrap text-xs font-semibold text-[#64748B]">
                {u.inDays}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ActivityFeed() {
  return (
    <section aria-labelledby="ac-title" className={`${card} p-5`}>
      <div className="mb-2 flex items-center justify-between">
        <h2 id="ac-title" className={cardTitle}>
          Activity
        </h2>
        <a href="#" className={cardLink}>
          View all
        </a>
      </div>
      <ol className="m-0 flex list-none flex-col p-0">
        {ACTIVITY.map((x) => (
          <li key={x.name + x.obj} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 py-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-extrabold"
              style={{ background: x.bg, color: x.fg }}
            >
              {x.who}
            </span>
            <span className="flex flex-col gap-0.5 text-[13px] leading-[1.45] text-[#334155]">
              <span>
                <strong className="text-[#0F172A]">{x.name}</strong> {x.verb}{" "}
                <strong className="text-[#0F172A]">{x.obj}</strong>
              </span>
              <span className="text-xs text-[#64748B]">{x.when}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
