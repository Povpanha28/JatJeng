"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function WindowChrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-border bg-muted px-3 py-2">
      <span className="h-2.5 w-2.5 rounded-full bg-border" />
      <span className="ml-3 text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function AppsMockup() {
  const stats = [
    { label: "Done", value: "18/24" },
    { label: "On track", value: "5" },
    { label: "Overdue", value: "1" },
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
      <WindowChrome label="jatjeng.app/team" />
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-muted p-3">
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
              <p className="font-display text-xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <div className="flex h-24 items-end gap-1.5">
            {[55, 80, 45, 70, 90, 60, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-brand-gradient opacity-80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WebsitesMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
      <WindowChrome label="jatjeng.app/budget" />
      <div className="p-4">
        <div className="rounded-xl bg-brand-gradient p-5 text-primary-foreground">
          <p className="font-display text-xl font-bold leading-tight">
            $12,400
            <br />
            estimated budget
          </p>
          <span className="mt-3 inline-block rounded-full bg-background px-3 py-1 text-[11px] font-semibold text-foreground">
            Review budget
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="h-14 rounded-lg bg-muted" />
          <div className="h-14 rounded-lg bg-muted" />
          <div className="h-14 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function AgentMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
      <WindowChrome label="assistant · event planning" />
      <div className="space-y-2 p-4 text-xs">
        <p className="font-semibold">Plan a 2-day tech conference for 300</p>
        <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground">
          Drafted a 2-day agenda with 8 sessions.
        </div>
        <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2">
          Tasks assigned and budget drafted ✓
        </div>
        <div className="flex gap-1.5 pt-1">
          {["Agenda", "Tasks", "Budget"].map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-border px-2 py-0.5 text-[10px]"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const useCases = [
  {
    title: "Plan with AI",
    description:
      "Turn an event idea into a structured agenda and actionable timeline.",
    cta: "Try the AI assistant",
    href: "#ai-assistant",
    surface: "bg-brand/10",
    Mockup: AgentMockup,
  },
  {
    title: "Keep everyone aligned",
    description:
      "Assign responsibilities, track progress, and coordinate your team.",
    cta: "See team coordination",
    href: "#features",
    surface: "bg-brand-2/10",
    Mockup: AppsMockup,
  },
  {
    title: "Stay in control of your budget",
    description:
      "Understand expected costs and discover potential savings.",
    cta: "Review budget recommendations",
    href: "#features",
    surface: "bg-warm/10",
    Mockup: WebsitesMockup,
  },
];

export default function UseCases() {
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
      id="use-cases"
      ref={ref}
      className="scroll-mt-20 bg-muted/60 px-5 py-28"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div {...rise(0)} className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
            Plan smarter. Coordinate effortlessly.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            From the first draft to the final report, every part of your
            event lives in one place.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {useCases.map((useCase, i) => {
            const { Mockup } = useCase;
            return (
              <motion.div key={useCase.title} {...rise(0.1 + i * 0.1)}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-background transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft">
                  <div
                    className={`${useCase.surface} p-6 transition-transform duration-500 group-hover:scale-[1.02]`}
                  >
                    <Mockup />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-display text-2xl font-bold">
                      {useCase.title}
                    </h3>
                    <p className="mt-2 flex-1 text-muted-foreground">
                      {useCase.description}
                    </p>
                    <a
                      href={useCase.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
                    >
                      {useCase.cta}
                      <ArrowRight
                        size={16}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </a>
                  </div>
                </article>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
