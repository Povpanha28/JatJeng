import Link from "next/link";
import Logo from "@/components/Logo";
import AccountMenu from "./AccountMenu";
import { BellIcon } from "./icons";

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
        <Link href="/" aria-label="JatJeng home" className="shrink-0 rounded-lg no-underline">
          <Logo />
        </Link>

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
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
