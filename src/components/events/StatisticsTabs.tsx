"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

const TABS = [
  { id: "stats", label: "Statistics" },
  { id: "analysis", label: "Post analysis" },
] as const;
type TabId = (typeof TABS)[number]["id"];

/**
 * Toggle between live planning statistics and the post-event analysis. Both panels stay mounted,
 * so analysis inputs survive switching back and forth.
 */
export default function StatisticsTabs({ stats, analysis }: { stats: ReactNode; analysis: ReactNode }) {
  const [tab, setTab] = useState<TabId>("stats");
  const refs = useRef<Record<TabId, HTMLButtonElement | null>>({ stats: null, analysis: null });

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = tab === "stats" ? "analysis" : "stats";
    setTab(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="flex flex-col gap-[22px]">
      <div
        role="tablist"
        aria-label="Statistics view"
        onKeyDown={onKeyDown}
        className="flex w-fit gap-1 rounded-xl bg-[#ECEEF4] p-1 print:hidden"
      >
        {TABS.map((t) => {
          const on = t.id === tab;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={on}
              aria-controls={`panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setTab(t.id)}
              className={`h-10 cursor-pointer rounded-[9px] border-none px-4 text-sm font-semibold transition-colors ${
                on
                  ? "bg-white text-[#0F172A] shadow-[0_1px_3px_rgba(15,23,42,0.12)]"
                  : "bg-transparent text-[#475569] hover:text-[#0F172A]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="panel-stats" aria-labelledby="tab-stats" hidden={tab !== "stats"} className={tab === "stats" ? "flex flex-col gap-[22px]" : "hidden"}>
        {stats}
      </div>
      <div role="tabpanel" id="panel-analysis" aria-labelledby="tab-analysis" hidden={tab !== "analysis"}>
        {analysis}
      </div>
    </div>
  );
}
