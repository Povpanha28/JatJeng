"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AuthField = "name" | "email" | "password";

export type AuthFormState =
  | {
      errors?: Partial<Record<AuthField, string>>;
      message?: string;
      values?: { name?: string; email?: string };
    }
  | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function read(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function login(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = read(formData, "email");
  const password = read(formData, "password");

  const errors: Partial<Record<AuthField, string>> = {};
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Enter your password.";

  if (Object.keys(errors).length) return { errors, values: { email } };

  // TODO: verify credentials with your auth provider and create a session cookie.

  redirect("/events");
}

export async function signup(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = read(formData, "name");
  const email = read(formData, "email");
  const password = read(formData, "password");

  const errors: Partial<Record<AuthField, string>> = {};
  if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = "Use at least 8 characters with a letter and a number.";
  }

  if (Object.keys(errors).length) return { errors, values: { name, email } };

  // TODO: create the user with your backend — it sends the activation email.
  // Do NOT create a session here; the user is signed in after activation.

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

/* ------------------------------------------------------------------ */
/* Email activation                                                    */
/* ------------------------------------------------------------------ */

export type ResendState = { ok: boolean; message: string } | undefined;

export async function resendActivation(
  _prev: ResendState,
  formData: FormData
): Promise<ResendState> {
  const email = read(formData, "email");
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  // TODO: call your backend to re-send the activation email, e.g.
  // await fetch(`${process.env.API_URL}/auth/resend-activation`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email }),
  // });

  return { ok: true, message: `A new activation link is on its way to ${email}.` };
}

export type ActivationResult =
  | { status: "success"; name?: string }
  | { status: "expired"; email?: string }
  | { status: "invalid" };

/**
 * Verifies the activation token from the email link and, on success,
 * signs the user in by setting the session cookie (auto-login).
 */
export async function activateAccount(token: string): Promise<ActivationResult> {
  if (!token) return { status: "invalid" };

  // TODO: replace with your backend call, e.g.
  // const res = await fetch(`${process.env.API_URL}/auth/activate`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ token }),
  // });
  // if (res.status === 410) return { status: "expired", email: (await res.json()).email };
  // if (!res.ok) return { status: "invalid" };
  // const { sessionToken, user } = await res.json();
  const sessionToken = token; // placeholder until the backend call is wired up
  const user = { name: undefined as string | undefined };

  (await cookies()).set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { status: "success", name: user.name };
}
