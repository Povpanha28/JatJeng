"use client";

import { useState } from "react";

type Segment = { label: string; value: number; color: string };

const SIZE = 180;
const STROKE = 22;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;
/** Surface gap between segments, in px along the ring. */
const GAP = 2;

/**
 * Donut with a legend. Hovering or focusing a segment or legend row highlights it and shows its
 * value in the centre; the legend always lists every value, so identity is never colour alone.
 */
export default function Donut({
  segments,
  centerValue,
  centerLabel,
  title,
}: {
  segments: Segment[];
  centerValue: string;
  centerLabel: string;
  title: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const visible = segments.filter((s) => s.value > 0).length;

  const lengths = segments.map((s) => (s.value / total) * C);
  const arcs = lengths.map((len, i) => ({
    len: Math.max(0, len - (visible > 1 ? GAP : 0)),
    offset: lengths.slice(0, i).reduce((a, b) => a + b, 0),
  }));

  const shown = active === null ? null : segments[active];
  const pct = (v: number) => `${Math.round((v / total) * 100)}%`;

  return (
    <figure className="m-0 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={title} className="-rotate-90">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#F1F5F9" strokeWidth={STROKE} />
          {segments.map((s, i) =>
            s.value > 0 ? (
              <circle
                key={s.label}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                strokeDasharray={`${arcs[i].len} ${C - arcs[i].len}`}
                strokeDashoffset={-arcs[i].offset}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="cursor-default transition-opacity duration-150"
                style={{ opacity: active !== null && active !== i ? 0.3 : 1 }}
              />
            ) : null,
          )}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[30px] font-extrabold leading-none tracking-[-0.02em] text-[#0F172A]">
            {shown ? shown.value : centerValue}
          </span>
          <span className="mt-1 max-w-[100px] text-xs text-[#64748B]">
            {shown ? `${shown.label} · ${pct(shown.value)}` : centerLabel}
          </span>
        </div>
      </div>

      <ul className="m-0 flex min-w-[200px] list-none flex-col gap-1 p-0">
        {segments.map((s, i) => (
          <li
            key={s.label}
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40 ${
              active === i ? "bg-[#F1F3F9]" : ""
            }`}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
            <span className="flex-1 text-[#475569]">{s.label}</span>
            <span className="font-bold tabular-nums text-[#0F172A]">{s.value}</span>
            <span className="w-10 text-right text-xs tabular-nums text-[#64748B]">{pct(s.value)}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
