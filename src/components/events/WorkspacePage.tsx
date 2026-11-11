import type { ReactNode } from "react";
import Link from "next/link";
import type { EventItem } from "./data";
import { ChevronRightIcon, SparklesIcon } from "./icons";

/**
 * Page frame for an event workspace screen: breadcrumb, title, actions, content, and the floating
 * "Ask JatJeng AI" button. Bottom padding keeps the floating button from covering content.
 */
export default function WorkspacePage({
  event,
  title,
  subtitle,
  actions,
  children,
}: {
  event: EventItem;
  title: string;
  subtitle: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main
      id="top"
      className="mx-auto box-border flex min-w-0 max-w-[1240px] flex-[999_1_640px] flex-col gap-[22px] px-4 pb-28 pt-8 sm:px-7"
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
              {title}
            </span>
          </nav>
          <h1 className="m-0 text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em]">
            {title}
          </h1>
          <p className="m-0 text-sm text-[#64748B]">{subtitle}</p>
        </div>
        {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
      </header>

      {children}

      {/* TODO: open the AI assistant once it exists. */}
      <button
        type="button"
        className="fixed bottom-6 right-6 z-20 flex print:hidden cursor-pointer items-center gap-3 rounded-full border-none bg-[linear-gradient(135deg,#4F46E5,#7C3AED)] py-2 pl-2 pr-5 text-left text-white shadow-[0_14px_32px_-12px_rgba(79,70,229,0.7)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.18]">
          <SparklesIcon size={18} />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-bold">Ask JatJeng AI</span>
          <span className="text-[11px] text-white/80">About this event</span>
        </span>
      </button>
    </main>
  );
}

/** Primary page action button (indigo). */
export function PrimaryAction({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border-none bg-[#4F46E5] px-[18px] text-sm font-bold text-white shadow-[0_6px_16px_-6px_rgba(79,70,229,0.55)] hover:bg-[#4338CA]"
    >
      {children}
    </button>
  );
}

/** White card with an optional titled header row. */
export function Card({
  title,
  subtitle,
  action,
  children,
  className = "",
  bodyClassName = "p-5",
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={`flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#E6E8F0] bg-white ${className}`}
    >
      {title && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF0F5] px-5 py-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="m-0 text-base font-bold tracking-[-0.01em]">{title}</h2>
            {subtitle && <p className="m-0 text-[13px] text-[#64748B]">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/** Small stat tile: label, big value, note. */
export function StatTile({
  label,
  value,
  note,
  Icon,
  bg,
  fg,
  children,
}: {
  label: string;
  value: string;
  note: string;
  Icon?: (p: { size?: number }) => ReactNode;
  bg?: string;
  fg?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[18px] border border-[#E6E8F0] bg-white px-5 py-[18px]">
      {Icon && (
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
          style={{ background: bg, color: fg }}
        >
          <Icon size={21} />
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[13px] font-medium text-[#64748B]">{label}</span>
        <span className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em]">{value}</span>
        <span className="text-xs text-[#64748B]">{note}</span>
        {children}
      </div>
    </div>
  );
}
