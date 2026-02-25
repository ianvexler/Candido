"use client";

import { getJobBoardEntry } from "@/api/resources/jobBoardEntries/getJobBoardEntry";
import Loader from "@/components/common/Loader";
import PageContainer from "@/components/common/PageContainer";
import MainEntryForm from "@/components/jobBoard/entry/MainEntryForm";
import { JobBoardEntry } from "@/lib/types";
import { use, useEffect, useState } from "react";
import EntryDocArea from "@/components/jobBoard/entry/EntryDocArea";

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
  
  const onFileUpdate = (entry: JobBoardEntry) => {
    setJobEntry(entry);
  }

  if (!jobEntry) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-4 w-full mt-3 min-w-0">
        <div className="min-w-0">
          <MainEntryForm
            entry={jobEntry}
            onUpdateEntry={setJobEntry}
          />
        </div>

        <div className="min-w-0 overflow-hidden">
          <EntryDocArea 
            entry={jobEntry} 
            onUpdateEntry={onFileUpdate} 
          />
        </div>
      </div>
    </PageContainer>
  )
}

export default BoardJobEntry;