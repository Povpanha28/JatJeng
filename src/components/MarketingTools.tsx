"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Gauge, CalendarCheck, TrendingUp } from "lucide-react";

function HealthMockup() {
  const rows = [
    { label: "Attendance rate", value: 92 },
    { label: "CSAT", value: 88 },
    { label: "Task completion", value: 95 },
  ];
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="flex justify-between text-[11px]">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-semibold">{row.value}%</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-brand-gradient"
              style={{ width: `${row.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SessionsMockup() {
  const sessions = [
    "bg-brand/70",
    "bg-brand/70",
    "bg-warm/70",
    "bg-brand/70",
    "bg-muted",
    "bg-brand/70",
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {sessions.map((cls, i) => (
        <div key={i} className={`aspect-square rounded-lg ${cls}`} />
      ))}
    </div>
  );
}

function EngagementMockup() {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">Session engagement</p>
      <p className="font-display text-2xl font-bold">
        NPS 42 <span className="text-xs text-brand">· fill rate 88%</span>
      </p>
      <div className="mt-2">
        <div className="flex h-24 items-end gap-1.5">
          {[40, 55, 35, 70, 60, 80, 50, 75, 65, 85, 70, 90].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-brand-gradient opacity-80"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const tools = [
  {
    icon: Gauge,
    title: "Event health metrics",
    description:
      "Attendance, satisfaction, and task completion — tracked automatically.",
    Mockup: HealthMockup,
  },
  {
    icon: CalendarCheck,
    title: "Planned vs. delivered sessions",
    description:
      "See which agenda sessions ran as planned, and which changed on the day.",
    Mockup: SessionsMockup,
  },
  {
    icon: TrendingUp,
    title: "Engagement & NPS",
    description:
      "Compare session-by-session engagement and track registration fill rate.",
    Mockup: EngagementMockup,
  },
];

export default function MarketingTools() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: isInView ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.6, delay },
        };

  return (
    <section
      id="insights"
      ref={ref}
      className="scroll-mt-20 bg-muted/60 px-5 py-28"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div {...rise(0)} className="mx-auto mb-4 max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
            Know what worked.
            <br />
            Make the next event even better.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Turn post-event information into a clear picture of your event&apos;s
            performance.
          </p>
        </motion.div>
        <p className="mb-10 text-center text-xs text-muted-foreground">
          Illustrative sample data, shown for demonstration.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            const { Mockup } = tool;
            return (
              <motion.div key={tool.title} {...rise(0.1 + i * 0.1)}>
                <div className="group h-full rounded-3xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
                    <div className="flex items-center gap-1.5 border-b border-border bg-muted px-3 py-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-border" />
                      <span className="ml-3 text-[11px] text-muted-foreground">
                        sample event
                      </span>
                    </div>
                    <div className="p-4">
                      <Mockup />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <Icon size={20} className="text-brand" aria-hidden="true" />
                    <h3 className="font-display text-xl font-bold">
                      {tool.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
