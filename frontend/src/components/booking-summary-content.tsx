"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getBasePackagePrice } from "@/lib/booking-pricing";
import { buildBookingPayload } from "@/lib/booking-api-payload";
import { useBookingStore } from "@/stores/booking-store";
import { useShallow } from "zustand/react/shallow";
import type { AddOn } from "@/types/booking";
import { useAddons } from "@/hooks/queries/useAddons";
import { useUploadFile } from "@/hooks/mutations/useUploadFile";
import { useCreateBooking } from "@/hooks/mutations/useCreateBooking";
import { cn } from "@/lib/utils";

export type PaymentAccountType = "local" | "international";

export type BookingSummaryData = {
  accommodation: "hostel" | "hotel";
  addOns: string[];
  packageName?: string;
  duration?: string;
};

const LOCAL_ACCOUNT = {
  title: "Altair Logistics - Local Account",
  bank: "First National Bank",
  accountNumber: "1234567890",
  routingNumber: "021000021",
  accountName: "Altair Logistics LLC",
};

const INTERNATIONAL_ACCOUNT = {
  title: "Altair Logistics - International Account",
  bank: "Intl. Bank of Commerce",
  swiftCode: "IBCOUS33XXX",
  iban: "US12 3456 7890 1234 5678 90",
  accountName: "Altair Logistics LLC",
};

const ACCEPTED_FORMATS = "JPG, PNG, PDF (Max 10MB)";

type BookingSummaryContentProps = {
  /** Demo/placeholder data when not passed from booking form */
  data?: Partial<BookingSummaryData>;
};

export function BookingSummaryContent({ data }: BookingSummaryContentProps) {
  const [paymentType, setPaymentType] = useState<PaymentAccountType>("local");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
  const uploadFileMutation = useUploadFile();
  const createBookingMutation = useCreateBooking();
  const { addToast } = useToast();

  const packagePrice = getBasePackagePrice(packageName, accommodation);
  const accommodationLabel = accommodation === "hotel" ? "Hotel" : "Hostel";

  const addOnItems = addOns
    .map((id) => apiAddons.find((a: AddOn) => a.id === id))
    .filter((a): a is AddOn => a != null)
    .map((addon) => ({
      id: addon.id,
      label: addon.name,
      price: Number(addon.price),
    }));

  const addOnsTotal = addOnItems.reduce((sum, item) => sum + item.price, 0);
  const totalAmount = packagePrice + addOnsTotal;

  const isSubmitting =
    uploadFileMutation.isPending || createBookingMutation.isPending;
  const canSubmit =
    !addonsLoading &&
    apiAddons.length > 0 &&
    selectedFile != null &&
    store.firstName.trim() !== "" &&
    store.lastName.trim() !== "" &&
    store.email.trim() !== "" &&
    store.phoneNumber.trim() !== "" &&
    store.passportNumber.trim() !== "" &&
    store.passportExpiryDate.trim() !== "";

  const handleSubmit = async () => {
    if (!selectedFile || !canSubmit) {
      if (!selectedFile) addToast("Please upload proof of payment.", "error");
      else if (!store.passportNumber.trim() || !store.passportExpiryDate.trim())
        addToast("Passport details are required.", "error");
      else addToast("Please complete all required fields.", "error");
      return;
    }
    try {
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
        addOnIds: addOns,
        paymentAccountType: paymentType,
        paymentProofUrl: url,
        apiAddons,
      });
      await createBookingMutation.mutateAsync(payload);
    } catch {
      // Upload errors: useUploadFile onError shows toast
      // Create errors: useCreateBooking onError shows toast
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-lg border-[0.5px] border-[#BFBFBF]/80 p-4 sm:gap-8 sm:p-[30px]">
      {/* Payment account type toggle — Figma 121-5495 mobile */}
      <section className="flex flex-col gap-3">
        <h2 className="text-foreground text-center text-lg font-bold">
          Choose payment account
        </h2>
        <PaymentAccountToggle value={paymentType} onChange={setPaymentType} />
      </section>

      {/* Main bordered container — border ends before file upload */}
      <div className="flex flex-col gap-6 rounded-lg border-[0.5px] border-[#BFBFBF]/80 p-4 sm:gap-8 sm:p-[30px]">
        {/* Bank account details — stacked on mobile, centered heading */}
        <section>
          <h3 className="text-foreground mb-4 text-center text-lg font-bold sm:text-left">
            Payment details
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <BankAccountCard
              {...LOCAL_ACCOUNT}
              highlighted={paymentType === "local"}
            />
            <BankAccountCard
              {...INTERNATIONAL_ACCOUNT}
              highlighted={paymentType === "international"}
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
              <span className="text-foreground text-lg font-bold">
                {packageName}
              </span>
            </div>
            {/* Right: price on top, accommodation beneath */}
            <div className="flex flex-col gap-1 sm:items-end">
              <span className="text-foreground text-2xl font-bold">
                ${packagePrice.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-sm">
                {accommodationLabel}
              </span>
            </div>
          </div>

          {/* Add-ons as subset of chosen package — smaller text */}
          <div className="flex flex-col gap-2 pt-2">
            <h4 className="text-[#1A1A1A] text-sm font-bold">
              Add-Ons ({addOnItems.length})
            </h4>
            <ul className="flex flex-col gap-1">
              {addOnItems.map(({ id, label, price }) => (
                <li
                  key={id}
                  className="text-muted-foreground flex items-center justify-between gap-4 text-xs sm:text-sm">
                  <span>{label}</span>
                  <span className="shrink-0 font-medium text-foreground">
                    ${price.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-gray-200 pt-2">
              <span className="text-muted-foreground text-sm font-medium">
                Add-ons Total
              </span>
              <span className="text-foreground font-bold">
                ${addOnsTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </section>

        {/* Total amount — Figma 117-2013: light gray bar, label muted, price bold dark */}
        <section className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-4 sm:px-5 sm:py-5">
          <span className="text-muted-foreground text-base font-medium sm:text-lg">
            Total Amount
          </span>
          <span className="text-foreground text-2xl font-bold sm:text-3xl">
            ${totalAmount.toLocaleString()}
          </span>
        </section>
      </div>

      {/* Upload proof of payment — outside bordered container, Figma 121-5495 mobile */}
      <section className="flex flex-col gap-3">
        <h3 className="text-foreground text-center text-lg font-bold sm:text-left">
          Upload proof of payment (e.g. bank transfer receipt)
        </h3>
        <FileUploadInput file={selectedFile} onFileChange={setSelectedFile} />
        <p className="text-muted-foreground text-sm">{ACCEPTED_FORMATS}</p>
        <div className="rounded-lg bg-amber-50 p-4">
          <p className="text-foreground mb-2 text-sm font-semibold">
            Important:
          </p>
          <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
            <li>Make sure the payment amount matches your total</li>
            <li>Upload a clear screenshot or PDF of your payment receipt</li>
            <li>Our team will verify your payment within 24-48 hours</li>
          </ul>
        </div>
      </section>

      {/* Add-ons failed to load — common in production when API URL is wrong or CORS */}
      {!addonsLoading && (addonsError || apiAddons.length === 0) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-foreground mb-2 text-sm font-semibold">
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

      {/* Bottom actions — 50/50 on mobile, 30/70 from sm up */}
      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-[30%_1fr]">
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
            ? "Submitting…"
            : `Submit · $${totalAmount.toLocaleString()}`}
        </Button>
      </div>
    </div>
  );
}

function PaymentAccountToggle({
  value,
  onChange,
}: {
  value: PaymentAccountType;
  onChange: (v: PaymentAccountType) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant={value === "local" ? "default" : "outline"}
        size="default"
        className="w-full text-xs sm:text-sm"
        onClick={() => onChange("local")}>
        Local Transfer
      </Button>
      <Button
        type="button"
        variant={value === "international" ? "default" : "outline"}
        size="default"
        className="w-full text-xs sm:text-sm"
        onClick={() => onChange("international")}>
        International Transfer
      </Button>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="font-medium text-foreground shrink-0">{label}</dt>
      <dd className="text-foreground text-right">{value}</dd>
    </div>
  );
}

function BankAccountCard({
  title,
  bank,
  accountNumber,
  routingNumber,
  accountName,
  swiftCode,
  iban,
  highlighted,
}: {
  title: string;
  bank: string;
  accountNumber?: string;
  routingNumber?: string;
  accountName: string;
  swiftCode?: string;
  iban?: string;
  highlighted?: boolean;
}) {
  const isInternational = swiftCode != null && iban != null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-4",
        highlighted
          ? "border-[#354998] ring-2 ring-[#354998]/20"
          : "border-gray-200",
      )}>
      <h4 className="text-foreground mb-3 font-semibold">{title}</h4>
      <dl className="text-muted-foreground space-y-2 text-sm">
        <DetailRow label="Bank" value={bank} />
        {isInternational ? (
          <>
            <DetailRow label="Swift Code" value={swiftCode} />
            <DetailRow label="IBAN" value={iban} />
          </>
        ) : (
          <>
            <DetailRow label="Account Number" value={accountNumber} />
            <DetailRow label="Routing Number" value={routingNumber} />
          </>
        )}
        <DetailRow label="Account Name" value={accountName} />
      </dl>
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
        accept=".jpg,.jpeg,.png,.pdf"
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
