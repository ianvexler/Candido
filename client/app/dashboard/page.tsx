"use client";
import PageContainer from "@/components/common/PageContainer";
import Title from "@/components/common/Title";
import Description from "@/components/common/Description";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Logo from "@/lib/images/MainLogo.png";
import Image from "next/image";
import { BarChart3Icon, TrendingUpIcon, BriefcaseIcon, GitBranchIcon, TagIcon } from "lucide-react";
import { JobBoardEntriesStats } from "@/lib/types";
import { useEffect, useState } from "react";
import getJobBoardEntriesStats from "@/api/resources/jobBoardEntries/getJobBoardEntriesStats";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

const HomePage = () => {
  const [stats, setStats] = useState<JobBoardEntriesStats>();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    void getJobBoardEntriesStats()
    .then((response) => {
      setIsLoading(false);
      setStats(response)
    })
    .catch((error) => {
      console.error(error);
      toast.error("Failed to get job board entries stats");
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  const activeApplications = () => {
    const applied = stats?.counts.applied ?? 0;
    const assessment = stats?.counts.assessment ?? 0;
    const interview = stats?.counts.interview ?? 0;

    return applied + assessment + interview;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }
  
  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <Title>Dashboard</Title>
            <Description className="mt-1">Insights on your job applications</Description>
          </div>
          <div className="flex items-center justify-center shrink-0 bg-candido-black rounded-lg px-6 py-4">
            <Image src={Logo} alt="Candido" height={40} className="rounded" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-3 min-h-44">
            <CardHeader className="flex flex-row items-center gap-2 mt-2">
              <BriefcaseIcon className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">Applications this week</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-2xl font-semibold">{stats?.thisWeek ?? "—"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats != null
                  ? `${stats.thisWeek >= stats.lastWeek ? "+" : ""}${stats.thisWeek - stats.lastWeek} from last week`
                  : "—"}
              </p>
            </CardContent>
          </Card>

          <Card className="p-3 min-h-44">
            <CardHeader className="flex flex-row items-center gap-2 mt-2">
              <TrendingUpIcon className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">Response rate</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-2xl font-semibold">{stats?.responseRate ?? "—"}%</p>
              <p className="text-xs text-muted-foreground mt-1">{stats?.counts.applied ?? "—"} of {stats?.counts.total ?? "—"} applications</p>
            </CardContent>
          </Card>

          <Card className="p-3 min-h-44">
            <CardHeader className="flex flex-row items-center gap-2 mt-2">
              <GitBranchIcon className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">Active</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-2xl font-semibold">{activeApplications()}</p>
              <p className="text-xs text-muted-foreground mt-1">Awaiting response or in interview</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-3 min-h-70">
            <CardHeader className="flex flex-row items-center gap-2 mt-2">
              <BarChart3Icon className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">Applications by status</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending</span>
                  <span>{stats?.counts.pending ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applied</span>
                  <span>{stats?.counts.applied ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assessment</span>
                  <span>{stats?.counts.assessment ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interview</span>
                  <span>{stats?.counts.interview ?? "—"}</span>
                </div>
                {stats && stats?.counts.offered > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Offered</span>
                    <span>{stats?.counts.offered ?? "—"}</span>
                  </div>
                )}
                {stats && stats?.counts.accepted > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accepted</span>
                    <span>{stats?.counts.accepted ?? "—"}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rejected</span>
                  <span>{stats?.counts.rejected ?? "—"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-3 min-h-70">
            <CardHeader className="flex flex-row items-center gap-2 mt-2">
              <TagIcon className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">Most used tags</CardTitle>
            </CardHeader>

            <CardContent>
              {stats?.topTags && stats?.topTags.length > 0 ? (
                <>
                  <CardDescription className="mb-3">
                    Most used tags across your applications
                  </CardDescription>
                  <div className="space-y-2 text-sm">
                    {stats?.topTags.map((tag) => (
                      <div key={tag.name} className="flex justify-between">
                        <span className="text-muted-foreground">{tag.name}</span>
                        <span className="text-muted-foreground">{tag.count}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <CardDescription className="mb-3 text-muted-foreground">No tag trends found</CardDescription>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
