import { Suspense } from "react";
import type { Metadata } from "next";
import CheckInbox from "@/components/auth/CheckInbox";

export const metadata: Metadata = { title: "Check your email" };

type Props = { searchParams: Promise<{ email?: string | string[] }> };

export default function VerifyEmailPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<CheckInbox email="" />}>
      <WithEmail searchParams={searchParams} />
    </Suspense>
  );
}

async function WithEmail({ searchParams }: Props) {
  const { email } = await searchParams;
  return <CheckInbox email={typeof email === "string" ? email : ""} />;
}
