"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";

type Series = { key: string; label: string; color: string; values: number[] };

/**
 * Multi-series line chart on one percentage axis, with a legend, end-of-line labels, a hover/
 * keyboard crosshair tooltip, and a screen-reader table.
 */
export default function LineChart({
  labels,
  series,
  min = 50,
  max = 100,
  title,
}: {
  labels: string[];
  series: Series[];
  min?: number;
  max?: number;
  title: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const n = labels.length;
  const x = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100);
  const y = (v: number) => (1 - (Math.min(max, Math.max(min, v)) - min) / (max - min)) * 100;
  const ticks = [max, (max + min) / 2, min];

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = (e.clientX - r.left) / r.width;
    setActive(Math.max(0, Math.min(n - 1, Math.round(f * (n - 1)))));
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((a) => (a === null ? 0 : Math.min(n - 1, a + 1)));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((a) => (a === null ? n - 1 : Math.max(0, a - 1)));
    } else if (e.key === "Escape") setActive(null);
  };

  return (
    <figure className="m-0 flex flex-col gap-4">
      <div className="flex flex-wrap gap-4" aria-hidden="true">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-2 text-[13px] text-[#475569]">
            <span className="h-[3px] w-4 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        {/* Y axis */}
        <div aria-hidden="true" className="relative h-[240px] w-9 shrink-0">
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-0 -translate-y-1/2 text-[11px] tabular-nums text-[#94A3B8]"
              style={{ top: `${y(t)}%` }}
            >
              {t}%
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1 pr-[72px]">
          <div
            tabIndex={0}
            role="img"
            aria-label={`${title}. Use left and right arrows to read each session.`}
            onMouseMove={onMove}
            onMouseLeave={() => setActive(null)}
            onKeyDown={onKey}
            onBlur={() => setActive(null)}
            className="relative h-[240px] cursor-crosshair rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40"
          >
            {ticks.map((t) => (
              <div
                key={t}
                aria-hidden="true"
                className={`absolute left-0 right-0 h-px ${t === min ? "bg-[#CBD5E1]" : "bg-[#EEF0F5]"}`}
                style={{ top: `${y(t)}%` }}
              />
            ))}

            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              {series.map((s) => (
                <polyline
                  key={s.key}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
                />
              ))}
            </svg>

            {/* End-of-line direct labels */}
            {series.map((s) => (
              <span
                key={s.key}
                aria-hidden="true"
                className="absolute left-full ml-2 -translate-y-1/2 whitespace-nowrap text-xs font-semibold text-[#334155]"
                style={{ top: `${y(s.values[n - 1])}%` }}
              >
                {s.values[n - 1]}%
              </span>
            ))}

            {active !== null && (
              <>
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 top-0 w-px bg-[#94A3B8]"
                  style={{ left: `${x(active)}%` }}
                />
                {series.map((s) => (
                  <span
                    key={s.key}
                    aria-hidden="true"
                    className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
                    style={{ left: `${x(active)}%`, top: `${y(s.values[active])}%`, background: s.color }}
                  />
                ))}
                <div
                  aria-live="polite"
                  className="pointer-events-none absolute top-1 z-10 w-max rounded-xl bg-[#0F172A] px-3 py-2 text-xs text-white shadow-lg"
                  style={
                    x(active) > 60
                      ? { right: `calc(${100 - x(active)}% + 12px)` }
                      : { left: `calc(${x(active)}% + 12px)` }
                  }
                >
                  <div className="mb-1 font-bold">{labels[active]}</div>
                  {series.map((s) => (
                    <div key={s.key} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                      <span className="text-white/75">{s.label}</span>
                      <span className="ml-auto pl-3 font-bold tabular-nums">{s.values[active]}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* X axis */}
          <div aria-hidden="true" className="relative mt-2 h-5">
            {labels.map((l, i) => (
              <span
                key={l}
                className={`absolute top-0 whitespace-nowrap text-[11px] text-[#64748B] ${
                  i % 2 === 1 ? "hidden md:block" : ""
                } ${i === 0 ? "" : i === n - 1 ? "-translate-x-full" : "-translate-x-1/2"}`}
                style={{ left: `${x(i)}%` }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Session</th>
            {series.map((s) => (
              <th key={s.key} scope="col">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((l, i) => (
            <tr key={l}>
              <th scope="row">{l}</th>
              {series.map((s) => (
                <td key={s.key}>{s.values[i]}%</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
