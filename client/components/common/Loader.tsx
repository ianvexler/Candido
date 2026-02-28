import { cn } from "@/lib/utils";

type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
  size?: LoaderSize;
  message?: string;
  centered?: boolean;
  className?: string;
}

const dotSizes: Record<LoaderSize, string> = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
};

const gapSizes: Record<LoaderSize, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
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
        "flex flex-col items-center justify-center gap-4",
        centered && "min-h-48",
        className
      )}
      role="status"
      aria-label={message ?? "Loading"}
    >
      <div className={cn("flex items-center", gapSizes[size])}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-primary",
              dotSizes[size],
              "animate-[loaderDotBounce_0.6s_ease-in-out_infinite]"
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default Loader;
