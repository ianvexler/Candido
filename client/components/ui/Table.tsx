import { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

function Table({
  className,
  children,
  extra,
  ...props
}: ComponentProps<"table"> & { extra?: ReactNode }) {
  return (
    <div className={cn("overflow-x-auto border border-border rounded-lg", className)}>
      <table className="w-full min-w-[900px] text-sm table-fixed" {...props}>
        {children}
      </table>
      {extra}
    </div>
  );
}

function TableHeader({ ...props }: ComponentProps<"thead">) {
  return <thead {...props} />;
}

function TableBody({ ...props }: ComponentProps<"tbody">) {
  return <tbody {...props} />;
}

function TableRow({
  className,
  interactive,
  ...props
}: ComponentProps<"tr"> & { interactive?: boolean }) {
  return (
    <tr
      className={cn(
        "border-b border-border",
        interactive && "hover:bg-muted/30 cursor-pointer transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  variant = "default",
  ...props
}: ComponentProps<"th"> & { variant?: "default" | "compact" }) {
  return (
    <th
      className={cn(
        "text-left font-medium",
        variant === "compact" ? "px-3 py-3" : "px-4 py-3",
        className
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  muted,
  truncate,
  truncateTitle,
  children,
  ...props
}: ComponentProps<"td"> & { muted?: boolean; truncate?: boolean; truncateTitle?: string }) {
  return (
    <td
      className={cn(
        "px-4 py-3",
        muted && "text-muted-foreground",
        truncate && "min-w-0",
        className
      )}
      {...props}
    >
      {truncate ? (
        <span className="block truncate" title={truncateTitle}>
          {children}
        </span>
      ) : (
        children
      )}
    </td>
  );
}

function TableColGroup({ children, ...props }: ComponentProps<"colgroup">) {
  return <colgroup {...props}>{children}</colgroup>;
}

function TableCol({ className, ...props }: ComponentProps<"col">) {
  return <col className={cn(className)} {...props} />;
}

function TableHeaderRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn("border-b border-border bg-muted/50", className)}
      {...props}
    />
  );
}

function TableEmpty({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("py-12 text-center text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableColGroup,
  TableCol,
  TableHeaderRow,
  TableEmpty,
};
