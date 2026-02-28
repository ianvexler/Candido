"use client";

import { getJobBoardEntries } from "@/api/resources/jobBoardEntries/getJobBoardEntries";
import { updateJobBoardEntry } from "@/api/resources/jobBoardEntries/updateJobBoardEntry";
import { uploadCVJobBoardEntry } from "@/api/resources/jobBoardEntries/uploadCVJobBoardEntry";
import { uploadCoverLetterJobBoardEntry } from "@/api/resources/jobBoardEntries/uploadCoverLetterJobBoardEntry";
import { getFileUpload } from "@/api/resources/uploads/getFileUpload";
import Description from "@/components/common/Description";
import Title from "@/components/common/Title";
import AddJobModal from "@/components/jobBoard/AddJobModal";
import BoardFilters from "@/components/jobBoard/BoardFilters";
import SheetTable from "@/components/jobBoard/sheet/SheetTable";
import { useBoardFilters } from "@/hooks/useBoardFilters";
import { JobBoardEntry, JobStatus } from "@/lib/types";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Sheet } from "@/components/ui/Sheet";
import JobEditPanel from "@/components/jobBoard/JobEditPanel";

const SheetPage = () => {
  const [jobBoardEntries, setJobBoardEntries] = useState<JobBoardEntry[]>([]);
  const [openAddJobModal, setOpenAddJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobBoardEntry>();
  const [statusFilter, setStatusFilter] = useState<JobStatus[]>([]);

  const {
    searchInput,
    handleSearchChange,
    tags,
    handleTagToggle,
    handleClearTags,
    showRejected,
    handleToggleRejected,
    showArchived,
    handleToggleArchived,
    filteredEntries,
  } = useBoardFilters(jobBoardEntries, setJobBoardEntries);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    void getJobBoardEntries()
      .then((response) => setJobBoardEntries(response.jobBoardEntries))
      .catch((error) => {
        console.error(error);
        toast.error("Failed to get job board entries");
      });
    return () => {
      initializedRef.current = false;
    };
  }, [showArchived, showRejected]);

  const showAccepted = useMemo(
    () => jobBoardEntries.some((e) => e.status === JobStatus.ACCEPTED),
    [jobBoardEntries]
  );

  const handleStatusFilterToggle = useCallback((status: JobStatus, checked: boolean) => {
    setStatusFilter((prev) =>
      checked ? [...prev, status] : prev.filter((s) => s !== status)
    );
  }, []);

  const sortedEntries = useMemo(() => {
    let entries = filteredEntries;
    if (!showRejected) entries = entries.filter((e) => e.status !== JobStatus.REJECTED);
    if (!showArchived) entries = entries.filter((e) => e.status !== JobStatus.ARCHIVED);
    if (!showAccepted) entries = entries.filter((e) => e.status !== JobStatus.ACCEPTED);
    if (statusFilter.length > 0) {
      entries = entries.filter((e) => statusFilter.includes(e.status));
    }
    return [...entries].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [filteredEntries, showRejected, showArchived, showAccepted, statusFilter]);

  const onAddJob = useCallback((job: JobBoardEntry) => {
    setJobBoardEntries((prev) => [...prev, job]);
  }, []);

  const onUpdateJob = useCallback((job: JobBoardEntry) => {
    setJobBoardEntries((prev) =>
      prev.map((entry) => (entry.id === job.id ? job : entry))
    );
    setSelectedJob((prev) => (prev?.id === job.id ? job : prev));
  }, []);

  const handleSelectJob = useCallback((job: JobBoardEntry) => {
    setSelectedJob(job);
  }, []);

  const handleCvUpload = useCallback(
    async (entry: JobBoardEntry, file: File) => {
      try {
        const response = await uploadCVJobBoardEntry(entry.id, undefined, file);
        const updated = { ...entry, ...response.jobBoardEntry };
        setJobBoardEntries((prev) =>
          prev.map((e) => (e.id === entry.id ? updated : e))
        );
        setSelectedJob((prev) => (prev?.id === entry.id ? updated : prev));
        toast.success("CV uploaded");
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload CV");
      }
    },
    []
  );

  const handleCoverLetterUpload = useCallback(
    async (entry: JobBoardEntry, file: File) => {
      try {
        const response = await uploadCoverLetterJobBoardEntry(entry.id, undefined, file);
        const updated = { ...entry, ...response.jobBoardEntry };
        setJobBoardEntries((prev) =>
          prev.map((e) => (e.id === entry.id ? updated : e))
        );
        setSelectedJob((prev) => (prev?.id === entry.id ? updated : prev));
        toast.success("Cover letter uploaded");
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload cover letter");
      }
    },
    []
  );

  const handleCvDownload = useCallback(async (entry: JobBoardEntry) => {
    if (!entry.cvKey) return;
    try {
      const blob = await getFileUpload(entry.cvKey);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = entry.cvFilename ?? "cv.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download CV");
    }
  }, []);

  const handleCoverLetterDownload = useCallback(async (entry: JobBoardEntry) => {
    if (!entry.coverLetterKey) return;
    try {
      const blob = await getFileUpload(entry.coverLetterKey);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = entry.coverLetterFilename ?? "cover-letter.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download cover letter");
    }
  }, []);

  const handleStatusChange = useCallback(
    async (entry: JobBoardEntry, newStatus: JobStatus) => {
      const countInStatus = jobBoardEntries.filter((e) => e.status === newStatus).length;
      const newNumber = countInStatus + 1;
      const updated = { ...entry, status: newStatus, number: newNumber };
      setJobBoardEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? updated : e))
      );
      setSelectedJob((prev) => (prev?.id === entry.id ? updated : prev));
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
        setJobBoardEntries((prev) =>
          prev.map((e) => (e.id === entry.id ? entry : e))
        );
        setSelectedJob((prev) => (prev?.id === entry.id ? entry : prev));
      }
    },
    [jobBoardEntries]
  );

  return (
    <>
      <div className="mx-auto max-w-[1200px] w-full px-6 pt-12 pb-8 flex flex-col min-h-0 flex-1">
        <div className="flex justify-between items-center shrink-0 px-1">
          <div>
            <Title>Sheet</Title>
            <Description className="mt-1">
              View your job applications in a table
            </Description>
          </div>

          <div className="flex items-end">
            <BoardFilters
              jobBoardEntries={jobBoardEntries}
              searchInput={searchInput}
              onSearchChange={handleSearchChange}
              tags={tags}
              onTagToggle={handleTagToggle}
              onClearTags={handleClearTags}
              showRejected={showRejected}
              onToggleRejected={handleToggleRejected}
              showArchived={showArchived}
              onToggleArchived={handleToggleArchived}
              statusFilter={statusFilter}
              onStatusFilterToggle={handleStatusFilterToggle}
              onClearStatusFilter={() => setStatusFilter([])}
            />
          </div>
        </div>

        <SheetTable
          entries={sortedEntries}
          onSelectJob={handleSelectJob}
          onStatusChange={handleStatusChange}
          onCvUpload={handleCvUpload}
          onCoverLetterUpload={handleCoverLetterUpload}
          onCvDownload={handleCvDownload}
          onCoverLetterDownload={handleCoverLetterDownload}
        />

        <AddJobModal
          isOpen={openAddJobModal}
          onClose={() => setOpenAddJobModal(false)}
          onAddJob={onAddJob}
        />

        <button
          onClick={() => setOpenAddJobModal(true)}
          className="cursor-pointer fixed bottom-6 right-6 size-15 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center justify-center"
          aria-label="Add job"
        >
          <PlusIcon className="size-7" />
        </button>
      </div>

      <Sheet open={!!selectedJob} onOpenChange={() => setSelectedJob(undefined)}>
        {selectedJob && (
          <JobEditPanel
            entry={selectedJob}
            allEntries={jobBoardEntries}
            onClose={() => setSelectedJob(undefined)}
            onUpdateJob={onUpdateJob}
          />
        )}
      </Sheet>
    </>
  );
};

export default SheetPage;
