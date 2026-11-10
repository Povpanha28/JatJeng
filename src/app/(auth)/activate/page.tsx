import { Suspense } from "react";
import type { Metadata } from "next";
import ActivateAccount from "@/components/auth/ActivateAccount";

export const metadata: Metadata = { title: "Activate account" };

type Props = { searchParams: Promise<{ token?: string | string[] }> };

export default function ActivatePage({ searchParams }: Props) {
  return (
    <Suspense fallback={<ActivateAccount token={null} />}>
      <WithToken searchParams={searchParams} />
    </Suspense>
  );
}

async function WithToken({ searchParams }: Props) {
  const { token } = await searchParams;
  return <ActivateAccount token={typeof token === "string" ? token : ""} />;
}
