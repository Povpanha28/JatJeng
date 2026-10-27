"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  ClipboardList,
  Users,
  Wallet,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Smart calendar",
    description:
      "See your upcoming events, deadlines, and daily activities in one organized calendar.",
  },
  {
    icon: ClipboardList,
    title: "Event workspace",
    description:
      "Keep each event's overview, agenda, tasks, team, and budget connected in one place.",
  },
  {
    icon: Users,
    title: "Team coordination",
    description:
      "Assign tasks, monitor individual progress, and identify work that needs attention.",
  },
  {
    icon: Wallet,
    title: "Budget recommendations",
    description:
      "Estimate event expenses, review suggested allocations, and explore cost-saving options.",
  },
  {
    icon: BarChart3,
    title: "Event performance analytics",
    description:
      "Turn attendance, engagement, satisfaction, and financial results into meaningful insights.",
  },
];

export default function FullStackFeatures() {
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
    <section id="features" ref={ref} className="scroll-mt-20 px-5 py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div {...rise(0)} className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
            Everything your event needs.
            <br />
            One workspace.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Plan with AI, keep your team aligned, and stay in control of your
            budget — without switching tools.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-5">
          <motion.div {...rise(0.1)} className="lg:col-span-2">
            <div className="relative h-full min-h-80 overflow-hidden rounded-3xl bg-brand-gradient">
              <div className="absolute inset-0 opacity-90">
                <div className="flex h-full flex-col justify-end p-6">
                  <div className="space-y-2 rounded-2xl bg-background/20 p-4 backdrop-blur-sm">
                    <div className="h-2 w-2/3 rounded-full bg-background/50" />
                    <div className="h-2 w-1/2 rounded-full bg-background/30" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/85 p-4 backdrop-blur">
                <p className="text-xs text-muted-foreground">AI Event Planning</p>
                <p className="font-semibold">Agenda, timeline and tasks drafted ✓</p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} {...rise(0.15 + i * 0.07)}>
                  <div className="group h-full rounded-3xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                    <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-muted transition-colors group-hover:bg-brand group-hover:text-primary-foreground">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-bold">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
