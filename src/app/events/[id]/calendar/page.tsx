import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import EventCalendar from "@/components/events/EventCalendar";
import { getEvent, shortDate } from "@/components/events/data";
import { ChevronRightIcon, PlusIcon, SparklesIcon } from "@/components/events/icons";

export async function generateMetadata({
  params,
}: PageProps<"/events/[id]/calendar">): Promise<Metadata> {
  const event = getEvent((await params).id);
  return { title: event ? `${event.title} · Calendar` : "Event not found" };
}

export default async function EventCalendarPage({ params }: PageProps<"/events/[id]/calendar">) {
  const event = getEvent((await params).id);
  if (!event) notFound();

  return (
    <main
      id="top"
      className="mx-auto box-border flex min-w-0 max-w-[1240px] flex-[999_1_640px] flex-col gap-[22px] px-7 pb-14 pt-8"
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#64748B]"
          >
            <Link
              href={`/events/${event.id}`}
              className="text-[#64748B] no-underline hover:text-[#0F172A]"
            >
              {event.title}
            </Link>
            <ChevronRightIcon size={14} />
            <span aria-current="page" className="font-semibold text-[#0F172A]">
              Calendar
            </span>
          </nav>
          <h1 className="m-0 text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em]">
            Calendar
          </h1>
          <p className="m-0 text-sm text-[#64748B]">
            Tasks, meetings and milestones leading up to{" "}
            <strong className="font-bold text-[#0F172A]">{shortDate(event)}</strong> —{" "}
            {event.daysLeft} days away.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#E6E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            <SparklesIcon size={17} />
            Schedule with AI
          </button>
          <button
            type="button"
            className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border-none bg-[#4F46E5] px-[18px] text-sm font-bold text-white shadow-[0_6px_16px_-6px_rgba(79,70,229,0.55)] hover:bg-[#4338CA]"
          >
            <PlusIcon size={17} />
            Add item
          </button>
        </div>
      </header>

      <EventCalendar eventId={event.id} />
    </main>
  );
}
