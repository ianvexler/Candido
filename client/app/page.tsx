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
import EditJobScreenshot from "@/lib/images/EditJobScreenshot.png";
import Crane from "@/lib/images/Crane.png";
import {
  EditIcon,
  KanbanIcon,
  SheetIcon,
} from "lucide-react";

const features = [
  {
    icon: KanbanIcon,
    title: "Board",
    description:
      "Track your applications at a glance with a simple drag-and-drop board. Move roles through each stage, from applied to offer, as things progress.",
    screenshot: BoardScreenshot,
  },
  {
    icon: SheetIcon,
    title: "Sheet",
    description:
      "View all your applications in one clear table. Sort, filter, and search by company or status, and use tags to keep everything in order.",
    screenshot: SheetScreenshot,
  },
  {
    icon: EditIcon,
    title: "Manage Applications",
    description:
      "Add applications easily and upload the description, your CV and cover letter. All the details you need, in one place.",
    screenshot: EditJobScreenshot,
  }
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
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-visible">
        <div
          className="absolute inset-0 bg-primary"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />
        <div className="relative bg-linear-to-b from-[#1a1a1a] via-[#222222] to-[#1a1a1a] px-6 pt-16 sm:pt-20">
          <div className="flex justify-between items-end">
            <div className="flex flex-1 flex-col items-center text-center h-full pb-24 md:pb-20">
              <div className="relative inline-flex">
                <div
                  className="absolute -inset-1 rounded-2xl bg-candido/20 blur-xl"
                  aria-hidden
                />
                <div className="relative rounded-2xl border border-white/10 bg-candido-black/90 px-6 py-5 shadow-2xl backdrop-blur-sm">
                  <Image
                    src={Logo}
                    alt="Candido"
                    height={70}
                    className="rounded"
                  />
                </div>
              </div>

              <h1 className="mt-10 text-xl font-bold tracking-tight text-white sm:text-4xl md:text-4xl">
                Track your{" "}
                <span className="bg-linear-to-r from-candido to-candido/80 bg-clip-text text-transparent">
                  job applications
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
                Manage your job applications, CVs, cover letters, and notes in one place.
              </p>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-candido font-semibold text-candido-black shadow-lg shadow-candido/25 transition-all hover:bg-candido/90 hover:shadow-candido/30"
                >
                  <Link href="/register">Create account</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </div>

            <div className="shrink-0 pr-32 hidden lg:block">
              <Image
                src={Crane}
                alt="Helping you track your job applications"
                className="w-full object-contain lg:h-[320px]"
              />
            </div>
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

          <div className="mt-16 space-y-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const isReversed = idx % 2 === 1;
              return (
                <div key={feature.title}>
                  <div
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

                  {idx < features.length - 1 && (
                    <hr className="mx-auto mt-12 max-w-50 border-border" aria-hidden />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
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
