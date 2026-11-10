import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent } from "@/components/events/data";
import WorkspacePage, { PrimaryAction } from "@/components/events/WorkspacePage";
import { ASSIGNEES } from "@/components/events/tasksData";
import { PERMISSION_AREAS, ROLES } from "@/components/events/insightsData";
import { MoreHorizontalIcon, PlusIcon, ShieldCheckIcon } from "@/components/events/icons";

export async function generateMetadata({
  params,
}: PageProps<"/events/[id]/roles">): Promise<Metadata> {
  const event = getEvent((await params).id);
  return { title: event ? `${event.title} · Roles & permissions` : "Event not found" };
}

/** Access tags shown before folding the rest into "+N". */
const SHOWN = 4;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default async function EventRolesPage({ params }: PageProps<"/events/[id]/roles">) {
  const event = getEvent((await params).id);
  if (!event) notFound();

  return (
    <WorkspacePage
      event={event}
      title="Roles & permissions"
      subtitle="Control what team members can see and do in this event."
      actions={
        <PrimaryAction>
          <PlusIcon size={17} />
          Create role
        </PrimaryAction>
      }
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {ROLES.map((r) => {
          const full = r.access.length === PERMISSION_AREAS.length;
          const extra = r.access.length - SHOWN;
          return (
            <article
              key={r.id}
              className="flex flex-col gap-4 rounded-[20px] border border-[#E6E8F0] bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-[14px]"
                  style={{ background: r.bg, color: r.fg }}
                >
                  <ShieldCheckIcon size={21} />
                </span>
                <button
                  type="button"
                  aria-label={`More actions for ${r.name}`}
                  className="-mr-2 -mt-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-[#64748B] hover:bg-[#F1F3F9]"
                >
                  <MoreHorizontalIcon size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="m-0 text-[17px] font-bold tracking-[-0.01em]">{r.name}</h2>
                <p className="m-0 text-[13px] text-[#64748B]">{r.description}</p>
              </div>

              <ul aria-label="Access" className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                {full ? (
                  <li className="rounded-full bg-[#EEF0FF] px-2.5 py-1 text-xs font-semibold text-[#3730A3]">
                    Everything
                  </li>
                ) : (
                  <>
                    {r.access.slice(0, SHOWN).map((a) => (
                      <li
                        key={a}
                        className="rounded-full bg-[#F1F3F9] px-2.5 py-1 text-xs font-semibold text-[#334155]"
                      >
                        {a}
                      </li>
                    ))}
                    {extra > 0 && (
                      <li
                        title={r.access.slice(SHOWN).join(", ")}
                        className="rounded-full bg-[#F1F3F9] px-2.5 py-1 text-xs font-semibold text-[#64748B]"
                      >
                        +{extra}
                      </li>
                    )}
                  </>
                )}
              </ul>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#EEF0F5] pt-3.5">
                <span className="flex items-center gap-2.5">
                  {r.members.length > 0 && (
                    <span className="flex">
                      {r.members.map((m) => (
                        <span
                          key={m}
                          title={ASSIGNEES[m].name}
                          className="-mr-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold"
                          style={{ background: ASSIGNEES[m].bg, color: ASSIGNEES[m].fg }}
                        >
                          {ASSIGNEES[m].t}
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="text-[13px] text-[#64748B]">
                    {r.members.length ? plural(r.members.length, "member") : "No members yet"}
                  </span>
                </span>
                <span className="text-[13px] font-medium text-[#64748B]">
                  {plural(r.access.length, "permission")}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </WorkspacePage>
  );
}
