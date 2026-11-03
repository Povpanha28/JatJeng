"use client";

import { useState } from "react";
import { AI_SUGGESTIONS } from "./data";
import { ArrowRightIcon, PenIcon, SparklesIcon } from "./icons";

export default function AIPlanner() {
  const [prompt, setPrompt] = useState("");

  return (
    <section
      aria-labelledby="ai-title"
      className="flex flex-col gap-4 rounded-[22px] border border-[#DCDDFB] bg-white p-[22px] shadow-[inset_0_1px_0_#FFFFFF,0_12px_32px_-20px_rgba(79,70,229,0.35)]"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] text-white">
          <SparklesIcon size={20} />
        </span>
        <div className="flex flex-[1_1_260px] flex-col gap-0.5">
          <h2 id="ai-title" className="m-0 text-[17px] font-bold tracking-[-0.01em]">
            Plan a new event with AI
          </h2>
          <p className="m-0 text-sm text-[#64748B]">
            Describe it once — we&apos;ll draft the workspace, schedule, tasks, team roles and a
            starting budget.
          </p>
        </div>
      </div>

      {/* TODO: wire to the AI plan generation flow once it exists. */}
      <form className="m-0 flex flex-wrap gap-2.5" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="ai-prompt" className="sr-only">
          Describe your event
        </label>
        <div className="flex h-[52px] flex-[1_1_420px] items-center gap-2.5 rounded-[14px] border-[1.5px] border-[#4F46E5] bg-[#FAFAFF] px-4">
          <PenIcon size={18} className="shrink-0 text-[#64748B]" />
          <input
            id="ai-prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Year-end gala for 200 guests in Phnom Penh, mid-December, Khmer & English program"
            className="min-w-0 flex-auto border-none bg-transparent text-[15px] text-[#0F172A] outline-none placeholder:text-[#8A93A6]"
          />
        </div>
        <button
          type="submit"
          className="flex h-[52px] flex-none cursor-pointer items-center justify-center gap-2 rounded-[14px] border-none bg-[#0F172A] px-[22px] text-sm font-bold text-white hover:bg-[#1E293B]"
        >
          Generate plan
          <ArrowRightIcon size={16} />
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-medium text-[#64748B]">Try:</span>
        {AI_SUGGESTIONS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setPrompt(label)}
            className="h-[34px] cursor-pointer rounded-full border border-[#E6E8F0] bg-[#F8FAFC] px-3 text-[13px] font-medium text-[#334155] hover:bg-[#EEF0FF]"
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
