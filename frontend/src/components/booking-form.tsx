"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building, Building2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/booking-store";
import { FormInputField } from "@/components/ui/input-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Controller } from "react-hook-form";
import { toBackendDateString } from "@/lib/booking-api-payload";
import { getBasePackagePrice } from "@/lib/booking-pricing";
import { useAddons } from "@/hooks/queries/useAddons";
import { usePackages } from "@/hooks/queries/usePackages";
import type { AddOn } from "@/types/booking";

const bookingSchema = z.object({
  accommodation: z.enum(["hostel", "hotel"]),
  addOns: z.array(z.string()),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  passportNumber: z
    .string()
    .min(5, "Passport number is required (at least 5 characters)"),
  passportExpiryDate: z
    .string()
    .min(1, "Passport expiry date is required")
    .refine((val) => {
      const parsed = toBackendDateString(val);
      if (!parsed) return false;
      const d = new Date(parsed);
      return !Number.isNaN(d.getTime()) && d > new Date();
    }, "Passport expiry must be a future date"),
  specialRequests: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

const defaultValues: BookingFormValues = {
  accommodation: "hotel",
  addOns: [],
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  passportNumber: "",
  passportExpiryDate: "",
  specialRequests: "",
};

export function BookingForm() {
  const router = useRouter();
  const hasHydrated = useBookingStore((s) => s.hasHydrated);
  const packageName = useBookingStore((s) => s.packageName);
  const setBookingForm = useBookingStore((s) => s.setBookingForm);
  const { data: apiAddons = [], isLoading: addonsLoading } = useAddons();
  const { data: packages = [], isLoading: packagesLoading } = usePackages();

  const hostelPrice = getBasePackagePrice(packageName, "hostel", packages);
  const hotelPrice = getBasePackagePrice(packageName, "hotel", packages);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  const didSyncFormFromStore = useRef(false);

  useEffect(() => {
    const state = useBookingStore.getState();
    const hasStoredData =
      state.firstName !== "" ||
      state.lastName !== "" ||
      state.email !== "";
    const hasPackageFromHero = state.packageName?.trim() !== "";
    if (hasStoredData || hasPackageFromHero) {
      didSyncFormFromStore.current = true;
      form.reset({
        accommodation: state.accommodation,
        addOns: state.addOns,
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        phoneNumber: state.phoneNumber,
        passportNumber: state.passportNumber ?? "",
        passportExpiryDate: state.passportExpiryDate ?? "",
        specialRequests: state.specialRequests ?? "",
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- hydrate once from store on mount

  const accommodation = form.watch("accommodation");
  const addOns = form.watch("addOns");

  useEffect(() => {
    if (didSyncFormFromStore.current) {
      didSyncFormFromStore.current = false;
      return;
    }
    setBookingForm({ accommodation, addOns });
  }, [accommodation, addOns, setBookingForm]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setBookingForm({
      accommodation: values.accommodation,
      addOns: values.addOns,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      passportNumber: values.passportNumber ?? "",
      passportExpiryDate: values.passportExpiryDate ?? "",
      specialRequests: values.specialRequests ?? "",
    });
    router.push("/booking/summary");
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-10 rounded-lg border-[0.5px] border-[#BFBFBF]/80 p-4 sm:p-[30px]">
      {/* Choose accommodation — Figma 112-1472 */}
      <section className="flex flex-col gap-3">
        <h2 className="text-foreground text-center text-lg font-bold">
          Choose accommodation
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              value: "hostel" as const,
              label: "Hostel",
              price: hostelPrice,
              Icon: Building,
            },
            {
              value: "hotel" as const,
              label: "Hotel",
              price: hotelPrice,
              Icon: Building2,
            },
          ].map(({ value, label, price, Icon }) => {
            const selected = accommodation === value;
            return (
              <Button
                key={value}
                type="button"
                variant={selected ? "default" : "outline"}
                size="default"
                className="w-full text-xs sm:text-sm"
                onClick={() => form.setValue("accommodation", value)}>
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    selected ? "text-white" : "text-gray-500",
                  )}
                  strokeWidth={1.5}
                />
                {label} –{" "}
                {hasHydrated && !packagesLoading ? (
                  `$${price.toLocaleString()}`
                ) : (
                  <Skeleton className="ml-1 inline-block h-4 w-12" />
                )}
              </Button>
            );
          })}
        </div>
      </section>

      <hr className="border-0 border-t border-[#BFBFBF]/80" />

      {/* Optional Add-ons — from API (admin-managed) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-foreground text-lg font-bold">Optional Add-ons</h2>
        {addonsLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
                <Skeleton className="h-4 w-4 shrink-0 rounded" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : apiAddons.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No add-ons available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {apiAddons.map((addon: AddOn) => (
              <label
                key={addon.id}
                className="text-foreground flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50 has-checked:border-[#354998] has-checked:bg-[#354998]/5">
                <input
                  type="checkbox"
                  className="border-input h-4 w-4 rounded text-[#354998] focus:ring-[#354998]"
                  checked={form.watch("addOns").includes(addon.id)}
                  onChange={(e) => {
                    const prev = form.getValues("addOns");
                    const next = e.target.checked
                      ? [...prev, addon.id]
                      : prev.filter((x) => x !== addon.id);
                    form.setValue("addOns", next);
                  }}
                />
                <span className="text-sm">
                  {addon.name}
                  <span className="text-muted-foreground ml-1">
                    (${Number(addon.price).toLocaleString()})
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
      </section>

      <hr className="border-0 border-t border-[#BFBFBF]/80" />

      {/* Passenger Details */}
      <section className="flex flex-col gap-6">
        <h2 className="text-foreground text-center text-lg font-semibold">
          Passenger Details
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormInputField
            control={form.control}
            name="firstName"
            label="First name"
            placeholder="Alex"
            required
          />
          <FormInputField
            control={form.control}
            name="lastName"
            label="Last name"
            placeholder="Appiah"
            required
          />
          <FormInputField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="eg. alexappiah@gmail.com"
            required
          />
          <FormInputField
            control={form.control}
            name="phoneNumber"
            label="Phone number"
            placeholder="+233 24XXXX XXX"
            required
          />
          <FormInputField
            control={form.control}
            name="passportNumber"
            label="Passport number"
            placeholder="At least 5 characters"
            required
          />
          <div className="flex w-full flex-col gap-2">
            <Label
              htmlFor="passportExpiryDate"
              className="text-foreground text-sm font-medium leading-none">
              Passport expiry date <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={form.control}
              name="passportExpiryDate"
              render={({ field, fieldState }) => {
                const formatDateInput = (raw: string) => {
                  const digits = raw.replace(/\D/g, "").slice(0, 8);
                  if (digits.length <= 2) return digits;
                  if (digits.length <= 4)
                    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
                  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
                };
                return (
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <Calendar className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                      <Input
                        {...field}
                        id="passportExpiryDate"
                        placeholder="DD-MM-YYYY"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(formatDateInput(e.target.value))
                        }
                        className="h-10 rounded-[4px] border-input bg-muted pl-10"
                        aria-invalid={!!fieldState.error}
                      />
                    </div>
                    {fieldState.error?.message && (
                      <p className="text-destructive text-sm">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="specialRequests"
            className="text-foreground text-sm font-medium leading-none">
            Any special requests?
          </Label>
          <Controller
            control={form.control}
            name="specialRequests"
            render={({ field, fieldState }) => (
              <>
                <Textarea
                  id="specialRequests"
                  placeholder=""
                  rows={4}
                  className="min-h-[120px] resize-y"
                  {...field}
                />
                {fieldState.error?.message && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </section>

      {/* Actions — 50/50 on mobile, 30% / 70% from sm up (Figma 121-5168) */}
      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-[30%_1fr]">
        <Button
          variant="outline"
          type="button"
          asChild
          className="w-full border-[#354998] text-[#354998] hover:bg-[#354998]/10">
          <Link href="/">Go back</Link>
        </Button>
        <Button
          type="submit"
          className="w-full bg-[#354998] text-white hover:bg-[#354998]/90"
          disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Booking…" : "Book Seat"}
        </Button>
      </div>
    </form>
  );
}
