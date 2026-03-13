"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  showOutsideDays = true,
  captionLayout = "dropdown",
  ...props
}: CalendarProps) {
  const now = new Date();
  const startMonth = new Date(now.getFullYear() - 1, 0);
  const endMonth = new Date(now.getFullYear() + 2, 11);

  return (
    <DayPicker
      captionLayout={captionLayout}
      startMonth={startMonth}
      endMonth={endMonth}
      showOutsideDays={showOutsideDays}
      className={cn("rdp-root p-3", className)}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "long" }),
        formatYearDropdown: (date) => date.getFullYear().toString(),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
