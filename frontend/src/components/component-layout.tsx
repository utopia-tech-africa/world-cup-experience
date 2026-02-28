import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
};

const ComponentLayout = ({ children, className, id }: Props) => {
  return (
    <section
      id={id}
      className={cn(
        "max-w-360 w-full px-4 md:px-10 lg:px-20 mx-auto",
        className,
      )}
    >
      {children}
    </section>
  );
};

export default ComponentLayout;
