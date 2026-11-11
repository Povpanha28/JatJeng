"use client";

import { useActionState, useId, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { login, signup, type AuthFormState } from "@/app/actions/auth";

type Mode = "login" | "signup";

const copy = {
  login: {
    title: "Welcome back",
    subtitle: "Log in to keep planning your events.",
    submit: "Log in",
    switchText: "Don't have an account?",
    switchLabel: "Sign up",
    switchHref: "/signup",
  },
  signup: {
    title: "Create your account",
    subtitle: "Start planning smarter events with JatJeng.",
    submit: "Create account",
    switchText: "Already have an account?",
    switchLabel: "Log in",
    switchHref: "/login",
  },
} as const;

export default function AuthForm({ mode }: { mode: Mode }) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    mode === "login" ? login : signup,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();
  const t = copy[mode];
  const errors = state?.errors ?? {};

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-2 text-muted-foreground">{t.subtitle}</p>

      <GoogleButton disabled={pending} />

      <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} noValidate className="space-y-4">
        {mode === "signup" && (
          <Field
            id={`${id}-name`}
            name="name"
            label="Full name"
            autoComplete="name"
            placeholder="Dyna Sok"
            defaultValue={state?.values?.name}
            error={errors.name}
          />
        )}

        <Field
          id={`${id}-email`}
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state?.values?.email}
          error={errors.email}
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor={`${id}-password`} className="text-sm font-semibold">
              Password
            </label>
            {mode === "login" && (
              <Link
                href="#"
                className="text-sm font-medium text-brand hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <input
              id={`${id}-password`}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder={mode === "login" ? "Your password" : "At least 8 characters"}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? `${id}-password-error` : undefined}
              className={inputClass(!!errors.password) + " pr-11"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-brand"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p id={`${id}-password-error`} className="mt-1.5 text-sm text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        {state?.message && (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {pending ? (
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          ) : (
            <>
              {t.submit}
              <ArrowRight size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      {mode === "signup" && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          By creating an account you agree to our{" "}
          <Link href="#" className="underline hover:text-foreground">Terms</Link> and{" "}
          <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>.
        </p>
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t.switchText}{" "}
        <Link href={t.switchHref} className="font-semibold text-brand hover:underline">
          {t.switchLabel}
        </Link>
      </p>
    </div>
  );
}

function inputClass(invalid: boolean) {
  return `h-12 w-full rounded-xl border bg-background px-4 text-[15px] outline-none transition placeholder:text-muted-foreground/70 focus:ring-4 ${
    invalid
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
      : "border-border focus:border-primary focus:ring-primary/20"
  }`;
}

function Field({
  id,
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass(!!error)}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleButton({ disabled }: { disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-border bg-background font-semibold transition-colors hover:bg-muted disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      Continue with Google
    </button>
  );
}
