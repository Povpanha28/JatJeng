"use client";

import { useState } from "react";

type Point = { week: string; range: string; done: number };

/** Single-series bar chart of tasks completed per week, with hover/focus tooltips and a table view. */
export default function WeeklyChart({ data }: { data: Point[] }) {
  const [active, setActive] = useState<number | null>(null);
  const top = Math.max(1, ...data.map((d) => d.done));
  const ticks = Array.from({ length: top + 1 }, (_, i) => i);
  const last = data.length - 1;

  return (
    <figure className="m-0 flex flex-col gap-2">
      <div className="relative h-[240px]">
        {/* Recessive gridlines + y labels */}
        {ticks.map((t) => (
          <div
            key={t}
            aria-hidden="true"
            className="absolute left-0 right-0 flex items-center gap-2"
            style={{ bottom: `${(t / top) * 100}%`, transform: "translateY(50%)" }}
          >
            <span className="w-4 text-right text-[11px] tabular-nums text-[#94A3B8]">{t}</span>
            <span className={`h-px flex-1 ${t === 0 ? "bg-[#CBD5E1]" : "bg-[#EEF0F5]"}`} />
          </div>
        ))}

        <div className="absolute bottom-0 left-6 right-0 top-0 flex items-end">
          {data.map((d, i) => {
            const on = active === i;
            const dim = active !== null && !on;
            return (
              <div
                key={d.week}
                tabIndex={0}
                aria-label={`${d.week}, ${d.range}: ${d.done} completed`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="relative flex h-full flex-1 cursor-default items-end justify-center rounded-md outline-none focus-visible:bg-[#EEF0FF]/60"
              >
                {(on || (active === null && i === last)) && (
                  <span
                    className={`pointer-events-none absolute z-10 whitespace-nowrap ${
                      on
                        ? "rounded-lg bg-[#0F172A] px-2.5 py-1.5 text-xs text-white shadow-lg"
                        : "text-xs font-bold text-[#0F172A]"
                    }`}
                    style={{ bottom: `calc(${(d.done / top) * 100}% + 8px)` }}
                  >
                    {on ? (
                      <>
                        <strong className="font-bold">{d.done} done</strong>
                        <span className="text-white/70"> · {d.range}</span>
                      </>
                    ) : (
                      d.done
                    )}
                  </span>
                )}
                <span
                  className="block w-[58%] max-w-[34px] rounded-t-[4px] bg-[#4F46E5] transition-opacity duration-150"
                  style={{ height: `${(d.done / top) * 100}%`, opacity: dim ? 0.35 : 1 }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div aria-hidden="true" className="flex pl-6">
        {data.map((d) => (
          <span key={d.week} className="flex-1 text-center text-xs font-medium text-[#64748B]">
            {d.week}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>Tasks completed per week</caption>
        <thead>
          <tr>
            <th scope="col">Week</th>
            <th scope="col">Dates</th>
            <th scope="col">Completed</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.week}>
              <th scope="row">{d.week}</th>
              <td>{d.range}</td>
              <td>{d.done}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
