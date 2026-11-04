import { notFound } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import EventSidebar from "@/components/events/EventSidebar";
import { EVENTS, getEvent } from "@/components/events/data";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

// Shared shell for every workspace screen (Overview, Calendar, …): the sidebar plus the page.
export default async function EventWorkspaceLayout({
  children,
  params,
}: LayoutProps<"/events/[id]">) {
  const event = getEvent((await params).id);
  if (!event) notFound();

  return (
    <div
      className={`${jakarta.className} flex min-h-screen flex-1 flex-wrap items-stretch bg-[#F6F7FB] text-[#0F172A]`}
    >
      <EventSidebar event={event} />
      {children}
    </div>
  );
}
