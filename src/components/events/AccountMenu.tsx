"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellIcon,
  ChevronDownIcon,
  CreditCardIcon,
  HelpCircleIcon,
  LogOutIcon,
  UserIcon,
} from "./icons";

const menuItems = [
  { label: "My profile", href: "#", Icon: UserIcon, shortcut: "⌘P" },
  { label: "Notifications", href: "#", Icon: BellIcon, shortcut: "⌘N", badge: 2 },
  { label: "Billing & plan", href: "#", Icon: CreditCardIcon, shortcut: "⌘B" },
  { label: "Help & support", href: "#", Icon: HelpCircleIcon, shortcut: "?" },
];

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="flex h-6 min-w-6 items-center justify-center rounded-md border border-[#E6E8F0] bg-[#F8FAFC] px-1.5 font-sans text-[11px] font-semibold text-[#64748B]">
      {children}
    </kbd>
  );
}

type AccountMenuProps = {
  /** "up" opens the menu above the trigger, for placement at the bottom of a sidebar. */
  placement?: "down" | "up";
  /** "card" is the bordered top-bar trigger, "row" a full-width sidebar row, "avatar" the rail icon. */
  variant?: "card" | "row" | "avatar";
};

export default function AccountMenu({ placement = "down", variant = "card" }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title={variant === "avatar" ? "Dyna Ou" : undefined}
        className={
          variant === "avatar"
            ? `flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border-none p-0 transition-colors ${
                open ? "bg-[#EEF0FF]" : "bg-transparent hover:bg-[#F1F3F9]"
              }`
            : variant === "row"
              ? `flex min-h-12 w-full cursor-pointer items-center gap-2.5 rounded-xl border-none py-1.5 pl-1.5 pr-2.5 text-left transition-colors ${
                  open ? "bg-[#EEF0FF]" : "bg-transparent hover:bg-[#F1F3F9]"
                }`
              : `flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[14px] border bg-white py-1 pl-1 pr-2.5 transition-colors ${
                  open ? "border-[#C7CBF5] bg-[#FAFAFF]" : "border-[#E6E8F0] hover:bg-[#F8FAFC]"
                }`
        }
      >
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#E0E7FF] text-[13px] font-bold text-[#3730A3]">
          DO
        </span>
        {variant !== "avatar" && (
          <>
            <span
              className={`flex min-w-0 flex-col items-start leading-[1.2] ${variant === "row" ? "flex-1" : ""}`}
            >
              <span className="truncate text-[13px] font-bold text-[#0F172A]">Dyna Ou</span>
              <span className="truncate text-xs text-[#64748B]">Event Organizer</span>
            </span>
            <ChevronDownIcon
              size={16}
              className={`shrink-0 text-[#64748B] transition-transform duration-200 ${
                (placement === "up") !== open ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label="Account"
            onKeyDown={onMenuKeyDown}
            initial={{ opacity: 0, y: placement === "up" ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === "up" ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 w-[300px] max-w-[calc(100vw-24px)] rounded-[20px] ${
              placement === "up"
                ? "bottom-[calc(100%+8px)] left-0 origin-bottom-left"
                : "right-0 top-[calc(100%+10px)] origin-top-right"
            } border border-[#E6E8F0] bg-white p-2.5 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.18)]`}
          >
            {/* Profile header */}
            <div className="flex items-center gap-3 px-2.5 pb-3.5 pt-2">
              <span className="relative flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#E0E7FF] text-[15px] font-bold text-[#3730A3]">
                DO
                <span
                  aria-label="Online"
                  className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#22C55E]"
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col leading-[1.3]">
                <span className="text-[15px] font-bold text-[#0F172A]">Dyna Ou</span>
                <span className="text-[13px] text-[#64748B]">Event Organizer</span>
              </span>
              <span className="shrink-0 rounded-full bg-[#EEF0FF] px-2.5 py-1 text-xs font-bold text-[#3730A3]">
                3 events
              </span>
            </div>

            <div className="mx-1 border-t border-[#EEF0F4]" />

            <div className="flex flex-col py-1.5">
              {menuItems.map(({ label, href, Icon, shortcut, badge }) => (
                <a
                  key={label}
                  href={href}
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[15px] font-medium text-[#0F172A] no-underline outline-none hover:bg-[#F6F7FB] focus-visible:bg-[#F1F3F9]"
                >
                  <Icon size={20} className="text-[#64748B]" />
                  <span className="flex-1">{label}</span>
                  {badge ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E5484D] px-1.5 text-[11px] font-bold text-white">
                      {badge}
                    </span>
                  ) : null}
                  <Kbd>{shortcut}</Kbd>
                </a>
              ))}
            </div>

            <div className="mx-1 border-t border-[#EEF0F4]" />

            <div className="pt-1.5">
              <button
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={() => setOpen(false)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-none bg-transparent px-2.5 py-2.5 text-left text-[15px] font-semibold text-[#BE123C] outline-none hover:bg-[#FFF1F2] focus-visible:bg-[#FFF1F2]"
              >
                <LogOutIcon size={20} />
                <span className="flex-1">Log out</span>
                <Kbd>⇧⌘Q</Kbd>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
