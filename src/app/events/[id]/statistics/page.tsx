import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent } from "@/components/events/data";
import WorkspacePage, { Card, StatTile } from "@/components/events/WorkspacePage";
import WeeklyChart from "@/components/events/WeeklyChart";
import StatisticsTabs from "@/components/events/StatisticsTabs";
import PostAnalysis from "@/components/events/PostAnalysis";
import { ASSIGNEES, TASKS, type Assignee } from "@/components/events/tasksData";
import { MILESTONES } from "@/components/events/workspaceData";
import {
  BUDGET_SPENT,
  BUDGET_TOTAL,
  PENDING_INVITES,
  WEEKLY_DONE,
  money,
  roleOf,
} from "@/components/events/insightsData";
import { CalendarIcon, CheckIcon, TasksIcon, UsersIcon, WalletIcon } from "@/components/events/icons";

export async function generateMetadata({
  params,
}: PageProps<"/events/[id]/statistics">): Promise<Metadata> {
  const event = getEvent((await params).id);
  return { title: event ? `${event.title} · Statistics` : "Event not found" };
}

const MILESTONE_LABEL = {
  done: { label: "Done", bg: "#DCFCE7", fg: "#166534" },
  current: { label: "In progress", bg: "#EEF0FF", fg: "#3730A3" },
  todo: { label: "Upcoming", bg: "#F1F5F9", fg: "#475569" },
} as const;

export default async function EventStatisticsPage({ params }: PageProps<"/events/[id]/statistics">) {
  const event = getEvent((await params).id);
  if (!event) notFound();

  const done = TASKS.filter((t) => t.status === "done").length;
  const inProgress = TASKS.filter((t) => t.status === "in_progress").length;
  const taskPct = Math.round((done / TASKS.length) * 100);
  const budgetPct = Math.round((BUDGET_SPENT / BUDGET_TOTAL) * 100);
  const milestonesDone = MILESTONES.filter((m) => m.s === "done").length;
  const nextMilestone = MILESTONES.find((m) => m.s !== "done");
  const weeklyTotal = WEEKLY_DONE.reduce((s, w) => s + w.done, 0);

  const team = (Object.keys(ASSIGNEES) as Assignee[]).map((who) => {
    const mine = TASKS.filter((t) => t.assignee === who);
    const completed = mine.filter((t) => t.status === "done").length;
    return {
      who,
      ...ASSIGNEES[who],
      assigned: mine.length,
      completed,
      pct: mine.length ? Math.round((completed / mine.length) * 100) : 0,
    };
  });

  return (
    <WorkspacePage
      event={event}
      title="Statistics"
      subtitle="Track planning progress, then analyse the results once the event is over."
    >
      <StatisticsTabs
        analysis={
          <PostAnalysis
            event={{
              title: event.title,
              date: event.when.split(" · ")[0],
              venue: event.venue,
              capacity: event.guests,
            }}
          />
        }
        stats={
          <>
      <section aria-label="Key numbers" className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
        <StatTile
          label="Tasks done"
          value={`${taskPct}%`}
          note={`${done} of ${TASKS.length} · ${inProgress} in progress`}
          Icon={TasksIcon}
          bg="#EEF0FF"
          fg="#4F46E5"
        />
        <StatTile
          label="Budget used"
          value={`${budgetPct}%`}
          note={`${money(BUDGET_TOTAL - BUDGET_SPENT)} remaining`}
          Icon={WalletIcon}
          bg="#DCFCE7"
          fg="#15803D"
        />
        <StatTile
          label="Team"
          value={`${team.length} members`}
          note={`${PENDING_INVITES} invites pending`}
          Icon={UsersIcon}
          bg="#E0F2FE"
          fg="#0369A1"
        />
        <StatTile
          label="Milestones"
          value={`${milestonesDone} / ${MILESTONES.length}`}
          note={nextMilestone ? `Next: ${nextMilestone.title}` : "All complete"}
          Icon={CalendarIcon}
          bg="#FFEDD5"
          fg="#C2410C"
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Tasks completed per week"
          subtitle={`${weeklyTotal} tasks over the last six weeks`}
          bodyClassName="px-5 pb-5 pt-6"
        >
          <WeeklyChart data={WEEKLY_DONE} />
        </Card>

        <Card
          title="Milestones"
          subtitle={`${milestonesDone} of ${MILESTONES.length} complete`}
          bodyClassName="px-2 py-2"
        >
          <ol className="m-0 flex list-none flex-col p-0">
            {MILESTONES.map((m) => {
              const meta = MILESTONE_LABEL[m.s];
              return (
                <li key={m.title} className="flex items-center gap-3 rounded-xl px-3 py-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      m.s === "done"
                        ? "bg-[#16A34A] text-white"
                        : m.s === "current"
                          ? "border-2 border-[#4F46E5] bg-white"
                          : "border-2 border-[#E2E8F0] bg-white"
                    }`}
                  >
                    {m.s === "done" && <CheckIcon size={14} />}
                    {m.s === "current" && <span className="h-2 w-2 rounded-full bg-[#4F46E5]" />}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span
                      className={`truncate text-sm font-semibold ${
                        m.s === "todo" ? "text-[#64748B]" : "text-[#0F172A]"
                      }`}
                    >
                      {m.title}
                    </span>
                    <span className="truncate text-xs text-[#64748B]">
                      {m.date} · {m.note}
                    </span>
                  </span>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{ background: meta.bg, color: meta.fg }}
                  >
                    {meta.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>

      <Card title="Team performance" subtitle="Tasks assigned and completed per member" bodyClassName="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-[0.06em] text-[#64748B]">
              <th scope="col" className="px-5 py-3 font-bold">Member</th>
              <th scope="col" className="px-5 py-3 font-bold">Role</th>
              <th scope="col" className="px-5 py-3 text-right font-bold">Assigned</th>
              <th scope="col" className="px-5 py-3 text-right font-bold">Done</th>
              <th scope="col" className="w-[30%] px-5 py-3 font-bold">Completion</th>
            </tr>
          </thead>
          <tbody>
            {team.map((p) => (
              <tr key={p.who} className="border-t border-[#EEF0F5]">
                <th scope="row" className="px-5 py-3.5 font-semibold">
                  <span className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{ background: p.bg, color: p.fg }}
                    >
                      {p.t}
                    </span>
                    {p.name}
                  </span>
                </th>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-[#EEF0FF] px-2.5 py-1 text-xs font-semibold text-[#3730A3]">
                    {roleOf(p.who)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums">{p.assigned}</td>
                <td className="px-5 py-3.5 text-right tabular-nums">{p.completed}</td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-3">
                    <span
                      role="progressbar"
                      aria-label={`${p.name} completion`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={p.pct}
                      className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEF0F5]"
                    >
                      <span className="block h-full rounded-full bg-[#4F46E5]" style={{ width: `${p.pct}%` }} />
                    </span>
                    <span className="w-9 text-right text-[13px] font-bold tabular-nums">{p.pct}%</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
              </>
        }
      />
    </WorkspacePage>
  );
}
