import type { Metadata } from "next";
import Link from "next/link";
import EventsList from "@/components/events/EventsList";
import { ActivityIcon, CalendarIcon, ClockIcon, ListIcon, PlusIcon, UsersIcon } from "@/components/events/icons";

export const metadata: Metadata = {
  title: "Your events",
};

// Static until real data is wired in; dates must not be computed at render under cacheComponents.
const stats = [
  { label: "Total events", value: "3", Icon: CalendarIcon, bg: "#EEF0FF", fg: "#4F46E5" },
  { label: "Active now", value: "1", Icon: ActivityIcon, bg: "#DCFCE7", fg: "#15803D" },
  { label: "Team members", value: "25", Icon: UsersIcon, bg: "#E0F2FE", fg: "#0369A1" },
  { label: "Next event in", value: "54 days", Icon: ClockIcon, bg: "#FFEDD5", fg: "#C2410C" },
];

export default function YourEventsPage() {
  return (
    <main id="top" className="mx-auto flex w-full max-w-[1160px] flex-col gap-7 px-4 pb-16 pt-2 sm:px-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 text-[32px] font-extrabold leading-[1.15] tracking-[-0.03em]">
            Your events
          </h1>
          <p className="m-0 text-[15px] text-[#64748B]">
            Your next event, Company Annual Dinner, is 54 days away.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#E6E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            <ListIcon size={18} />
            Import guest list
          </button>
          <Link
            href="/events"
            className="flex h-11 items-center gap-2 rounded-xl bg-[#4F46E5] px-[18px] text-sm font-bold text-white no-underline shadow-[0_6px_16px_-6px_rgba(79,70,229,0.55)] hover:bg-[#4338CA]"
          >
            <PlusIcon size={18} />
            New event
          </Link>
        </div>
      </div>

      {/* Stats */}
      <section
        aria-label="Overview"
        className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4"
      >
        {stats.map(({ label, value, Icon, bg, fg }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-[18px] border border-[#E6E8F0] bg-white px-5 py-[18px]"
          >
            <span
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px]"
              style={{ background: bg, color: fg }}
            >
              <Icon size={22} />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-medium text-[#64748B]">{label}</span>
              <span className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em]">
                {value}
              </span>
            </div>
          </div>
        ))}
      </section>

      <EventsList />
    </main>
  );
}
