"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type AccordionContextValue = {
  value?: string;
  onValueChange: (value: string) => void;
  collapsible?: boolean;
};

const AccordionContext = React.createContext<AccordionContextValue | undefined>(
  undefined,
);

export function Accordion({
  children,
  className,
  type = "single",
  collapsible = true,
}: {
  children: React.ReactNode;
  className?: string;
  type?: "single";
  collapsible?: boolean;
}) {
  const [internalValue, setInternalValue] = React.useState<
    string | undefined
  >();

  const onValueChange = React.useCallback(
    (val: string) => {
      if (type === "single") {
        setInternalValue((prev) =>
          prev === val && collapsible ? undefined : val,
        );
      }
    },
    [type, collapsible],
  );

  return (
    <AccordionContext.Provider
      value={{ value: internalValue, onValueChange, collapsible }}
    >
      <div className={cn("w-full", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

const AccordionItemContext = React.createContext<{ value: string } | undefined>(
  undefined,
);

export function AccordionItem({
  children,
  className,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  value: string;
}) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={cn("", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(AccordionContext);
  const itemContext = React.useContext(AccordionItemContext);

  if (!context || !itemContext) {
    throw new Error("AccordionTrigger must be used within AccordionItem");
  }

  const isOpen = context.value === itemContext.value;

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={() => context.onValueChange(itemContext.value)}
      className={cn("w-full cursor-pointer", className)}
      data-state={isOpen ? "open" : "closed"}
    >
      {children}
    </button>
  );
}

export function AccordionContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(AccordionContext);
  const itemContext = React.useContext(AccordionItemContext);

  if (!context || !itemContext) {
    throw new Error("AccordionContent must be used within AccordionItem");
  }

  const isOpen = context.value === itemContext.value;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="overflow-hidden"
        >
          <div className={cn("", className)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
