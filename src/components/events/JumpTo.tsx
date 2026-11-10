"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DateChip } from "./DateChip";
import { EVENTS, shortDate, type EventItem } from "./data";
import { GridIcon, PlusIcon, SearchIcon } from "./icons";

type Item = {
  id: string;
  label: string;
  hint: string;
  href: string;
  Icon?: ComponentType<{ size?: number }>;
  event?: EventItem;
};

const noopSubscribe = () => () => {};

const ITEMS: Item[] = [
  { id: "new", label: "New event", hint: "Plan with AI", href: "/events", Icon: PlusIcon },
  { id: "all", label: "Your events", hint: `${EVENTS.length} events`, href: "/events/all", Icon: GridIcon },
  ...EVENTS.map((e) => ({
    id: e.id,
    label: e.title,
    hint: `${e.status} · ${shortDate(e)}`,
    href: `/events/${e.id}`,
    event: e,
  })),
];

/** "Jump to…" search button with a ⌘K / Ctrl+K palette for pages and events. */
export default function JumpTo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // Portals need the document, so only render one after hydration.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const q = query.trim().toLowerCase();
  const results = q
    ? ITEMS.filter((i) => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q))
    : ITEMS;

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
    triggerRef.current?.focus();
  };

  const go = (item: Item) => {
    close();
    router.push(item.href);
  };

  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setActive(0);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) go(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const fade = reduce
    ? {}
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 } };
  const pop = reduce
    ? {}
    : {
        initial: { opacity: 0, y: -8, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -8, scale: 0.98 },
        transition: { duration: 0.15, ease: "easeOut" as const },
      };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={compact ? "Jump to (⌘K)" : undefined}
        title={compact ? "Jump to… ⌘K" : undefined}
        className={
          compact
            ? `flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border-none bg-transparent text-[#64748B] hover:bg-[#F1F3F9] hover:text-[#0F172A] ${className}`
            : `flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl border border-[#E6E8F0] bg-white pl-3 pr-2.5 text-left text-[13px] font-medium text-[#64748B] transition-colors hover:border-[#D5D8E2] hover:text-[#334155] ${className}`
        }
      >
        <SearchIcon size={compact ? 19 : 16} />
        {!compact && (
          <>
            <span className="flex-auto">Jump to…</span>
            <kbd className="rounded-md border border-[#E2E8F0] bg-[#F1F5F9] px-1.5 py-px font-sans text-[11px] font-bold text-[#475569]">
              ⌘K
            </kbd>
          </>
        )}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                {...fade}
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) close();
                }}
                className="fixed inset-0 z-[60] flex items-start justify-center bg-[#0F172A]/30 px-4 pt-[14vh] backdrop-blur-[2px]"
              >
                <motion.div
                  {...pop}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Jump to"
                  className="flex w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-[#E6E8F0] bg-white shadow-[0_24px_60px_-16px_rgba(15,23,42,0.35)]"
                >
                  <div className="flex items-center gap-3 border-b border-[#EEF0F5] px-4">
                    <SearchIcon size={18} className="shrink-0 text-[#64748B]" />
                    <input
                      autoFocus
                      type="text"
                      role="combobox"
                      aria-expanded="true"
                      aria-controls="jump-results"
                      aria-activedescendant={results[active] ? `jump-${results[active].id}` : undefined}
                      aria-label="Search pages and events"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setActive(0);
                      }}
                      onKeyDown={onInputKeyDown}
                      placeholder="Search pages and events…"
                      className="h-14 min-w-0 flex-1 border-none bg-transparent text-[15px] text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                    />
                    <kbd className="rounded-md border border-[#E2E8F0] bg-[#F1F5F9] px-1.5 py-px font-sans text-[11px] font-bold text-[#475569]">
                      esc
                    </kbd>
                  </div>

                  <ul
                    ref={listRef}
                    id="jump-results"
                    role="listbox"
                    className="m-0 max-h-[340px] list-none overflow-y-auto p-2"
                  >
                    {results.map((item, i) => {
                      const on = i === active;
                      return (
                        <li
                          key={item.id}
                          id={`jump-${item.id}`}
                          data-index={i}
                          role="option"
                          aria-selected={on}
                          onMouseMove={() => setActive(i)}
                          onClick={() => go(item)}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 ${
                            on ? "bg-[#F1F3F9]" : ""
                          }`}
                        >
                          {item.event ? (
                            <DateChip event={item.event} size="sm" />
                          ) : (
                            item.Icon && (
                              <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#F1F3F9] text-[#475569]">
                                <item.Icon size={18} />
                              </span>
                            )
                          )}
                          <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="truncate text-sm font-semibold text-[#0F172A]">
                              {item.label}
                            </span>
                            <span className="truncate text-xs text-[#64748B]">{item.hint}</span>
                          </span>
                        </li>
                      );
                    })}
                    {results.length === 0 && (
                      <li className="px-3 py-8 text-center text-sm text-[#64748B]">
                        Nothing matches “{query}”.
                      </li>
                    )}
                  </ul>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
