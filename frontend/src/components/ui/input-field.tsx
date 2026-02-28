"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type InputFieldProps = Omit<React.ComponentProps<typeof Input>, "id"> & {
  /** Label text shown above the input */
  label: React.ReactNode;
  /** Optional id; if not provided, one is derived from name or generated */
  id?: string;
  /** Show required asterisk next to label */
  required?: boolean;
  /** Error message or validation error (renders below input in destructive color). Use with react-hook-form: form.formState.errors.fieldName?.message */
  error?: React.ReactNode;
  /** Optional description or hint below the input */
  description?: React.ReactNode;
  /** Additional class for the outer wrapper */
  wrapperClassName?: string;
  /** Additional class for the label */
  labelClassName?: string;
};

/** Props for InputField when used with react-hook-form Controller (FormInputField). */
type FormInputFieldProps<T extends FieldValues> = Omit<
  InputFieldProps,
  "name" | "error" | "required"
> & {
  control: Control<T>;
  name: FieldPath<T>;
  /** Optional; defaults to true when field has .refine() or schema indicates required. Pass false to hide asterisk. */
  required?: boolean;
};

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      id: idProp,
      required,
      error,
      description,
      wrapperClassName,
      labelClassName,
      className,
      ...inputProps
    },
    ref
  ) => {
    const generatedId = React.useId();
    const id = idProp ?? inputProps.name ?? generatedId;

    return (
      <div
        data-slot="input-field"
        className={cn("flex w-full flex-col gap-2", wrapperClassName)}
      >
        <Label
          htmlFor={id}
          className={cn(
            "text-foreground text-sm font-medium leading-none",
            labelClassName
          )}
        >
          {label}
          {required && (
            <span className="text-destructive ml-0.5" aria-hidden>
              *
            </span>
          )}
        </Label>
        <Input
          ref={ref}
          id={id}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={
            [error && `${id}-error`, description && `${id}-description`]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(
            "bg-muted placeholder:text-muted-foreground h-10 rounded-lg border border-input text-sm",
            className
          )}
          {...inputProps}
        />
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-destructive text-sm font-normal"
          >
            {error}
          </p>
        )}
        {description && !error && (
          <p
            id={`${id}-description`}
            className="text-muted-foreground text-sm font-normal"
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

/**
 * InputField wired to react-hook-form via Controller. Use with zodResolver for
 * validation; zod error messages are shown automatically under the input.
 *
 * @example
 * const form = useForm<FormValues>({ resolver: zodResolver(schema) });
 * <FormInputField control={form.control} name="email" label="Email" />
 */
function FormInputField<T extends FieldValues>({
  control,
  name,
  required,
  ...rest
}: FormInputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <InputField
          {...rest}
          {...field}
          id={rest.id ?? name}
          required={required ?? !!fieldState.error}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

FormInputField.displayName = "FormInputField";

export { InputField, FormInputField };
export type { InputFieldProps, FormInputFieldProps };
