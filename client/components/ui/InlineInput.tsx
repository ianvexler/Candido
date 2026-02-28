import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const InlineInput = ({ className, ...props }: ComponentProps<"input">) => {
  return (
    <input
      data-slot="inline-input"
      className={cn(
        "w-full bg-transparent border-border border-b outline-none ring-0 rounded-none px-0 py-1.5 text-base",
        "placeholder:text-muted-foreground",
        "transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export default InlineInput;
