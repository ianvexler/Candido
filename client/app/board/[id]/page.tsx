"use client";

import { getJobBoardEntry } from "@/api/resources/jobBoardEntries/getJobBoardEntry";
import Loader from "@/components/common/Loader";
import PageContainer from "@/components/common/PageContainer";
import Title from "@/components/common/Title";
import MainEntryForm from "@/components/jobBoard/entry/MainEntryForm";
import { JobBoardEntry } from "@/lib/types";
import { use, useEffect, useState } from "react";

interface BoardJobEntryPageProps {
  params: Promise<{ id: string }>;
}

const BoardJobEntry = ({ params }: BoardJobEntryPageProps) => {
  const { id } = use(params);
  const [jobEntry, setJobEntry] = useState<JobBoardEntry>();

  useEffect(() => {
    let cancelled = false;

    getJobBoardEntry(id).then((response) => {
      if (!cancelled) {
        setJobEntry(response.jobBoardEntry);
      }
    });
    return () => { cancelled = true; };
  }, [id]);
  

  if (!jobEntry) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <PageContainer>
      <Title>{jobEntry.title}</Title>
      
      <MainEntryForm
        entry={jobEntry}
        onUpdateEntry={setJobEntry}
      />
    </PageContainer>
  )
}

export default BoardJobEntry;