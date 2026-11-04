"use client";

import { useState } from "react";
import { AGENDA, AGENDA_CATEGORY_COLORS, AGENDA_DAYS, type AgendaDay } from "./workspaceData";
import { MoreVerticalIcon, PenIcon, PlusIcon, RefreshIcon, SparklesIcon } from "./icons";

export default function EventAgenda() {
  const [day, setDay] = useState<AgendaDay>("day");

  return (
    <section
      aria-labelledby="ag-title"
      className="overflow-hidden rounded-[20px] border border-[#E6E8F0] bg-white"
    >
      <div className="flex flex-wrap items-center justify-between gap-3.5 px-6 pb-4 pt-5">
        <div>
          <h2
            id="ag-title"
            className="m-0 flex items-center gap-2 text-[17px] font-bold tracking-[-0.01em]"
          >
            Agenda
            <span className="flex h-[22px] items-center gap-1 rounded-full bg-[#EEF0FF] px-2 text-[11px] font-bold text-[#3730A3]">
              <SparklesIcon size={12} strokeWidth={2} />
              AI draft
            </span>
          </h2>
          <p className="m-0 mt-1 text-[13px] text-[#64748B]">
            Edit any item — the AI keeps timings consistent.
          </p>
        </div>
        <button
          type="button"
          className="flex h-10 cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#E6E8F0] bg-white px-3 text-[13px] font-semibold text-[#334155] hover:bg-[#F8FAFC]"
        >
          <RefreshIcon size={15} />
          Regenerate
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Agenda day"
        className="mx-6 flex w-fit max-w-[calc(100%-48px)] flex-wrap gap-1 rounded-xl bg-[#F1F3F8] p-1"
      >
        {AGENDA_DAYS.map((d) => {
          const on = d.id === day;
          return (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setDay(d.id)}
              className={`h-9 cursor-pointer rounded-[9px] border-none px-3.5 text-[13px] font-semibold ${
                on
                  ? "bg-white text-[#0F172A] shadow-[0_1px_3px_rgba(15,23,42,0.12)]"
                  : "bg-transparent text-[#475569] hover:text-[#0F172A]"
              }`}
            >
              {d.label} <span className="font-medium text-[#64748B]">· {d.date}</span>
            </button>
          );
        })}
      </div>

      <ul className="m-0 mt-3.5 list-none px-3 pb-3">
        {AGENDA[day].map((a) => (
          <li
            key={a.time + a.title}
            className="grid grid-cols-[64px_14px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl p-3 hover:bg-[#F8F9FC]"
          >
            <span className="text-sm font-bold tabular-nums text-[#0F172A]">{a.time}</span>
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-[3px]"
              style={{ background: AGENDA_CATEGORY_COLORS[a.cat] }}
            />
            <span className="flex min-w-0 flex-col gap-[3px]">
              <span className="text-sm font-semibold">{a.title}</span>
              <span className="text-xs text-[#64748B]">
                {a.cat} · {a.dur}
              </span>
            </span>
            <span className="flex gap-0.5">
              <button
                type="button"
                aria-label={`Edit ${a.title}`}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[9px] border-none bg-transparent text-[#64748B] hover:bg-[#F1F3F9] hover:text-[#0F172A]"
              >
                <PenIcon size={16} strokeWidth={1.9} />
              </button>
              <button
                type="button"
                aria-label={`More actions for ${a.title}`}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[9px] border-none bg-transparent text-[#64748B] hover:bg-[#F1F3F9] hover:text-[#0F172A]"
              >
                <MoreVerticalIcon size={16} />
              </button>
            </span>
          </li>
        ))}
        <li>
          <button
            type="button"
            className="mt-1 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#CBD2E0] bg-transparent text-[13px] font-bold text-[#4338CA] hover:border-[#A5ACC0]"
          >
            <PlusIcon size={16} />
            Add agenda item
          </button>
        </li>
      </ul>
    </section>
  );
}
