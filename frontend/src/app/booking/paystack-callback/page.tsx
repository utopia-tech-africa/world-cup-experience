import { Suspense } from "react";
import { PaystackCallbackView } from "./paystack-callback-view";

export const dynamic = "force-dynamic";

function CallbackFallback() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1512px] flex-col items-center justify-center px-4">
      <p className="text-muted-foreground text-sm">Loading…</p>
    </div>
  );
}

export default function PaystackCallbackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const referenceParam = searchParams.reference ?? searchParams.trxref;
  const reference = Array.isArray(referenceParam)
    ? referenceParam[0]
    : referenceParam;

  return (
    <Suspense fallback={<CallbackFallback />}>
      <PaystackCallbackView reference={reference ?? null} />
    </Suspense>
  );
}

