"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Surprised from "@/lib/images/Surprised.png";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <Image
          src={Surprised}
          alt="Something went wrong"
          width={240}
          height={180}
          className="object-contain"
        />

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Something went wrong</h3>
          <p className="text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
        </div>

        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
