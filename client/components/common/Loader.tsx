import { cn } from "@/lib/utils";

type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
  size?: LoaderSize;
  message?: string;
  /** Centers the loader in its container with min-height */
  centered?: boolean;
  className?: string;
}

const sizeClasses: Record<LoaderSize, string> = {
  sm: "size-5 border-2",
  md: "size-8 border-2",
  lg: "size-12 border-[3px]",
};

const Loader = ({
  size = "md",
  message,
  centered = false,
  className,
}: LoaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        centered && "min-h-48",
        className
      )}
      role="status"
      aria-label={message ?? "Loading"}
    >
      <div
        className={cn(
          "rounded-full border-primary/30 border-t-primary animate-spin",
          sizeClasses[size]
        )}
      />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default Loader;
