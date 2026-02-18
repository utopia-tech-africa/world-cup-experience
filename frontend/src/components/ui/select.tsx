import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

type SelectProps = React.ComponentPropsWithoutRef<"select"> & {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex md:w-fit flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          data-slot="select"
          className={cn(
            "border-input bg-background h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "appearance-none bg-size-[1rem_1rem] bg-position-[right_0.5rem_center] bg-no-repeat pr-8",
            className,
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          }}
          {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value || "empty"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
