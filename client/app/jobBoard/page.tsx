"use client";

import { updateJobBoardEntry } from "@/api/resources/jobBoardEntries/updateJobBoardEntry";
import { getJobBoardEntries } from "@/api/resources/jobBoardEntries/getJobBoardEntries";
import Description from "@/components/common/Description";
import Title from "@/components/common/Title";
import AddJobModal from "@/components/jobBoard/AddJobModal";
import JobBoardColumn from "@/components/jobBoard/JobBoardColumn";
import { Button } from "@/components/ui/Button";
import { JobBoardEntry, JobStatus } from "@/lib/types";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import { PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const JobBoardPage = () => {
  const [jobBoardEntries, setJobBoardEntries] = useState<JobBoardEntry[]>([]);
  const [openAddJobModal, setOpenAddJobModal] = useState(false);
  const snapshotRef = useRef<JobBoardEntry[]>([]);
  const latestEntriesRef = useRef<JobBoardEntry[]>([]);

  useEffect(() => {
    void getJobBoardEntries()
      .then((response) => {
        setJobBoardEntries(response.jobBoardEntries);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to get job board entries");
      });
  }, []);

  const onAddJob = (job: JobBoardEntry) => {
    setJobBoardEntries((prev) => [...prev, job]);
  };

  const handleUpdateEntry = async (
    entry: JobBoardEntry,
    newStatus: JobStatus,
    newNumber: number
  ) => {
    try {
      await updateJobBoardEntry(
        entry.id,
        entry.title,
        entry.company,
        entry.location ?? "",
        entry.salary ?? "",
        entry.url ?? "",
        entry.description ?? "",
        newStatus,
        newNumber
      );
    } catch (error) {
      console.error(error);
      toast.error(`Failed to update ${entry.title}`);
      setJobBoardEntries([...snapshotRef.current]);
    }
  };

  const groupEntriesByStatus = (entries: JobBoardEntry[]): Record<JobStatus, JobBoardEntry[]> => {
    const grouped = {} as Record<JobStatus, JobBoardEntry[]>;
    for (const status of Object.values(JobStatus)) {
      grouped[status] = entries
        .filter((e) => e.status === status)
        .sort((a, b) => a.number - b.number);
    }
    return grouped;
  };
  
  const flattenWithUpdates = (grouped: Record<JobStatus, JobBoardEntry[]>): JobBoardEntry[] => {
    const result: JobBoardEntry[] = [];
    for (const [status, entries] of Object.entries(grouped)) {
      entries.forEach((entry, i) => {
        result.push({ ...entry, status: status as JobStatus, number: i + 1 });
      });
    }
    return result;
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col min-h-0 flex-1">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <Title>Job Board</Title>
          <Description className="mt-1">Track your job applications</Description>
        </div>

        <div className="flex flex-col justify-start">
          <Button onClick={() => setOpenAddJobModal(true)}>
            <PlusIcon className="size-4" />
            Add Job
          </Button>
        </div>
      </div>

      <DragDropProvider
        onDragStart={() => {
          snapshotRef.current = [...jobBoardEntries];
        }}
        onDragOver={(event) => {
          const { source } = event.operation;
          if (source?.type === "column") {
            return;
          }

          setJobBoardEntries((entries) => {
            const grouped = groupEntriesByStatus(entries);
            const movedGrouped = move(grouped, event);
            const result = flattenWithUpdates(movedGrouped);
            latestEntriesRef.current = result;
            return result;
          });
        }}
        onDragEnd={(event) => {
          if (event.canceled) {
            setJobBoardEntries(snapshotRef.current);
            return;
          }

          const { source } = event.operation;
          if (!isSortable(source)) {
            return;
          }

          const { index, group } = source;
          if (!group || !Object.values(JobStatus).includes(group as JobStatus)) {
            return;
          }

          if (index < 0) {
            return;
          }

          const newStatus = group as JobStatus;
          const movedEntry = latestEntriesRef.current.find((e) => e.id === source.id);

          if (movedEntry) {
            void handleUpdateEntry(movedEntry, newStatus, index);
          }
        }}
      >
        <div className="overflow-x-auto overflow-y-hidden px-5 pb-5 mt-8">
          <div className="flex justify-start items-stretch divide-x divide-border [&>div]:px-7 [&>div]:first:pl-0">
            {Object.values(JobStatus).map((status: JobStatus) => (
              <JobBoardColumn
                key={status}
                status={status}
                entries={jobBoardEntries
                  .filter((e) => e.status === status)
                  .sort((a, b) => a.number - b.number)}
              />
            ))}
          </div>
        </div>
      </DragDropProvider>

      <AddJobModal 
        isOpen={openAddJobModal} 
        onClose={() => setOpenAddJobModal(false)} 
        onAddJob={onAddJob}
      />
    </div>
  );
};

export default JobBoardPage;
