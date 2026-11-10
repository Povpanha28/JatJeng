import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent } from "@/components/events/data";
import WorkspacePage, { Card, PrimaryAction, StatTile } from "@/components/events/WorkspacePage";
import {
  BUDGET_CATEGORIES,
  BUDGET_SPENT,
  BUDGET_TOTAL,
  EXPENSES,
  EXPENSE_STATUS,
  money,
} from "@/components/events/insightsData";
import {
  AlertTriangleIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SparklesIcon,
  WalletIcon,
} from "@/components/events/icons";

export async function generateMetadata({
  params,
}: PageProps<"/events/[id]/budget">): Promise<Metadata> {
  const event = getEvent((await params).id);
  return { title: event ? `${event.title} · Budget` : "Event not found" };
}

/** Share of a category's budget that's spent, at which we warn. */
const WARN_AT = 0.75;

export default async function EventBudgetPage({ params }: PageProps<"/events/[id]/budget">) {
  const event = getEvent((await params).id);
  if (!event) notFound();

  const remaining = BUDGET_TOTAL - BUDGET_SPENT;
  const used = Math.round((BUDGET_SPENT / BUDGET_TOTAL) * 100);
  const hot = BUDGET_CATEGORIES.filter((c) => c.budget > 0 && c.spent / c.budget >= WARN_AT);

  return (
    <WorkspacePage
      event={event}
      title="Budget"
      subtitle="Track the planned and actual costs for this event."
      actions={
        <PrimaryAction>
          <PlusIcon size={17} />
          Add expense
        </PrimaryAction>
      }
    >
      <section aria-label="Budget summary" className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
        <StatTile label="Total budget" value={money(BUDGET_TOTAL)} note="Approved event budget" />
        <StatTile label="Spent" value={money(BUDGET_SPENT)} note={`${EXPENSES.length} expenses recorded`} />
        <StatTile
          label="Remaining"
          value={money(remaining)}
          note={`${Math.round((remaining / BUDGET_TOTAL) * 100)}% still available`}
        />
        <StatTile label="Used" value={`${used}%`} note="Of the total budget">
          <div
            role="progressbar"
            aria-label="Budget used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={used}
            className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#EEF0F5]"
          >
            <div className="h-full rounded-full bg-[#4F46E5]" style={{ width: `${used}%` }} />
          </div>
        </StatTile>
      </section>

      {hot.map((c) => (
        <div
          key={c.name}
          role="status"
          className="flex items-center gap-3 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E]"
        >
          <AlertTriangleIcon size={18} className="shrink-0 text-[#D97706]" />
          <span>
            <strong className="font-bold">{c.name}</strong> is {Math.round((c.spent / c.budget) * 100)}%
            spent — {money(c.budget - c.spent)} left in this category.
          </span>
        </div>
      ))}

      <Card
        title="AI budget suggestions"
        subtitle="Updated as you add expenses"
        action={
          <button
            type="button"
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#E6E8F0] bg-white px-3.5 text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            <SparklesIcon size={16} />
            Rebalance with AI
          </button>
        }
      >
        <div className="flex max-w-[560px] items-start gap-3 rounded-2xl border border-[#E6E8F0] bg-[#FAFAFF] p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EEF0FF] text-[#4F46E5]">
            <SparklesIcon size={17} />
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold">Trim venue extras</span>
            <span className="text-[13px] leading-relaxed text-[#475569]">
              Venue is over 75% spent. Review optional upgrades or renegotiate the remaining
              balance before booking anything else there.
            </span>
            <span className="text-xs font-bold text-[#15803D]">Could save about $320</span>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Card title="By category" subtitle="Budgeted versus spent" bodyClassName="px-5 pb-3 pt-2">
          <ul className="m-0 flex list-none flex-col p-0">
            {BUDGET_CATEGORIES.map((c) => {
              const pct = c.budget ? Math.round((c.spent / c.budget) * 100) : 0;
              const warn = c.budget > 0 && c.spent / c.budget >= WARN_AT;
              return (
                <li key={c.name} className="flex flex-col gap-2 border-b border-[#EEF0F5] py-3.5 last:border-b-0">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-semibold text-[#0F172A]">{c.name}</span>
                    <span className="text-[13px] text-[#64748B]">
                      <strong className="font-bold text-[#0F172A]">{money(c.spent)}</strong> of{" "}
                      {money(c.budget)}
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${c.name} spent`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                    className="h-2 overflow-hidden rounded-full bg-[#EEF0F5]"
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: warn ? "#D97706" : "#4F46E5" }}
                    />
                  </div>
                  <span className="text-xs text-[#64748B]">
                    {pct}% spent · {money(c.budget - c.spent)} left
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="All expenses" subtitle="Every recorded cost" bodyClassName="p-2">
          <ul className="m-0 flex list-none flex-col p-0">
            {EXPENSES.map((x) => {
              const s = EXPENSE_STATUS[x.status];
              return (
                <li key={x.title} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-[#F8FAFC]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F3F9] text-[#475569]">
                    <WalletIcon size={18} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-semibold text-[#0F172A]">{x.title}</span>
                    <span className="truncate text-xs text-[#64748B]">
                      {x.category} · {x.date} · {x.by}
                      <span className="sm:hidden"> · {s.label}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-bold tabular-nums text-[#0F172A]">{money(x.amount)}</span>
                  <span
                    className="hidden w-[78px] shrink-0 rounded-full py-1 text-center text-xs font-bold sm:inline-block"
                    style={{ background: s.bg, color: s.fg }}
                  >
                    {s.label}
                  </span>
                  <button
                    type="button"
                    aria-label={`More actions for ${x.title}`}
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-[#64748B] hover:bg-[#EEF0F5]"
                  >
                    <MoreHorizontalIcon size={18} />
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </WorkspacePage>
  );
}
