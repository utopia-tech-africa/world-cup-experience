"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/stores/booking-store";

/**
 * Ensures the booking store is considered rehydrated after a short delay.
 * Zustand persist's onRehydrateStorage can fail to run or run before merge in some
 * environments (SSR, strict mode). This hook sets hasHydrated to true after 100ms
 * so the price/cost never loads infinitely.
 */
export function useBookingStoreRehydrated() {
  useEffect(() => {
    const id = setTimeout(() => {
      useBookingStore.setState({ hasHydrated: true });
    }, 100);
    return () => clearTimeout(id);
  }, []);
}
