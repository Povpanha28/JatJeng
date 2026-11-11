import Link from "next/link";
import { CalendarCheck, Sparkles, Users } from "lucide-react";
import Logo from "@/components/Logo";

const highlights = [
  { Icon: Sparkles, text: "AI drafts your agenda, tasks, and budget in seconds" },
  { Icon: CalendarCheck, text: "Every deadline and session on one shared calendar" },
  { Icon: Users, text: "Coordinate your whole team in one workspace" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen flex-1 lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <Link
          href="/"
          aria-label="JatJeng home"
          className="w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <Logo />
        </Link>
        <main id="top" className="flex flex-1 items-center justify-center py-12">
          {children}
        </main>
        <p className="text-center text-xs text-muted-foreground lg:text-left">
          © {/* static year keeps the shell prerenderable */}2026 JatJeng
        </p>
      </div>

      {/* Brand side */}
      <aside className="relative hidden overflow-hidden bg-foreground p-12 text-background lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="absolute inset-0 bg-brand-gradient opacity-30" />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl"
        />

        <div className="relative" />

        <div className="relative max-w-md">
          <h2 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight">
            Your next great event starts with a better plan.
          </h2>
          <ul className="mt-10 space-y-4">
            {highlights.map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-background/85">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/10">
                  <Icon size={16} aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative max-w-md rounded-3xl border border-background/10 bg-background/5 p-6 backdrop-blur">
          <blockquote className="text-background/90">
            “We planned a 300-person conference in half the time. JatJeng kept
            everyone on the same page.”
          </blockquote>
          <figcaption className="mt-4 text-sm text-background/60">
            Event Lead, University Tech Week
          </figcaption>
        </figure>
      </aside>
    </div>
  );
}
