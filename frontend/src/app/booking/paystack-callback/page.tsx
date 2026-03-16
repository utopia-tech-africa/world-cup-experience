import { PaystackCallbackView } from "./paystack-callback-view";

export default function PaystackCallbackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const referenceParam = searchParams.reference ?? searchParams.trxref;
  const reference = Array.isArray(referenceParam)
    ? referenceParam[0]
    : referenceParam;

  return <PaystackCallbackView reference={reference ?? null} />;
}

