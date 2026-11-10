"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Loader2, MailWarning, RotateCw } from "lucide-react";
import {
  activateAccount,
  resendActivation,
  type ActivationResult,
  type ResendState,
} from "@/app/actions/auth";

const REDIRECT_TO = "/events";
const REDIRECT_DELAY_MS = 2500;

/** `token === null` renders the loading state (used as the Suspense fallback). */
export default function ActivateAccount({ token }: { token: string | null }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [result, setResult] = useState<ActivationResult | null>(
    token === "" ? { status: "invalid" } : null
  );
  const started = useRef(false);

  // Verify the token once (guards against React strict-mode double effects).
  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    activateAccount(token)
      .then(setResult)
      .catch(() => setResult({ status: "invalid" }));
  }, [token]);

  // Auto-login: the session cookie is set, so send them into the app.
  useEffect(() => {
    if (result?.status !== "success") return;
    router.prefetch(REDIRECT_TO);
    const t = setTimeout(() => router.replace(REDIRECT_TO), REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, [result, router]);

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="w-full max-w-sm text-center sm:text-left" aria-live="polite">
      <AnimatePresence mode="wait">
        {result === null && (
          <motion.div key="loading" {...fade} aria-busy="true">
            <StatusIcon tone="neutral">
              <Loader2 size={32} className="animate-spin" />
            </StatusIcon>
            <h1 className="mt-8 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Activating your account…
            </h1>
            <p className="mt-3 text-muted-foreground">
              Hang tight — this only takes a moment.
            </p>
          </motion.div>
        )}

        {result?.status === "success" && (
          <motion.div key="success" {...fade}>
            <StatusIcon tone="success">
              <motion.span
                initial={reduce ? false : { scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.1 }}
              >
                <Check size={36} strokeWidth={3} />
              </motion.span>
            </StatusIcon>
            <h1 className="mt-8 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {result.name ? `You're all set, ${result.name}!` : "You're all set!"}
            </h1>
            <p className="mt-3 text-muted-foreground">
              Your account is activated. Signing you in to your workspace…
            </p>

            <div
              className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label="Redirecting to your workspace"
            >
              <motion.div
                className="h-full origin-left rounded-full bg-brand-gradient"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: REDIRECT_DELAY_MS / 1000, ease: "linear" }}
              />
            </div>

            <button
              type="button"
              onClick={() => router.replace(REDIRECT_TO)}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Go to my workspace
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </motion.div>
        )}

        {(result?.status === "expired" || result?.status === "invalid") && (
          <motion.div key="error" {...fade}>
            <StatusIcon tone="error">
              <MailWarning size={32} />
            </StatusIcon>
            <h1 className="mt-8 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {result.status === "expired" ? "This link has expired" : "Link not valid"}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {result.status === "expired"
                ? "Activation links are valid for 24 hours. Enter your email and we'll send you a fresh one."
                : "This activation link is broken or was already used. If your account is already active, just log in."}
            </p>

            <ResendForm defaultEmail={result.status === "expired" ? result.email : undefined} />

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already activated?{" "}
              <Link href="/login" className="font-semibold text-brand hover:underline">
                Log in
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusIcon({
  tone,
  children,
}: {
  tone: "neutral" | "success" | "error";
  children: React.ReactNode;
}) {
  const styles = {
    neutral: "bg-muted text-brand",
    success: "bg-emerald-500 text-white shadow-[0_12px_40px_-12px_rgb(16_185_129/0.6)]",
    error: "bg-red-50 text-red-600",
  }[tone];
  return (
    <div
      aria-hidden="true"
      className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl sm:mx-0 ${styles}`}
    >
      {children}
    </div>
  );
}

function ResendForm({ defaultEmail }: { defaultEmail?: string }) {
  const [state, formAction, pending] = useActionState<ResendState, FormData>(
    resendActivation,
    undefined
  );

  return (
    <form action={formAction} noValidate className="mt-8 space-y-3 text-left">
      <label htmlFor="resend-email" className="block text-sm font-semibold">
        Email
      </label>
      <input
        id="resend-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        defaultValue={defaultEmail}
        aria-invalid={state ? !state.ok : undefined}
        aria-describedby="resend-status"
        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/20"
      />
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {pending ? (
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        ) : (
          <>
            <RotateCw size={16} aria-hidden="true" />
            Send new activation link
          </>
        )}
      </button>
      <p
        id="resend-status"
        className={`min-h-5 text-sm ${state?.ok ? "text-emerald-700" : "text-red-600"}`}
      >
        {state?.message}
      </p>
    </form>
  );
}
