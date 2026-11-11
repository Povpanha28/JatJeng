"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2, Mail, RotateCw } from "lucide-react";
import { resendActivation, type ResendState } from "@/app/actions/auth";

const RESEND_COOLDOWN = 60;

/** Quick links to the user's webmail, based on their email domain. */
const INBOXES: Record<string, { label: string; href: string }> = {
  "gmail.com": { label: "Open Gmail", href: "https://mail.google.com/mail/u/0/#inbox" },
  "googlemail.com": { label: "Open Gmail", href: "https://mail.google.com/mail/u/0/#inbox" },
  "outlook.com": { label: "Open Outlook", href: "https://outlook.live.com/mail/0/inbox" },
  "hotmail.com": { label: "Open Outlook", href: "https://outlook.live.com/mail/0/inbox" },
  "live.com": { label: "Open Outlook", href: "https://outlook.live.com/mail/0/inbox" },
  "yahoo.com": { label: "Open Yahoo Mail", href: "https://mail.yahoo.com" },
  "icloud.com": { label: "Open iCloud Mail", href: "https://www.icloud.com/mail" },
};

export default function CheckInbox({ email }: { email: string }) {
  const reduce = useReducedMotion();
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [state, formAction, pending] = useActionState<ResendState, FormData>(
    async (prev, formData) => {
      const res = await resendActivation(prev, formData);
      if (res?.ok) setCooldown(RESEND_COOLDOWN); // restart cooldown after a resend
      return res;
    },
    undefined
  );

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const inbox = INBOXES[email.split("@")[1]?.toLowerCase() ?? ""];

  return (
    <div className="w-full max-w-sm text-center sm:text-left">
      <MailBadge reduce={!!reduce} />

      <h1 className="mt-8 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        Check your inbox
      </h1>
      <p className="mt-3 text-muted-foreground">
        We sent an activation link to{" "}
        {email ? (
          <span className="break-all font-semibold text-foreground">{email}</span>
        ) : (
          "your email"
        )}
        . Click the link to activate your account — you&apos;ll be signed in automatically.
      </p>

      <ol className="mt-8 space-y-3 text-left text-sm">
        {[
          "Open the email from JatJeng",
          "Click “Activate my account”",
          "You’ll land in your workspace, signed in",
        ].map((step, i) => (
          <li key={step} className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-brand">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      {inbox && (
        <a
          href={inbox.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {inbox.label}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}

      <form action={formAction} className={inbox ? "mt-3" : "mt-8"}>
        <input type="hidden" name="email" value={email} />
        <button
          type="submit"
          disabled={pending || cooldown > 0 || !email}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-background font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {pending ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <RotateCw size={16} aria-hidden="true" />
              {cooldown > 0 ? (
                <>
                  Resend email in{" "}
                  <span className="tabular-nums">0:{String(cooldown).padStart(2, "0")}</span>
                </>
              ) : (
                "Resend email"
              )}
            </>
          )}
        </button>
      </form>

      <p aria-live="polite" className="min-h-6 pt-3 text-sm">
        {state && (
          <span
            className={`inline-flex items-center gap-1.5 ${
              state.ok ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {state.ok && <CheckCircle2 size={16} aria-hidden="true" />}
            {state.message}
          </span>
        )}
      </p>

      <div className="mt-6 rounded-2xl bg-muted px-4 py-3 text-left text-sm text-muted-foreground">
        Can&apos;t find it? Check your spam or promotions folder. The link expires in 24 hours.
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Wrong email?{" "}
        <Link href="/signup" className="font-semibold text-brand hover:underline">
          Sign up again
        </Link>
        <span aria-hidden="true"> · </span>
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function MailBadge({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative mx-auto h-20 w-20 sm:mx-0" aria-hidden="true">
      {!reduce && (
        <motion.span
          className="absolute inset-0 rounded-3xl bg-primary/25"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.35, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <motion.div
        initial={reduce ? false : { y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-gradient text-white shadow-soft"
      >
        <Mail size={34} strokeWidth={1.75} />
        <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-background bg-warm" />
      </motion.div>
    </div>
  );
}
