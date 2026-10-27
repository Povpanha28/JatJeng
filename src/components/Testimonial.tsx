"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, ListChecks, Wallet, BarChart3 } from "lucide-react";

const actions = [
  { label: "Generate agenda", Icon: Sparkles },
  { label: "Suggest tasks", Icon: ListChecks },
  { label: "Review budget", Icon: Wallet },
  { label: "Analyze results", Icon: BarChart3 },
];

function AssistantMockup() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-3 text-xs text-muted-foreground">AI Assistant</span>
      </div>
      <div className="space-y-3 p-5">
        <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          Help me plan a one-day university technology workshop for 120
          participants.
        </div>
        <div className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm text-foreground">
          I can help organize the workshop. Let&apos;s start with a draft
          agenda, a preparation timeline, suggested team responsibilities,
          and a preliminary budget.
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {actions.map(({ label, Icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <Icon size={13} className="text-brand" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Testimonial() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();

  const slide = (x: number, delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, x },
          animate: isInView ? { opacity: 1, x: 0 } : {},
          transition: { duration: 0.6, delay },
        };

  return (
    <section id="ai-assistant" ref={ref} className="scroll-mt-20 px-5 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <motion.div {...slide(-30, 0)}>
            <AssistantMockup />
            <p className="mt-3 text-xs text-muted-foreground">
              Example conversation, shown for illustration.
            </p>
          </motion.div>

          <motion.div {...slide(30, 0.15)}>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
              AI Assistant
            </p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Your AI planning partner, from start to finish.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Get practical assistance with event agendas, task assignments,
              budget decisions, reminders, and performance analysis — all
              suggestions you review and approve.
            </p>
            <a
              href="#how-it-works"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
            >
              See how it works
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
