"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ClipboardList,
  Users,
  BarChart3,
  CalendarDays,
  UsersRound,
  CheckCircle2,
} from "lucide-react";

function WindowChrome() {
  return (
    <div className="flex items-center gap-1.5 border-b border-border bg-muted px-3 py-2">
      <span className="h-2.5 w-2.5 rounded-full bg-border" />
      <span className="ml-3 text-[11px] text-muted-foreground">
        app.jatjeng.com
      </span>
    </div>
  );
}

function BriefMockup() {
  const rows = [
    { Icon: ClipboardList, text: "University Tech Day · Workshop" },
    { Icon: CalendarDays, text: "Oct 14–15 · 2 days" },
    { Icon: UsersRound, text: "120 expected participants" },
  ];
  return (
    <div className="space-y-2 p-4">
      {rows.map((row) => (
        <div
          key={row.text}
          className="flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2"
        >
          <row.Icon size={13} className="shrink-0 text-brand" aria-hidden="true" />
          <span className="text-[13px] font-medium text-foreground">{row.text}</span>
        </div>
      ))}
    </div>
  );
}

function CoordinateMockup() {
  return (
    <div className="p-4">
      <div className="flex -space-x-2">
        <span className="h-9 w-9 rounded-full border-2 border-background bg-brand" />
        <span className="h-9 w-9 rounded-full border-2 border-background bg-brand-2" />
        <span className="h-9 w-9 rounded-full border-2 border-background bg-warm" />
      </div>
      <span className="mt-3 inline-block rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
        6 tasks assigned
      </span>
      <div className="mt-3 space-y-1.5">
        <div className="h-2 w-full rounded bg-muted" />
        <div className="h-2 w-4/5 rounded bg-muted" />
      </div>
    </div>
  );
}

function ScoreMockup() {
  const rows = [
    "Attendance 92%",
    "CSAT 4.6 / 5",
    "Budget adherence 95%",
  ];
  return (
    <div className="space-y-2 p-4">
      {rows.map((s) => (
        <div
          key={s}
          className="flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2"
        >
          <CheckCircle2 size={13} className="shrink-0 text-brand" aria-hidden="true" />
          <span className="text-[13px] font-medium text-foreground">{s}</span>
        </div>
      ))}
    </div>
  );
}

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Describe Your Event",
    description:
      "Enter the event name, objectives, dates, and expected audience.",
    Mockup: BriefMockup,
  },
  {
    number: "02",
    icon: Users,
    title: "Plan and Coordinate",
    description:
      "Let AI suggest an agenda, organize tasks, recommend a budget, and help your team stay on track.",
    Mockup: CoordinateMockup,
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Measure and Improve",
    description:
      "Review attendance, engagement, satisfaction, budget performance, and recommendations after the event.",
    Mockup: ScoreMockup,
  },
];

export default function DesignSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: isInView ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.55, delay },
        };

  return (
    <section id="how-it-works" ref={ref} className="scroll-mt-20 px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div {...rise(0)} className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
            From event idea to
            <br />
            measurable impact.
          </h2>
        </motion.div>

        <div className="space-y-20">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const { Mockup } = step;
            const reversed = i % 2 === 1;
            return (
              <motion.div
                key={step.title}
                {...rise(0.1 + i * 0.05)}
                className="grid items-center gap-10 md:grid-cols-2"
              >
                <div className={reversed ? "md:order-2" : ""}>
                  <span className="font-display text-sm font-bold text-brand">
                    {step.number}
                  </span>
                  <div className="mt-2 flex items-center gap-3">
                    <Icon size={24} className="text-brand" aria-hidden="true" />
                    <h3 className="font-display text-3xl font-bold md:text-4xl">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-lg text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <div className={reversed ? "md:order-1" : ""}>
                  <div className="relative rounded-3xl bg-hero bg-muted p-8 md:p-12">
                    <div className="relative z-10 overflow-hidden rounded-2xl border border-border bg-background shadow-soft transition-transform duration-500 hover:-rotate-1 hover:scale-[1.02]">
                      <WindowChrome />
                      <Mockup />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
