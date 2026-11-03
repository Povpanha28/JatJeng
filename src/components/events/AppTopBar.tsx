import { BellIcon, ChevronDownIcon } from "./icons";

const navItems = [
  { label: "Events", href: "/events", current: true },
  { label: "Calendar", href: "#", current: false },
  { label: "Team", href: "#", current: false },
  { label: "Budget", href: "#", current: false },
];

export default function AppTopBar() {
  return (
    <header className="sticky top-0 z-[5] border-b border-[#E6E8F0] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-6 px-6 py-3.5">
        <a href="/events" className="flex items-center gap-2.5 text-[#0F172A] no-underline">
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#4F46E5] text-base font-extrabold text-white">
            J
          </span>
          <span className="text-[19px] font-extrabold tracking-[-0.02em]">
            Jat<span className="text-[#4F46E5]">Jeng</span>
          </span>
        </a>

        <nav aria-label="Main" className="flex flex-wrap gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={
                item.current
                  ? "rounded-[10px] bg-[#EEF0FF] px-3.5 py-[9px] text-sm font-semibold text-[#3730A3]"
                  : "rounded-[10px] px-3.5 py-[9px] text-sm font-medium text-[#475569] hover:bg-[#F1F3F9] hover:text-[#0F172A]"
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Notifications, 2 unread"
            className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[#E6E8F0] bg-white text-[#475569]"
          >
            <BellIcon size={20} />
            <span className="absolute right-[11px] top-2.5 h-2 w-2 rounded-full border-2 border-white bg-[#EF4444]" />
          </button>
          <button
            type="button"
            aria-label="Account menu"
            className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[14px] border border-[#E6E8F0] bg-white py-1 pl-1 pr-2.5"
          >
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#E0E7FF] text-[13px] font-bold text-[#3730A3]">
              DO
            </span>
            <span className="flex flex-col items-start leading-[1.2]">
              <span className="text-[13px] font-bold text-[#0F172A]">Dyna Ou</span>
              <span className="text-xs text-[#64748B]">Event Organizer</span>
            </span>
            <ChevronDownIcon size={16} className="text-[#64748B]" />
          </button>
        </div>
      </div>
    </header>
  );
}
