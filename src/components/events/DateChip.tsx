import type { EventItem } from "./data";

export const statusDot = (e: EventItem) => (e.status === "Active" ? "#16A34A" : "#F59E0B");

export function DateChip({ event: e, size }: { event: EventItem; size: "sm" | "md" }) {
  const md = size === "md";
  return (
    <span
      className={`block shrink-0 overflow-hidden bg-white text-center shadow-[0_0_0_1px_#E6E8F0] ${
        md ? "w-[42px] rounded-[10px]" : "w-[38px] rounded-[9px]"
      }`}
    >
      <span
        className={`block py-0.5 font-extrabold tracking-[0.08em] text-white ${md ? "text-[9px]" : "text-[8px]"}`}
        style={{ background: e.ink }}
      >
        {e.mon}
      </span>
      <span
        className={`block font-extrabold leading-none text-[#0F172A] ${
          md ? "pb-[5px] pt-1 text-[17px]" : "pb-1 pt-[3px] text-[15px]"
        }`}
      >
        {e.day}
      </span>
    </span>
  );
}
