"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { SuccessModal } from "@/components/success-modal";
import { getBasePackagePrice } from "@/lib/booking-pricing";
import { buildBookingPayload } from "@/lib/booking-api-payload";
import { useBookingStore } from "@/stores/booking-store";
import { useShallow } from "zustand/react/shallow";
import type { AddOn } from "@/types/booking";
import { useAddons } from "@/hooks/queries/useAddons";
import { usePackages } from "@/hooks/queries/usePackages";
import { useUploadFile } from "@/hooks/mutations/useUploadFile";
import { useCreateBooking } from "@/hooks/mutations/useCreateBooking";
import { cn } from "@/lib/utils";
import { useInitPaystack } from "@/hooks/mutations/useInitPaystack";
import PaystackLogo from "@/assets/svg/paystack-logo.svg";

export type PaymentAccountType = "local" | "international";

export type BookingSummaryData = {
  accommodation: "hostel" | "hotel";
  addOns: Record<string, number>;
  packageName?: string;
  duration?: string;
};

const INTERNATIONAL_ACCOUNT = {
  title: "Altair Logistics, Inc",
  bank: "Chase Bank",
  accountNumber: "2907195358",
  routingNumber: "021000021",
};

const ACCEPTED_FORMATS = "JPG, PNG, WEBP, PDF (Max 10MB)";

type BookingSummaryContentProps = {
  /** Demo/placeholder data when not passed from booking form */
  data?: Partial<BookingSummaryData>;
};

export function BookingSummaryContent({ data }: BookingSummaryContentProps) {
  const [paymentType, setPaymentType] = useState<PaymentAccountType>("local");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successBookingRef, setSuccessBookingRef] = useState<string | null>(
    null,
  );
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const store = useBookingStore(
    useShallow((s) => ({
      accommodation: s.accommodation,
      addOns: s.addOns,
      packageName: s.packageName,
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      phoneNumber: s.phoneNumber,
      passportNumber: s.passportNumber,
      passportExpiryDate: s.passportExpiryDate,
      specialRequests: s.specialRequests,
      extraTravelers: s.extraTravelers,
    })),
  );
  const accommodation = data?.accommodation ?? store.accommodation;
  const addOns = data?.addOns ?? store.addOns;
  const packageName = data?.packageName ?? store.packageName;

  const {
    data: apiAddons = [],
    isLoading: addonsLoading,
    isError: addonsError,
    refetch: refetchAddons,
  } = useAddons();
  const { data: packages = [] } = usePackages();
  const uploadFileMutation = useUploadFile();
  const createBookingMutation = useCreateBooking();
  const initPaystackMutation = useInitPaystack();
  const { addToast } = useToast();

  useEffect(() => {
    if (!redirectUrl) return;
    if (typeof window !== "undefined") {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  const packagePricePerPerson = getBasePackagePrice(
    packageName,
    accommodation,
    packages,
  );
  const passengerCount = 1 + (store.extraTravelers?.length ?? 0);
  const packagePriceTotal = packagePricePerPerson * passengerCount;
  const accommodationLabel = accommodation === "hotel" ? "4 Stars" : "3 Stars";

  const addOnQuantities =
    typeof addOns === "object" && !Array.isArray(addOns) ? addOns : {};
  const addOnItems = apiAddons
    .filter((a: AddOn) => (addOnQuantities[a.id] ?? 0) > 0)
    .map((addon) => {
      const quantity = addOnQuantities[addon.id] ?? 0;
      const unitPrice = Number(addon.price);
      return {
        id: addon.id,
        label: addon.name,
        quantity,
        unitPrice,
        lineTotal: unitPrice * quantity,
      };
    });

  const addOnsTotal = addOnItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const baseTotalAmount = packagePriceTotal + addOnsTotal;

  const PAYSTACK_MARKUP_RATE = 0.0195;
  const paystackMarkup = Math.round(baseTotalAmount * PAYSTACK_MARKUP_RATE * 100) / 100;
  const paystackChargeAmount = Math.round((baseTotalAmount + paystackMarkup) * 100) / 100;
  const totalAmount = baseTotalAmount;

  const isSubmitting =
    uploadFileMutation.isPending ||
    createBookingMutation.isPending ||
    initPaystackMutation.isPending;

  const hasRequiredTravelerFields =
    store.firstName.trim() !== "" &&
    store.lastName.trim() !== "" &&
    store.email.trim() !== "" &&
    store.phoneNumber.trim() !== "" &&
    store.passportNumber.trim() !== "" &&
    store.passportExpiryDate.trim() !== "";

  const requiresProofUpload = paymentType === "international";

  const canSubmit =
    !addonsLoading &&
    apiAddons.length > 0 &&
    hasRequiredTravelerFields &&
    (!requiresProofUpload || selectedFile != null);

  const handleSubmit = async () => {
    if (!canSubmit) {
      if (requiresProofUpload && !selectedFile) {
        addToast("Please upload proof of payment.", "error");
      } else if (!hasRequiredTravelerFields) {
        addToast("Please complete all required traveler details.", "error");
      } else {
        addToast("Please complete all required fields.", "error");
      }
      return;
    }

    try {
      if (paymentType === "international") {
        if (!selectedFile) {
          addToast("Please upload proof of payment.", "error");
          return;
        }
        const url = await uploadFileMutation.mutateAsync(selectedFile);
        const payload = buildBookingPayload({
          fullName: `${store.firstName.trim()} ${store.lastName.trim()}`,
          email: store.email.trim(),
          phone: store.phoneNumber.trim(),
          passportNumber: store.passportNumber.trim(),
          passportExpiryDate: store.passportExpiryDate.trim(),
          specialRequests: store.specialRequests?.trim() ?? "",
          packageName,
          accommodationType: accommodation,
          addOnQuantities: addOnQuantities,
          paymentAccountType: paymentType,
          paymentProofUrl: url,
          apiAddons,
          packages,
          extraTravelers: store.extraTravelers?.length
            ? store.extraTravelers.map((t) => ({
                firstName: t.firstName.trim(),
                lastName: t.lastName.trim(),
                passportNumber: t.passportNumber.trim(),
                passportExpiryDate: t.passportExpiryDate.trim(),
              }))
            : undefined,
        });
        const result = await createBookingMutation.mutateAsync(payload);
        setSuccessBookingRef(result.bookingReference);
        setSuccessModalOpen(true);
        return;
      }

      // Local payment via Paystack:
      // 1) Create a pending booking to get bookingReference
      const payload = buildBookingPayload({
        fullName: `${store.firstName.trim()} ${store.lastName.trim()}`,
        email: store.email.trim(),
        phone: store.phoneNumber.trim(),
        passportNumber: store.passportNumber.trim(),
        passportExpiryDate: store.passportExpiryDate.trim(),
        specialRequests: store.specialRequests?.trim() ?? "",
        packageName,
        accommodationType: accommodation,
        addOnQuantities: addOnQuantities,
        paymentAccountType: "local",
        // Placeholder until Paystack payment completes
        paymentProofUrl: "paystack://pending",
        apiAddons,
        packages,
        extraTravelers: store.extraTravelers?.length
          ? store.extraTravelers.map((t) => ({
              firstName: t.firstName.trim(),
              lastName: t.lastName.trim(),
              passportNumber: t.passportNumber.trim(),
              passportExpiryDate: t.passportExpiryDate.trim(),
            }))
          : undefined,
      });

      const bookingResult = await createBookingMutation.mutateAsync(payload);

      // 2) Initialize Paystack transaction with bookingReference in metadata
      // Amount is in USD; backend converts to GHS using FX API before sending to Paystack
      const initResult = await initPaystackMutation.mutateAsync({
        email: store.email.trim(),
        amount: paystackChargeAmount,
        currency: "USD",
        bookingReference: bookingResult.bookingReference,
      });

      // 3) Redirect user to Paystack hosted payment page
      setRedirectUrl(initResult.authorizationUrl);
    } catch {
      // Errors are surfaced via individual mutations' onError handlers
    }
  };

  return (
    <>
      <SuccessModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        bookingReference={successBookingRef}
      />
      {/* Payment details card — Figma 422-2646: buttons inside cards, one bordered container */}
      <div className="flex flex-col gap-6 rounded-lg border-[0.5px] border-[#BFBFBF]/80 p-4 sm:gap-8 sm:p-[30px]">
        <section>
          <h3 className="text-foreground font-clash mb-4 text-center text-lg font-bold sm:text-left">
            Payment method
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-[24px]">
            <BankAccountCard
              title="Pay with Paystack (Local)"
              bank=""
              accountNumber={undefined}
              routingNumber={undefined}
              type="local"
              selected={paymentType === "local"}
              onSelect={() => setPaymentType("local")}
            />
            <BankAccountCard
              {...INTERNATIONAL_ACCOUNT}
              type="international"
              selected={paymentType === "international"}
              onSelect={() => setPaymentType("international")}
            />
          </div>
        </section>

        {/* Chosen package + Add-ons — Figma 121-5495: single column on mobile */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            {/* Left: Chosen package label, then package name beneath */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">
                Chosen package
              </span>
              <span className="text-foreground font-clash text-lg font-bold">
                {packageName}
              </span>
            </div>
            {/* Right: price on top, accommodation beneath */}
            <div className="flex flex-col gap-1 sm:items-end">
              <span className="font-clash text-foreground text-2xl font-bold">
                ${packagePriceTotal.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-sm">
                {accommodationLabel}
              </span>
            </div>
          </div>

          {(() => {
            const count = 1 + (store.extraTravelers?.length ?? 0);
            const primaryName =
              [store.firstName, store.lastName]
                .filter(Boolean)
                .join(" ")
                .trim() || "Primary";
            return (
              <p className="text-muted-foreground text-sm">
                Travelers: {count} {count === 1 ? "person" : "people"}
                {count > 1
                  ? ` (${primaryName}${store.extraTravelers?.length ? ` + ${store.extraTravelers.length} more` : ""})`
                  : ""}
              </p>
            );
          })()}

          {/* Add-ons as subset of chosen package — smaller text */}
          <div className="flex flex-col gap-2 pt-2">
            <h4 className="text-[#1A1A1A] font-clash text-sm font-bold">
              Add-Ons ({addOnItems.length})
            </h4>
            <ul className="flex flex-col gap-1">
              {addOnItems.map(({ id, label, quantity, lineTotal }) => (
                <li
                  key={id}
                  className="text-muted-foreground flex items-center justify-between gap-4 text-xs sm:text-sm">
                  <span>
                    {label}
                    {quantity > 1 ? (
                      <span className="ml-1">× {quantity}</span>
                    ) : null}
                  </span>
                  <span className="font-clash shrink-0 font-medium text-foreground">
                    ${lineTotal.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-gray-200 pt-2">
              <span className="text-muted-foreground text-sm font-medium">
                Add-ons Total
              </span>
              <span className="font-clash text-foreground font-bold">
                ${addOnsTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </section>

        {/* Total amount — Figma 117-2013: light gray bar, label muted, price bold dark */}
        <section className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col">
            <span className="text-muted-foreground font-clash text-base font-medium sm:text-lg">
              Total Amount
            </span>
            {paymentType === "local" && paystackMarkup > 0 ? (
              <span className="text-muted-foreground text-xs">
                Paystack amount ({(PAYSTACK_MARKUP_RATE * 100).toFixed(2)}% fee): $
                {paystackChargeAmount.toLocaleString()}
              </span>
            ) : null}
          </div>
          <span className="font-clash text-foreground text-2xl font-bold sm:text-3xl">
            ${totalAmount.toLocaleString()}
          </span>
        </section>
      </div>

      {/* Upload proof of payment — only for international payments */}
      {paymentType === "international" && (
        <section className="mt-10 flex flex-col gap-3 sm:mt-12">
          <h3 className="text-foreground font-clash text-center text-lg font-bold sm:text-left">
            Upload proof of payment (e.g. bank transfer receipt)
          </h3>
          <FileUploadInput file={selectedFile} onFileChange={setSelectedFile} />
          <p className="text-muted-foreground text-sm">{ACCEPTED_FORMATS}</p>
          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-foreground font-clash mb-2 text-sm font-semibold">
              Important:
            </p>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Make sure the payment amount matches your total</li>
              <li>Upload a clear screenshot or PDF of your payment receipt</li>
              <li>Our team will verify your payment within 24-48 hours</li>
            </ul>
          </div>
        </section>
      )}

      {/* Add-ons failed to load — common in production when API URL is wrong or CORS */}
      {!addonsLoading && (addonsError || apiAddons.length === 0) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-foreground font-clash mb-2 text-sm font-semibold">
            Add-ons could not be loaded
          </p>
          <p className="text-muted-foreground mb-3 text-sm">
            Submit is disabled until the server is reachable. Check that the
            backend is running and{" "}
            <code className="rounded bg-amber-100 px-1 text-xs">
              NEXT_PUBLIC_API_URL
            </code>{" "}
            points to it.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetchAddons()}>
            Retry loading add-ons
          </Button>
        </div>
      )}

      {/* Bottom actions — last on screen, way down */}
      <div className="mt-12 grid w-full grid-cols-2 gap-3 sm:grid-cols-[30%_1fr]">
        <Button
          variant="outline"
          asChild
          className="border-[#354998] text-[#354998] hover:bg-[#354998]/10">
          <Link href="/booking">Go back</Link>
        </Button>
        <Button
          type="button"
          className="w-full bg-[#354998] text-white hover:bg-[#354998]/90"
          disabled={isSubmitting || !canSubmit}
          onClick={handleSubmit}>
          {isSubmitting
            ? "Confirming…"
            : paymentType === "local"
              ? "Make payment"
              : "Confirm Reservation"}
        </Button>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="font-helvetica text-[#2a2a2a] shrink-0 text-sm font-medium">
        {label}
      </dt>
      <dd className="font-helvetica text-[#2a2a2a] text-right text-sm">
        {value}
      </dd>
    </div>
  );
}

/** Payment details card per Figma 422-2646: button at top, then account details. */
function BankAccountCard({
  title,
  bank,
  accountNumber,
  routingNumber,
  type,
  selected,
  onSelect,
}: {
  title: string;
  bank?: string;
  accountNumber?: string;
  routingNumber?: string;
  type: "local" | "international";
  selected: boolean;
  onSelect: () => void;
}) {
  const isInternational = type === "international";
  const buttonLabel =
    type === "local" ? "Local transfer" : "International Transfer";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "flex flex-col gap-2.5 rounded-lg bg-white p-6 transition-shadow",
        "cursor-pointer",
        selected
          ? "border-[0.8px] border-[#354998] rounded-[8px] shadow-[0px_0px_8px_0px_#354998]"
          : "border-[0.8px] border-[#bfbfbf] rounded-[10px]",
      )}
      aria-pressed={selected}
      aria-label={`${buttonLabel} – ${title}`}>
      {/* Button at top — Figma 422-2529 / 422-2557 */}
      <div className="flex h-12 w-full items-center justify-center">
        <span
          className={cn(
            "flex h-full w-full items-center justify-center rounded-[4px] font-clash text-base font-semibold",
            selected
              ? "bg-[#053370] text-white border border-[rgba(131,131,132,0.3)]"
              : "border border-[rgba(131,131,132,0.3)] text-[#2a2a2a]",
          )}>
          {buttonLabel}
        </span>
      </div>
      {type === "local" && (
        <div className="border border-[rgba(131,131,132,0.3)] mt-4 flex w-full items-center justify-center gap-3 rounded-[4px] p-3">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[3px]">
            {/* Static Paystack logo from local assets, matches Figma size */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PaystackLogo.src ?? PaystackLogo}
              alt="Paystack"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-clash text-[16px] font-semibold text-[#2a2a2a]">
            Local Transfer starts a secure Paystack transaction once you proceed
          </span>
        </div>
      )}
      {/* Account / instructions — only show bank details for international transfers */}
      {isInternational && (
        <>
          <dl className="flex flex-col gap-2">
            <DetailRow label="Name:" value={title} />
            <DetailRow label="Bank:" value={bank} />
            <DetailRow label="Account number:" value={accountNumber} />
            <DetailRow label="Routing number:" value={routingNumber} />
          </dl>
        </>
      )}
    </div>
  );
}

function FileUploadInput({
  file,
  onFileChange,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
}) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition-colors hover:bg-gray-100 has-focus:border-[#354998] has-focus:ring-2 has-focus:ring-[#354998]/20">
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        className="sr-only"
        onChange={(e) => {
          const next = e.target.files?.[0] ?? null;
          onFileChange(next);
        }}
      />
      <Upload className="size-5 shrink-0 text-gray-500" />
      <span className="text-foreground text-center font-medium">
        {file ? file.name : "Choose file"}
      </span>
    </label>
  );
}
