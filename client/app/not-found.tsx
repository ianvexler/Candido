import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-semibold text-muted-foreground">404</h1>
        <p className="mt-2 text-lg font-medium text-foreground">Page not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Button asChild className="mt-6">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
