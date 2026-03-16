import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MaskRevealButtonProps extends React.ComponentProps<typeof Button> {
  hoverBgClass?: string;
  textClassName?: string;
}

export const MaskRevealButton = React.forwardRef<
  HTMLButtonElement,
  MaskRevealButtonProps
>(
  (
    {
      children,
      className,
      hoverBgClass = "bg-primary-200",
      textClassName = "text-primary-200",
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        className={cn(
          "bg-white group relative overflow-hidden rounded-none px-6 py-5 text-lg font-helvetica transition-all cursor-pointer hover:text-white",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "absolute top-[110%] -left-[10%] w-[10%] h-[55%] rounded-full transition-transform duration-700 ease-[0.19,1,0.22,1] group-hover:scale-[25]",
            hoverBgClass,
          )}
        />
        <span
          className={cn(
            "relative z-10 flex items-center gap-2 transition-all duration-100 group-hover:text-white",
            textClassName,
          )}
        >
          {children}
        </span>
      </Button>
    );
  },
);

MaskRevealButton.displayName = "MaskRevealButton";
