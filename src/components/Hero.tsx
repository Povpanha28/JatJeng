"use client";

import { motion, useReducedMotion } from "framer-motion";
import HeroArtifacts from "./HeroArtifacts";
import PromptBox from "./PromptBox";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay },
        };

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-hero px-5 pb-24 pt-20 md:pt-28"
    >
      <HeroArtifacts />

      <motion.div
        {...fade(0)}
        className="relative mx-auto max-w-5xl text-center"
      >
        <h1 className="font-display text-[3.2rem] font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-7xl md:text-[6.5rem]">
          Plan better <span className="text-brand-gradient">events</span>.
          <br />
          Without the{" "}
          <span className="relative inline-block line-through decoration-red-500 decoration-[6px] sm:decoration-[8px] md:decoration-[10px]">
            chaos
          </span>
          .
        </h1>

        <p className="mx-auto mt-7 max-w-3xl text-lg text-muted-foreground md:text-xl">
          From your first idea to the final report, JatJeng helps you build
          agendas, coordinate teams, manage budgets, and measure success —
          all in one workspace.
        </p>
      </motion.div>

      <motion.div {...fade(0.15)} className="relative mx-auto mt-12 max-w-3xl">
        <PromptBox />
      </motion.div>
    </section>
  );
}
