"use client";

import { useState, useEffect, useRef, useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Presentation,
  GraduationCap,
  Users,
  BookOpen,
  Paperclip,
  ArrowUp,
} from "lucide-react";

const categories = [
  {
    label: "Conference",
    icon: Presentation,
    suggestions: [
      "A two-day marketing conference for 300 attendees",
      "An annual alumni conference with guest speakers",
      "A product launch event with breakout sessions",
    ],
  },
  {
    label: "Workshop",
    icon: GraduationCap,
    suggestions: [
      "A one-day university tech workshop for 120 students",
      "A hands-on design workshop for 40 participants",
      "A weekend coding bootcamp for first-year students",
    ],
  },
  {
    label: "Team Event",
    icon: Users,
    suggestions: [
      "A quarterly offsite for a 25-person team",
      "A company town hall with department updates",
      "A team-building day with a fixed budget cap",
    ],
  },
  {
    label: "Seminar",
    icon: BookOpen,
    suggestions: [
      "A half-day leadership seminar for 80 managers",
      "A career-readiness seminar for graduating students",
      "A compliance training seminar for new hires",
    ],
  },
];

const TYPE_MS = 45;
const ERASE_MS = 22;
const HOLD_MS = 1800;

type PromptBoxProps = {
  /** Id of a visible heading that labels the prompt; falls back to a screen-reader label. */
  labelledBy?: string;
  className?: string;
};

/**
 * The AI event prompt: a textarea with a typewriter placeholder, event-type chips and a send
 * button. Shared by the landing hero and the events home.
 */
export default function PromptBox({ labelledBy, className = "" }: PromptBoxProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [value, setValue] = useState("");
  const [phrase, setPhrase] = useState(0);
  const [typed, setTyped] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const reduceMotion = useReducedMotion();
  const promptId = useId();

  const phrases = useMemo(
    () => categories[activeCategory].suggestions,
    [activeCategory]
  );

  useEffect(() => {
    if (value || focused || reduceMotion) return;

    const target = phrases[phrase % phrases.length];
    let timer: ReturnType<typeof setTimeout>;
    let i = 0;

    const type = () => {
      if (i < target.length) {
        i += 1;
        setTyped(target.slice(0, i));
        timer = setTimeout(type, TYPE_MS);
      } else {
        timer = setTimeout(erase, HOLD_MS);
      }
    };

    const erase = () => {
      if (i > 0) {
        i -= 1;
        setTyped(target.slice(0, i));
        timer = setTimeout(erase, ERASE_MS);
      } else {
        setPhrase((p) => p + 1);
      }
    };

    type();
    return () => clearTimeout(timer);
  }, [phrase, phrases, value, focused, reduceMotion]);

  return (
    // TODO: wire to the AI plan generation flow once it exists.
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`rounded-3xl border border-border bg-background p-3 shadow-soft transition-shadow duration-300 focus-within:ring-4 focus-within:ring-brand/15 ${className}`}
    >
      {!labelledBy && (
        <label htmlFor={promptId} className="sr-only">
          Describe the event you want to plan
        </label>
      )}
      <div className="relative">
        <textarea
          id={promptId}
          ref={textareaRef}
          rows={3}
          value={value}
          aria-labelledby={labelledBy}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full resize-none bg-transparent px-3 pt-3 text-base outline-none md:text-lg"
        />
        {!value && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-3 text-left text-base text-muted-foreground md:text-lg"
          >
            {reduceMotion || focused
              ? "Describe the event you want to plan..."
              : typed}
            {!reduceMotion && !focused && (
              <span className="ml-0.5 inline-block h-5 w-px animate-pulse bg-foreground align-middle" />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-1 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            aria-label="Attach event brief"
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <Paperclip size={16} aria-hidden="true" />
          </button>

          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const active = activeCategory === i;
            return (
              <button
                key={cat.label}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setActiveCategory(i);
                  setPhrase(0);
                  setTyped("");
                  textareaRef.current?.focus();
                }}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                <Icon size={14} aria-hidden="true" />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <motion.button
            type="submit"
            whileHover={reduceMotion ? undefined : { scale: 1.08 }}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            aria-label="Start planning"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
          >
            <ArrowUp size={16} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </form>
  );
}
