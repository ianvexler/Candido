"use client";

import Link from "next/link";
import Image from "next/image";
import Chaos from "@/lib/images/Chaos.png";
import "./globals.css";

interface GlobalErrorProps {
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 antialiased">
        <div className="flex flex-col items-center gap-6 text-center">
          <Image
            src={Chaos}
            alt="Something went wrong"
            width={240}
            height={180}
            className="object-contain"
          />

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Something went wrong</h3>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try again or go home.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
