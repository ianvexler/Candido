import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Lost from "@/lib/images/Lost.png";

export default function NotFound() {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <Image
          src={Lost}
          alt="Page not found"
          width={240}
          height={180}
          className="object-contain"
        />

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Page not found</h3>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
