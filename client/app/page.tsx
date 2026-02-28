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
import { BarChart3Icon, TrendingUpIcon, BriefcaseIcon, GitBranchIcon, TagIcon, InfoIcon } from "lucide-react";

const HomePage = () => {
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

        <div className="flex items-center gap-2 justify-center rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3 text-center text-sm text-muted-foreground">
          <InfoIcon className="size-4 text-muted-foreground" />
          Preview with sample data · Real insights coming soon
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-3 min-h-44">
            <CardHeader className="flex flex-row items-center gap-2 mt-2">
              <BriefcaseIcon className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">Applications this week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">12</p>
              <p className="text-xs text-muted-foreground mt-1">+3 from last week</p>
            </CardContent>
          </Card>

          <Card className="p-3 min-h-44">
            <CardHeader className="flex flex-row items-center gap-2 mt-2">
              <TrendingUpIcon className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">Response rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">24%</p>
              <p className="text-xs text-muted-foreground mt-1">8 of 33 applications</p>
            </CardContent>
          </Card>

          <Card className="p-3 min-h-44">
            <CardHeader className="flex flex-row items-center gap-2 mt-2">
              <GitBranchIcon className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">5</p>
              <p className="text-xs text-muted-foreground mt-1">Awaiting response or in interview</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-3 min-h-64">
            <CardHeader className="flex flex-row items-center gap-2 mt-2">
              <BarChart3Icon className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">Applications by status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Offered</span>
                  <span>5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accepted</span>
                  <span>2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rejected</span>
                  <span>18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Archived</span>
                  <span>8</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-3 min-h-64">
            <CardHeader className="flex flex-row items-center gap-2 mt-2">
              <TagIcon className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">Recent tag trends</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">Most used tags across your applications</CardDescription>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Remote</span>
                  <span className="text-muted-foreground">8 applications</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Frontend</span>
                  <span className="text-muted-foreground">6 applications</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Senior</span>
                  <span className="text-muted-foreground">5 applications</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>React</span>
                  <span className="text-muted-foreground">4 applications</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
