import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import EventAgenda from "@/components/events/EventAgenda";
import {
  AboutEvent,
  ActivityFeed,
  ComingUp,
  Milestones,
  NeedsAttention,
} from "@/components/events/OverviewSections";
import { ACCENT, getEvent, shortDate, type EventItem } from "@/components/events/data";
import {
  BriefcaseIcon,
  CalendarIcon,
  ChevronRightIcon,
  MapPinIcon,
  PenIcon,
  PlusIcon,
  ShareIcon,
  UsersIcon,
} from "@/components/events/icons";

// The whole page is derived from the event in the URL, so there is no shared shell to prefetch.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/events/[id]">): Promise<Metadata> {
  const event = getEvent((await params).id);
  return { title: event ? `${event.title} · Overview` : "Event not found" };
}

const STATUS_PILL: Record<EventItem["status"], { bg: string; fg: string; dot: string }> = {
  Planning: { bg: "#FEF3C7", fg: "#92400E", dot: "#F59E0B" },
  Active: { bg: "#DCFCE7", fg: "#166534", dot: "#16A34A" },
  Completed: { bg: "#F1F5F9", fg: "#334155", dot: "#64748B" },
};

const secondaryButton =
  "flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#E6E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC]";

export default async function EventOverviewPage({ params }: PageProps<"/events/[id]">) {
  const event = getEvent((await params).id);
  if (!event) notFound();

  const pill = STATUS_PILL[event.status];
  const meta = [
    { Icon: CalendarIcon, text: event.when },
    { Icon: MapPinIcon, text: event.venue },
    { Icon: UsersIcon, text: `${event.guests} guests` },
    { Icon: BriefcaseIcon, text: event.category },
  ];

  return (
    <main
      id="top"
      className="mx-auto box-border flex min-w-0 max-w-[1160px] flex-[999_1_640px] flex-col gap-6 px-7 pb-14 pt-8"
    >
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex min-w-0 flex-col gap-2.5">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#64748B]"
          >
            <Link href="/events/all" className="text-[#64748B] no-underline hover:text-[#0F172A]">
              Your events
            </Link>
            <ChevronRightIcon size={14} />
            <span aria-current="page" className="font-semibold text-[#0F172A]">
              Overview
            </span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="m-0 text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em]">
              {event.title}
            </h1>
            <span
              className="flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold"
              style={{ background: pill.bg, color: pill.fg }}
            >
              <span className="h-[7px] w-[7px] rounded-full" style={{ background: pill.dot }} />
              {event.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-[18px] gap-y-2 text-sm text-[#475569]">
            {meta.map(({ Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5">
                <Icon size={16} strokeWidth={1.8} className="text-[#64748B]" />
                {text}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" className={secondaryButton}>
            <ShareIcon size={17} />
            Share
          </button>
          <button type="button" className={secondaryButton}>
            <PenIcon size={17} strokeWidth={1.9} />
            Edit details
          </button>
          <button
            type="button"
            className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border-none bg-[#4F46E5] px-[18px] text-sm font-bold text-white shadow-[0_6px_16px_-6px_rgba(79,70,229,0.55)] hover:bg-[#4338CA]"
          >
            <PlusIcon size={17} />
            Add task
          </button>
        </div>
      </header>

      {/* KPIs */}
      <section
        aria-label="Key numbers"
        className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4"
      >
        <div className="flex flex-col gap-2.5 rounded-[18px] bg-[#0F172A] px-5 py-[18px] text-white">
          <span className="text-[13px] font-semibold text-[#CBD5E1]">Countdown</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] font-extrabold leading-none tracking-[-0.03em]">
              {event.daysLeft}
            </span>
            <span className="text-sm font-semibold text-[#CBD5E1]">days to go</span>
          </div>
          <span className="text-[13px] text-[#CBD5E1]">
            Event day · {shortDate(event)}
          </span>
        </div>

        <div className="flex flex-col gap-2.5 rounded-[18px] border border-[#E6E8F0] bg-white px-5 py-[18px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#64748B]">Planning progress</span>
            <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-xs font-bold text-[#15803D]">
              On track
            </span>
          </div>
          <span className="text-[28px] font-extrabold leading-none tracking-[-0.03em]">
            {event.progress}%
          </span>
          <div
            role="progressbar"
            aria-label="Planning progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={event.progress}
            className="h-1.5 overflow-hidden rounded-full bg-[#EEF0F5]"
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${event.progress}%`, background: ACCENT }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 rounded-[18px] border border-[#E6E8F0] bg-white px-5 py-[18px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#64748B]">Tasks</span>
            <span className="rounded-full bg-[#FFE4E6] px-2 py-0.5 text-xs font-bold text-[#BE123C]">
              2 overdue
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-extrabold leading-none tracking-[-0.03em]">13</span>
            <span className="text-sm font-semibold text-[#64748B]">of 20 done</span>
          </div>
          <div aria-hidden="true" className="flex h-1.5 gap-[3px]">
            <div className="flex-[13_1_0] rounded-full bg-[#16A34A]" />
            <div className="flex-[2_1_0] rounded-full bg-[#E11D48]" />
            <div className="flex-[5_1_0] rounded-full bg-[#E2E8F0]" />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 rounded-[18px] border border-[#E6E8F0] bg-white px-5 py-[18px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#64748B]">Budget spent</span>
            <span className="text-xs font-bold text-[#475569]">63%</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-extrabold leading-none tracking-[-0.03em]">
              $7,500
            </span>
            <span className="text-sm font-semibold text-[#64748B]">of $12,000</span>
          </div>
          <div
            role="progressbar"
            aria-label="Budget spent"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={63}
            className="h-1.5 overflow-hidden rounded-full bg-[#EEF0F5]"
          >
            <div className="h-full w-[63%] rounded-full bg-[#0EA5E9]" />
          </div>
        </div>
      </section>

      {/* Two columns */}
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
          <Milestones eventId={event.id} />
          <EventAgenda />
          <AboutEvent event={event} />
        </div>

        <aside aria-label="Updates" className="flex min-w-0 flex-[1_1_320px] flex-col gap-6">
          <NeedsAttention eventId={event.id} />
          <ComingUp eventId={event.id} />
          <ActivityFeed />
        </aside>
      </div>
    </main>
  );
}
