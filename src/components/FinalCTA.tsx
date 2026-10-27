"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AppsMockup, WebsitesMockup, AgentMockup } from "./UseCases";

export default function FinalCTA() {
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
    <section ref={ref} className="px-5 py-28">
      <motion.div
        {...rise(0)}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-foreground px-6 py-24 text-center text-background"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-brand-gradient opacity-25"
        />

        <div className="relative">
          <h2 className="font-display text-[clamp(2.5rem,8vh,6rem)] font-extrabold leading-[0.95] tracking-tight">
            Your next great event
            <br />
            starts with a better plan.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-background/80">
            Bring your agenda, tasks, team, and budget together with
            JatJeng.
          </p>

          <a
            href="#top"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-background px-8 py-4 font-semibold text-foreground transition-transform hover:scale-105"
          >
            Start Planning with JatJeng
            <ArrowRight size={16} aria-hidden="true" />
          </a>

          <div className="mx-auto mt-16 grid max-w-4xl gap-4 text-left text-foreground md:grid-cols-3">
            <div className="md:translate-y-6 md:-rotate-3">
              <AppsMockup />
            </div>
            <div>
              <WebsitesMockup />
            </div>
            <div className="md:translate-y-6 md:rotate-3">
              <AgentMockup />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
