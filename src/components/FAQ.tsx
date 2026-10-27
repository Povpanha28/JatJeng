"use client";

import { useState, useRef, useId } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "What is JatJeng?",
    a: "JatJeng is an AI-powered workspace for planning, coordinating, and evaluating events — from the first idea to the final report.",
  },
  {
    q: "How does the AI assistant help?",
    a: "Describe your event and JatJeng's AI assistant suggests an agenda, timeline, task list, and budget. You review and approve every suggestion.",
  },
  {
    q: "Can I regenerate the AI-generated agenda?",
    a: "Yes. If the first draft doesn't fit, you can ask the AI assistant to regenerate the agenda at any time.",
  },
  {
    q: "Can my team use JatJeng together?",
    a: "Yes. Add team members, assign tasks, and track individual and team progress from one workspace.",
  },
  {
    q: "Does JatJeng help with budgeting?",
    a: "JatJeng provides budget recommendations and highlights potential cost-saving options to support your decisions.",
  },
  {
    q: "What can I learn after an event ends?",
    a: "Review attendance, participant satisfaction, engagement, budget adherence, and other performance insights to improve your next event.",
  },
  {
    q: "Does the AI act on its own?",
    a: "No. JatJeng's AI assists with planning and suggestions — your team reviews and approves key decisions like budgets and task assignments.",
  },
  {
    q: "Who is JatJeng built for?",
    a: "Event organizers, university groups, corporate teams, and anyone coordinating conferences, workshops, seminars, or training sessions.",
  },
  {
    q: "Can I use JatJeng for multi-day events?",
    a: "Yes — set start and end dates, expected participants, and let JatJeng help you plan events of any length.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  return (
    <section id="faq" ref={ref} className="scroll-mt-20 px-5 py-28">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reduceMotion || isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
            Questions? Answers.
          </h2>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reduceMotion || isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="divide-y divide-border border-y border-border"
        >
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-button-${i}`;
            return (
              <div key={faq.q}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left font-display text-lg font-semibold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                  >
                    {faq.q}
                    <Plus
                      size={20}
                      aria-hidden="true"
                      strokeWidth={2}
                      className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
                        open ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="panel"
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.26,
                        ease: "easeInOut",
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-muted-foreground">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
