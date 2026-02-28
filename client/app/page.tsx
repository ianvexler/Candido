"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Logo from "@/lib/images/MainLogo.png";
import BoardScreenshot from "@/lib/images/BoardScreenshot.png";
import SheetScreenshot from "@/lib/images/SheetScreenshot.png";
import {
  KanbanIcon,
  LayoutGridIcon,
} from "lucide-react";

const features = [
  {
    icon: KanbanIcon,
    title: "Kanban Board",
    description:
      "Visualize your job applications in a drag-and-drop board. Move applications between stages—from applied to offered—with a single swipe.",
    screenshot: BoardScreenshot,
  },
  {
    icon: LayoutGridIcon,
    title: "Table View",
    description:
      "See all your applications in a sortable, filterable table. Search by company, filter by status, and manage tags to stay organized.",
    screenshot: SheetScreenshot,
  },
  // {
  //   icon: BarChart3Icon,
  //   title: "Dashboard Insights",
  //   description:
  //     "Track your application metrics at a glance. Response rates, applications per week, and status breakdowns help you understand your progress.",
  //   screenshotSlot: "dashboard",
  // },
  // {
  //   icon: FileTextIcon,
  //   title: "Rich Job Entries",
  //   description:
  //     "Store CVs, cover letters, and detailed descriptions for each application. Everything in one place when you need it.",
  //   screenshotSlot: "entry",
  // },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      redirect("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col min-h-screen pt-14">
      <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 text-center">
          <div className="mx-auto inline-flex rounded-xl bg-candido-black px-5 py-4">
            <Image
              src={Logo}
              alt="Candido"
              height={56}
              className="rounded"
            />
          </div>

          <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Track your job applications
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Candido helps you stay organized through your job search. Manage
            applications on a Kanban board, view them in a table, and keep CVs,
            cover letters, and notes in one place.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">Get started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="flex-1 bg-muted/40">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <h2 className="text-center text-2xl font-semibold text-foreground sm:text-3xl">
            Everything you need for your job search
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            From first application to final offer. Candido keeps you on track.
          </p>

          <div className="mt-16 space-y-24">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const isReversed = idx % 2 === 1;
              return (
                <div
                  key={feature.title}
                  className={`flex flex-col gap-8 md:flex-row md:items-center md:gap-12 ${
                    isReversed ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-candido-black p-2.5 text-white">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="min-w-0 flex-1 md:flex-[1.4]">
                    <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden border border-border shadow-lg md:aspect-video">
                      <Image
                        src={feature.screenshot}
                        alt={feature.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 60vw"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 text-center mb-20">
          <h2 className="text-xl font-semibold text-foreground">
            Ready to organize your job search?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Create an account and start tracking your applications today.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">Create account</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
