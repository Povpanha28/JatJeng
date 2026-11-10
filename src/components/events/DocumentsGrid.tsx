"use client";

import { useState } from "react";
import { DOCUMENTS, DOC_CATEGORIES, DOC_CATEGORY_COLORS, type DocCategory } from "./insightsData";
import { FileTextIcon, MoreHorizontalIcon, UploadIcon } from "./icons";

type Filter = "All" | DocCategory;

export default function DocumentsGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const list = filter === "All" ? DOCUMENTS : DOCUMENTS.filter((d) => d.category === filter);
  const filters: Filter[] = ["All", ...DOC_CATEGORIES];

  return (
    <div className="flex flex-col gap-5">
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const on = f === filter;
          const count = f === "All" ? DOCUMENTS.length : DOCUMENTS.filter((d) => d.category === f).length;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f)}
              className={`flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-[13px] font-semibold transition-colors ${
                on
                  ? "border-[#0F172A] bg-[#0F172A] text-white"
                  : "border-[#E6E8F0] bg-white text-[#475569] hover:border-[#CBD5E1] hover:text-[#0F172A]"
              }`}
            >
              {f}
              <span
                className={`rounded-full px-1.5 text-[11px] font-bold ${
                  on ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#64748B]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {list.map((d) => {
          const c = DOC_CATEGORY_COLORS[d.category];
          return (
            <article
              key={d.id}
              className="flex flex-col gap-4 rounded-[20px] border border-[#E6E8F0] bg-white p-5 transition-shadow hover:shadow-[0_10px_28px_-18px_rgba(15,23,42,0.25)]"
            >
              <div className="flex items-start justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-[14px]"
                  style={{ background: c.bg, color: c.fg }}
                >
                  <FileTextIcon size={21} />
                </span>
                <button
                  type="button"
                  aria-label={`More actions for ${d.name}`}
                  className="-mr-2 -mt-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-[#64748B] hover:bg-[#F1F3F9]"
                >
                  <MoreHorizontalIcon size={18} />
                </button>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: c.fg }}>
                  {d.category}
                </span>
                <h3 className="m-0 truncate text-[15px] font-bold">{d.name}</h3>
                <span className="text-[13px] text-[#64748B]">
                  {d.type} · {d.size}
                </span>
              </div>
              <span className="mt-auto border-t border-[#EEF0F5] pt-3 text-xs text-[#64748B]">
                Uploaded by <span className="font-semibold text-[#334155]">{d.by}</span> · {d.date}
              </span>
            </article>
          );
        })}

        {list.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-3 rounded-[20px] border-[1.5px] border-dashed border-[#CBD5E1] px-6 py-12 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#F1F5F9] text-[#64748B]">
              <UploadIcon size={20} />
            </span>
            <span className="text-sm font-bold">No {filter.toLowerCase()} documents yet</span>
            <span className="text-[13px] text-[#64748B]">Upload a file and tag it as {filter}.</span>
          </div>
        )}
      </div>
    </div>
  );
}
