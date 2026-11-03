import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AppTopBar from "@/components/events/AppTopBar";
import AIPlanner from "@/components/events/AIPlanner";
import EventsList from "@/components/events/EventsList";
import { ActivityIcon, CalendarIcon, ClockIcon, ListIcon, PlusIcon, UsersIcon } from "@/components/events/icons";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "My Events",
};

// Static until real data is wired in; dates must not be computed at render under cacheComponents.
const stats = [
  { label: "Total events", value: "3", Icon: CalendarIcon, bg: "#EEF0FF", fg: "#4F46E5" },
  { label: "Active now", value: "1", Icon: ActivityIcon, bg: "#DCFCE7", fg: "#15803D" },
  { label: "Team members", value: "25", Icon: UsersIcon, bg: "#E0F2FE", fg: "#0369A1" },
  { label: "Next event in", value: "54 days", Icon: ClockIcon, bg: "#FFEDD5", fg: "#C2410C" },
];

export default function EventsPage() {
  return (
    <div className={`${jakarta.className} min-h-screen flex-1 bg-[#F6F7FB] text-[#0F172A]`}>
      <AppTopBar />

      <main
        id="top"
        className="mx-auto flex max-w-[1240px] flex-col gap-7 px-6 pb-16 pt-9"
      >
        {/* Page header */}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex flex-col gap-1.5">
            <p className="m-0 text-sm font-medium text-[#64748B]">Tuesday, 27 October</p>
            <h1 className="m-0 text-[34px] font-extrabold leading-[1.15] tracking-[-0.03em]">
              Good afternoon, Dyna
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
            <button
              type="button"
              className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border-none bg-[#4F46E5] px-[18px] text-sm font-bold text-white shadow-[0_6px_16px_-6px_rgba(79,70,229,0.55)] hover:bg-[#4338CA]"
            >
              <PlusIcon size={18} />
              Create event
            </button>
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

        <AIPlanner />
        <EventsList />
      </main>
    </div>
  );
}
