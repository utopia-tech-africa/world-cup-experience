"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building,
  Building2,
  Calendar,
  Minus,
  Pencil,
  Plus,
  Trash2,
  UserCheck,
  UserPlus,
  Check,
  X,
} from "lucide-react";
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
import { INCLUSIONS_EXCLUSIONS_DATA } from "@/components/packages/data/packages-data";
import type { AddOn } from "@/types/booking";

const extraTravelerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
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
});

const bookingSchema = z.object({
  accommodation: z.enum(["hostel", "hotel"]),
  addOns: z.record(z.string(), z.number().int().min(0)),
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
  extraTravelers: z.array(extraTravelerSchema),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

const defaultValues: BookingFormValues = {
  accommodation: "hotel",
  addOns: {},
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  passportNumber: "",
  passportExpiryDate: "",
  specialRequests: "",
  extraTravelers: [],
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

  /** IDs of extra travelers that have been "saved" and shown as a card (per Figma). */
  const [savedExtraIds, setSavedExtraIds] = useState<Set<string>>(new Set());

  const didSyncFormFromStore = useRef(false);

  useEffect(() => {
    const state = useBookingStore.getState();
    const hasStoredData =
      state.firstName !== "" || state.lastName !== "" || state.email !== "";
    const hasPackageFromHero = state.packageName?.trim() !== "";
    const addOns =
      typeof state.addOns === "object" && !Array.isArray(state.addOns)
        ? state.addOns
        : {};
    if (hasStoredData || hasPackageFromHero) {
      didSyncFormFromStore.current = true;
      form.reset({
        accommodation: state.accommodation,
        addOns,
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        phoneNumber: state.phoneNumber,
        passportNumber: state.passportNumber ?? "",
        passportExpiryDate: state.passportExpiryDate ?? "",
        specialRequests: state.specialRequests ?? "",
        extraTravelers: state.extraTravelers ?? [],
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
      extraTravelers: values.extraTravelers ?? [],
    });
    router.push("/booking/summary");
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "extraTravelers",
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-10 rounded-lg border-[0.5px] border-[#BFBFBF]/80 p-4 sm:p-[30px]">
      {/* Choose accommodation — Figma 112-1472 */}
      <section className="flex flex-col gap-3">
        <h2 className="text-foreground font-clash text-center font-medium text-lg md:text-2xl">
          Choose accommodation type
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              value: "hostel" as const,
              label: "3 Stars",
              price: hostelPrice,
              Icon: Building,
            },
            {
              value: "hotel" as const,
              label: "4 Stars",
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
                  <span className="font-helvetica">
                    ${price.toLocaleString()}
                  </span>
                ) : (
                  <Skeleton className="ml-1 inline-block h-4 w-12" />
                )}
              </Button>
            );
          })}
        </div>
      </section>

      <hr className="border-0 border-t border-[#BFBFBF]/80" />

      {/* Package inclusions/exclusions block (Figma card style) */}
      <section className="flex flex-col lg:flex-row gap-6">
        {/* inclusions */}
        <div className="flex-1 border border-[#A0C63E] p-6 rounded-bl-[40px] shadow-[0_0_10px_2px_rgba(113,163,79,0.15)]">
          <div className="mb-6">
            <h3 className="text-[24px] text-[#386D13] font-semibold font-clash">
              Package Inclusions
            </h3>
            <div className="w-full mt-3 border-b border-black/27" />
          </div>

          <div className="flex flex-col gap-[4px]">
            {INCLUSIONS_EXCLUSIONS_DATA.inclusions.map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-[12px] h-[12px] flex items-center justify-center bg-[#71A34F]">
                    <Check size={10} color="#FFFFFF" />
                  </div>
                </div>
                <p className="text-[#2A2A2A] font-helvetica font-medium text-[13px]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* exclusions */}
        <div className="flex-1 border border-[#FF3401D9] p-6 shadow-[0_0_10px_3px_rgba(255,52,1,0.15)] rounded-bl-[40px] lg:rounded-bl-none">
          <div className="mb-6">
            <h3 className="text-[24px] text-[#FF3401] font-semibold font-clash">
              Package Exclusions
            </h3>
            <div className="w-full mt-3 border-b border-black/27" />
          </div>

          <div className="flex flex-col gap-[4px]">
            {INCLUSIONS_EXCLUSIONS_DATA.exclusions.map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-[12px] h-[12px] flex items-center justify-center bg-[#FF3401]">
                    <X size={10} color="#FFFFFF" />
                  </div>
                </div>
                <p className="text-[#2A2A2A] font-medium text-[13px] font-helvetica">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-0 border-t border-[#BFBFBF]/80" />

      {/* Optional Add-ons — from API (admin-managed) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-foreground font-clash text-lg font-medium md:text-2xl">
          Optional Add-ons
        </h2>
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
            {apiAddons.map((addon: AddOn) => {
              const qty = form.watch("addOns")[addon.id] ?? 0;
              return (
                <div
                  key={addon.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3",
                    qty > 0 && "border-[#354998] bg-[#354998]/5",
                  )}>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground text-sm font-medium truncate">
                      {addon.name}
                    </p>
                    <p className="font-helvetica text-muted-foreground text-xs">
                      ${Number(addon.price).toLocaleString()} each
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8 rounded-[4px]"
                      onClick={() => {
                        const prev = { ...form.getValues("addOns") };
                        const next = Math.max(0, (prev[addon.id] ?? 0) - 1);
                        if (next === 0) delete prev[addon.id];
                        else prev[addon.id] = next;
                        form.setValue("addOns", prev);
                      }}
                      aria-label={`Decrease ${addon.name}`}>
                      <Minus className="size-4" />
                    </Button>
                    <span
                      className="font-helvetica w-6 text-center text-sm tabular-nums"
                      aria-live="polite">
                      {qty}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8 rounded-[4px]"
                      onClick={() => {
                        const prev = { ...form.getValues("addOns") };
                        prev[addon.id] = (prev[addon.id] ?? 0) + 1;
                        form.setValue("addOns", prev);
                      }}
                      aria-label={`Increase ${addon.name}`}>
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <hr className="border-0 border-t border-[#BFBFBF]/80" />

      {/* Passenger Details */}
      <section className="flex flex-col gap-6">
        <h2 className="text-foreground font-clash text-lg md:text-2xl font-medium">
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

        {/* Book for more people — saved cards above Add passenger, same card style */}
        <div className="flex flex-col gap-4">
          <h3 className="text-foreground font-clash text-base font-semibold">
            Book for more people
          </h3>

          {/* Saved passenger cards (same style as Add passenger, above the button) */}
          {fields.length > 0 && (
            <div className="flex flex-col gap-2">
              {fields.map((field, index) => {
                if (!savedExtraIds.has(field.id)) return null;
                const firstName = form.watch(
                  `extraTravelers.${index}.firstName`,
                );
                const lastName = form.watch(`extraTravelers.${index}.lastName`);
                const fullName =
                  [firstName, lastName].filter(Boolean).join(" ") ||
                  "Passenger";
                return (
                  <div
                    key={field.id}
                    className="flex h-12 w-full items-center gap-2 rounded-[4px] bg-black/8 px-3 py-3">
                    <UserCheck
                      className="size-6 shrink-0 text-[#053370]"
                      aria-hidden
                    />
                    <span className="font-clash text-lg font-semibold leading-6 text-[#053370] flex-1 min-w-0 truncate">
                      {fullName}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 text-[#053370] hover:bg-black/10"
                      onClick={() =>
                        setSavedExtraIds((prev) => {
                          const next = new Set(prev);
                          next.delete(field.id);
                          return next;
                        })
                      }
                      aria-label={`Edit ${fullName}`}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 text-destructive hover:text-destructive"
                      onClick={() => {
                        setSavedExtraIds((prev) => {
                          const next = new Set(prev);
                          next.delete(field.id);
                          return next;
                        });
                        remove(index);
                      }}
                      aria-label={`Remove ${fullName}`}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Editing forms (new or after Edit) — above Add passenger */}
          {fields.some((f) => !savedExtraIds.has(f.id)) && (
            <div className="flex flex-col gap-4 rounded-lg border border-[#BFBFBF]/80 p-4">
              {fields.map((field, index) => {
                if (savedExtraIds.has(field.id)) return null;
                return (
                  <div
                    key={field.id}
                    className="flex flex-col gap-3 rounded-md border border-gray-200/80 bg-muted/30 p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground text-sm font-medium">
                        Person {index + 2}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => remove(index)}
                        aria-label={`Remove person ${index + 2}`}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FormInputField
                        control={form.control}
                        name={`extraTravelers.${index}.firstName`}
                        label="First name"
                        placeholder="First name"
                        required
                      />
                      <FormInputField
                        control={form.control}
                        name={`extraTravelers.${index}.lastName`}
                        label="Last name"
                        placeholder="Last name"
                        required
                      />
                      <FormInputField
                        control={form.control}
                        name={`extraTravelers.${index}.passportNumber`}
                        label="Passport number"
                        placeholder="At least 5 characters"
                        required
                      />
                      <div className="flex w-full flex-col gap-2">
                        <Label
                          htmlFor={`extraTravelers.${index}.passportExpiryDate`}
                          className="text-foreground text-sm font-medium leading-none">
                          Passport expiry date{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          control={form.control}
                          name={`extraTravelers.${index}.passportExpiryDate`}
                          render={({ field: f, fieldState: fs }) => {
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
                                    {...f}
                                    id={`extraTravelers.${index}.passportExpiryDate`}
                                    placeholder="DD-MM-YYYY"
                                    value={f.value}
                                    onChange={(e) =>
                                      f.onChange(
                                        formatDateInput(e.target.value),
                                      )
                                    }
                                    className="h-10 rounded-[4px] border-input bg-muted pl-10"
                                    aria-invalid={!!fs.error}
                                  />
                                </div>
                                {fs.error?.message && (
                                  <p className="text-destructive text-sm">
                                    {fs.error.message}
                                  </p>
                                )}
                              </div>
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={async () => {
                          const valid = await form.trigger(
                            `extraTravelers.${index}` as const,
                            { shouldFocus: true },
                          );
                          if (valid) {
                            setSavedExtraIds((prev) =>
                              new Set(prev).add(field.id),
                            );
                          }
                        }}
                        className="h-10 rounded-[4px] bg-[#053370] px-4 font-clash text-base font-semibold text-white hover:bg-[#053370]/90">
                        Save & Continue
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add passenger — always beneath saved cards and any editing forms */}
          <button
            type="button"
            onClick={() =>
              append({
                firstName: "",
                lastName: "",
                passportNumber: "",
                passportExpiryDate: "",
              })
            }
            className="flex h-12 w-full cursor-pointer items-center gap-2 rounded-[4px] bg-black/8 px-3 py-3 text-left transition-opacity hover:opacity-90">
            <UserPlus className="size-6 shrink-0 text-[#053370]" aria-hidden />
            <span className="font-clash text-lg font-semibold leading-6 text-[#053370]">
              Add passenger
            </span>
          </button>
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
          {form.formState.isSubmitting ? "Booking…" : "Proceed to payment"}
        </Button>
      </div>
    </form>
  );
}
