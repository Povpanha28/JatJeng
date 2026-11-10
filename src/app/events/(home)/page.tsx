import type { Metadata } from "next";
import PromptBox from "@/components/PromptBox";

export const metadata: Metadata = {
  title: "Plan an event",
};

// Prompt-first home: a welcome line and the AI prompt, nothing else.
export default function EventsHomePage() {
  return (
    <main
      id="top"
      className="flex flex-1 flex-col items-center justify-center px-4 pb-[18vh] sm:px-6"
    >
      <div className="flex w-full max-w-3xl flex-col gap-7">
        <h1
          id="plan-heading"
          className="m-0 text-center text-[clamp(26px,3.6vw,34px)] font-bold tracking-[-0.025em] text-[#0F172A]"
        >
          Welcome back, Dyna
        </h1>

        <PromptBox labelledBy="plan-heading" />
      </div>
    </main>
  );
}
