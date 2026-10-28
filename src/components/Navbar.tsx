"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

type NavItem = { label: string; href: string };

const navLinks: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "AI Assistant", href: "#ai-assistant" },
  { label: "Insights", href: "#insights" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header ref={navRef} className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        aria-label="Main"
        className={`mx-auto max-w-7xl rounded-full border bg-background/80 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "border-border shadow-soft"
            : "border-border/60 shadow-sm"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <a
            href="#top"
            className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            aria-label="JatJeng home"
          >
            <Logo />
          </a>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <a
              href="#top"
              className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Log in
            </a>
            <motion.a
              href="#top"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Get Started
            </motion.a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="-mr-2 rounded-full p-2 text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden lg:hidden"
          >
            <div className="space-y-1 rounded-3xl border border-border bg-background p-4 shadow-soft">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#top"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
              >
                Log in
              </a>
              <div className="pt-3">
                <a
                  href="#top"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-full bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
