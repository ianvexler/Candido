"use client";

import { deleteJobBoardEntry } from "@/api/resources/jobBoardEntries/deleteJobBoardEntry";
import { updateJobBoardEntry } from "@/api/resources/jobBoardEntries/updateJobBoardEntry";
import { getJobBoardEntries } from "@/api/resources/jobBoardEntries/getJobBoardEntries";
import Description from "@/components/common/Description";
import Title from "@/components/common/Title";
import AddJobModal from "@/components/jobBoard/AddJobModal";
import JobBoardColumn from "@/components/jobBoard/JobBoardColumn";
import {
  ActionDropZones,
  ACTION_DROPPABLE_IDS,
  ACCEPTED_DROPPABLE_ID,
  DELETE_DROPPABLE_ID,
  ARCHIVE_DROPPABLE_ID,
  REJECTED_DROPPABLE_ID,
} from "@/components/jobBoard/ActionDropZones";
import { JobBoardEntry, JobStatus } from "@/lib/types";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import debounce from "lodash.debounce";
import { PlusIcon, SearchIcon, TagIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Sheet } from "@/components/ui/Sheet";
import EditJobSheet from "@/components/jobBoard/EditJobSheet";
import { FieldLabel } from "@/components/ui/Field";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";

const BoardPage = () => {
  const [jobBoardEntries, setJobBoardEntries] = useState<JobBoardEntry[]>([]);
  const [openAddJobModal, setOpenAddJobModal] = useState(false);

  const [selectedJob, setSelectedJob] = useState<JobBoardEntry>();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFromOffered, setDraggedFromOffered] = useState(false);
  const [draggedEntryOriginalStatus, setDraggedEntryOriginalStatus] = useState<Record<number, JobStatus>>();

  const [showRejected, setShowRejected] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const debouncedSetSearch = useMemo(() =>
    debounce((...args: unknown[]) => {
      setSearch(args[0] as string);
    }, 300),
  []);

  const snapshotRef = useRef<JobBoardEntry[]>([]);
  const latestEntriesRef = useRef<JobBoardEntry[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    void getJobBoardEntries()
      .then((response) => {
        setJobBoardEntries(response.jobBoardEntries);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to get job board entries");
      });
    
    return () => {
      initializedRef.current = false;
    };
  }, [showArchived, showRejected]);

  const showAccepted = useMemo(() => {
    const hasAcceptedEntries = jobBoardEntries.some((e) => e.status === JobStatus.ACCEPTED);
    
    const isDraggingFromAccepted =
      isDragging &&
      draggedEntryOriginalStatus &&
      Object.values(draggedEntryOriginalStatus).includes(JobStatus.ACCEPTED);
    
      return hasAcceptedEntries || isDraggingFromAccepted;
  }, [jobBoardEntries, isDragging, draggedEntryOriginalStatus]);

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

  const handleSelectJob = (job: JobBoardEntry) => {
    scrollPositionRef.current = scrollContainerRef.current?.scrollLeft ?? 0;
    setSelectedJob(job);
  };

  const onUpdateJob = (job: JobBoardEntry) => {
    setJobBoardEntries((prev) => prev.map((entry) => entry.id === job.id ? job : entry));
    setSelectedJob(undefined);
  };

  const handleDeleteDrop = (entry: JobBoardEntry) => {
    void deleteJobBoardEntry(entry.id)
      .then(() => {
        setJobBoardEntries((prev) => prev.filter((e) => e.id !== entry.id));
        toast.success(`Deleted ${entry.title}`);
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Failed to delete ${entry.title}`);
      });
  };

  const handleArchiveDrop = (entry: JobBoardEntry) => {
    const archivedCount = jobBoardEntries.filter((e) => e.status === JobStatus.ARCHIVED).length;
    const newNumber = archivedCount + 1;

    setJobBoardEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, status: JobStatus.ARCHIVED, number: newNumber } : e))
    );
    void handleUpdateEntry(entry, JobStatus.ARCHIVED, newNumber);
  };

  const handleRejectedDrop = (entry: JobBoardEntry) => {
    const rejectedCount = jobBoardEntries.filter((e) => e.status === JobStatus.REJECTED).length;
    const newNumber = rejectedCount + 1;

    setJobBoardEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, status: JobStatus.REJECTED, number: newNumber } : e))
    );
    void handleUpdateEntry(entry, JobStatus.REJECTED, newNumber);
  };

  const handleAcceptedDrop = (entry: JobBoardEntry) => {
    const acceptedCount = jobBoardEntries.filter((e) => e.status === JobStatus.ACCEPTED).length;
    const newNumber = acceptedCount + 1;

    setJobBoardEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, status: JobStatus.ACCEPTED, number: newNumber } : e))
    );
    void handleUpdateEntry(entry, JobStatus.ACCEPTED, newNumber);
  };

  const handleDragStart = (
    event: Parameters<NonNullable<React.ComponentProps<typeof DragDropProvider>["onDragStart"]>>[0]
  ) => {
    setIsDragging(true);
    snapshotRef.current = [...jobBoardEntries];
    const source = event.operation?.source;
    const group = source && "group" in source ? source.group : undefined;

    setDraggedFromOffered(group === JobStatus.OFFERED);
    const originalEntry = snapshotRef.current.find((e) => e.id === source?.id);

    setDraggedEntryOriginalStatus(originalEntry ? { [originalEntry.id]: originalEntry.status } : undefined);
  };

  const handleDragOver = (event: Parameters<NonNullable<React.ComponentProps<typeof DragDropProvider>["onDragOver"]>>[0]) => {
    const { source, target } = event.operation;
    if (source?.type === "column") {
      return;
    }
    if (target?.id && ACTION_DROPPABLE_IDS.includes(target.id as (typeof ACTION_DROPPABLE_IDS)[number])) {
      return;
    }

    setJobBoardEntries((entries) => {
      const grouped = groupEntriesByStatus(entries);
      const movedGrouped = move(grouped, event);
      const result = flattenWithUpdates(movedGrouped);
      latestEntriesRef.current = result;
      return result;
    });
  };

  const handleDragEnd = (event: Parameters<NonNullable<React.ComponentProps<typeof DragDropProvider>["onDragEnd"]>>[0]) => {
    setIsDragging(false);
    setDraggedFromOffered(false);
    setDraggedEntryOriginalStatus(undefined);
  
    if (event.canceled) {
      setJobBoardEntries(snapshotRef.current);
      return;
    }

    const { source, target } = event.operation;
    const entry = snapshotRef.current.find((e) => e.id === source?.id);

    if (target?.id && entry) {
      if (target.id === DELETE_DROPPABLE_ID) {
        handleDeleteDrop(entry);
        return;
      }
      if (target.id === ARCHIVE_DROPPABLE_ID) {
        handleArchiveDrop(entry);
        return;
      }
      if (target.id === REJECTED_DROPPABLE_ID) {
        handleRejectedDrop(entry);
        return;
      }
      if (target.id === ACCEPTED_DROPPABLE_ID) {
        handleAcceptedDrop(entry);
        return;
      }
    }

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
  };

  const handleToggleRejected = () => {
    setShowRejected(!showRejected);
    if (showRejected) {
      setJobBoardEntries((prev) => prev.filter((e) => e.status !== JobStatus.REJECTED));
    }
  };

  const handleToggleArchived = () => {
    setShowArchived(!showArchived);
    if (showArchived) {
      setJobBoardEntries((prev) => prev.filter((e) => e.status !== JobStatus.ARCHIVED));
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    debouncedSetSearch(value);
  };

  const handleTagToggle = (tagName: string, checked: boolean) => {
    setTags((prev) =>
      checked ? [...prev, tagName] : prev.filter((t) => t !== tagName)
    );
  };

  const allTags = useMemo(() => [
    ...new Set(
      jobBoardEntries.flatMap((e) =>
        e.jobBoardTags?.map((t) => t.name) ?? []
      )
    ),
  ].sort(), [jobBoardEntries]);

  const filteredEntries = useMemo(() => {
    let result = jobBoardEntries;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.company.toLowerCase().includes(q)
      );
    }

    if (tags.length > 0) {
      result = result.filter((e) =>
        e.jobBoardTags?.some((t) => tags.includes(t.name))
      );
    }
    return result;
  }, [jobBoardEntries, search, tags]);

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-6 py-8 flex flex-col min-h-0 flex-1">
        <div className="flex justify-between items-center shrink-0 px-1">
          <div>
            <Title>Board</Title>
            <Description className="mt-1">Track your job applications</Description>
          </div>

          <div className="flex items-end">
            <div className="flex flex-col text-lg">
              <div className="flex items-center gap-1 border-b border-border pb-1 mb-3 px-3">
                <FieldLabel>Filters</FieldLabel>
              </div>

              <div className="flex items-center gap-3 px-3">
                <div className="flex items-center gap-1">
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>
                        <SearchIcon />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput placeholder="Search..." value={searchInput} onChange={handleSearchChange} />
                  </InputGroup>
                </div>
                <div className="flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className={cn(
                          "px-4 flex w-29",
                          tags.length > 0 ? "justify-between" : "justify-center"
                        )}
                        variant="outline"
                      >
                        <div className="flex items-center gap-1">
                          <TagIcon className="size-4" />
                          Tags
                        </div>

                        {tags.length > 0 && (
                          <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded">
                            {tags.length}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="min-w-40">
                      {allTags.length === 0 ? (
                        <div className="px-2 py-3 text-sm text-muted-foreground">
                          No tags yet
                        </div>
                      ) : (
                        <>
                          {allTags.map((tagName) => (
                            <DropdownMenuCheckboxItem
                              key={tagName}
                              checked={tags.includes(tagName)}
                              onCheckedChange={(checked) =>
                                handleTagToggle(tagName, checked === true)
                              }
                              onSelect={(e) => e.preventDefault()}
                            >
                              {tagName}
                            </DropdownMenuCheckboxItem>
                          ))}

                          {tags.length > 0 && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setTags([])}
                                className="text-muted-foreground"
                              >
                                <XIcon className="size-4" />
                                Clear All
                              </DropdownMenuItem>
                            </>
                          )}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 ml-5">
                  <button
                    onClick={handleToggleRejected}
                    className={cn(
                      "cursor-pointer px-3 py-1.5 rounded-full text-sm transition-colors",
                      showRejected 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    Rejected
                  </button>
                  <button
                    onClick={handleToggleArchived}
                    className={cn(
                      "cursor-pointer px-3 py-1.5 rounded-full text-sm transition-colors",
                      showArchived 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    Archived
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DragDropProvider
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden pb-5 mt-8"
          >
            <div className="flex justify-start items-stretch divide-x divide-border [&>div]:px-6 [&>div]:first:pl-0 [&>div]:last:pr-0 px-1">
              {Object.values(JobStatus).map((status: JobStatus) => {
                if (!showRejected && status === JobStatus.REJECTED) return null;
                if (!showArchived && status === JobStatus.ARCHIVED) return null;
                if (!showAccepted && status === JobStatus.ACCEPTED) return null;

                return (
                  <JobBoardColumn
                    key={status}
                    status={status}
                    entries={filteredEntries
                      .filter((e) => e.status === status)
                      .sort((a, b) => a.number - b.number)}
                    onSelectJob={handleSelectJob}
                    draggedEntryOriginalStatus={draggedEntryOriginalStatus}
                  />
                );
              })}
            </div>
          </div>

          {isDragging && <ActionDropZones showAcceptedZone={draggedFromOffered} />}
        </DragDropProvider>

        <AddJobModal 
          isOpen={openAddJobModal} 
          onClose={() => setOpenAddJobModal(false)} 
          onAddJob={onAddJob}
        />

        {!isDragging && (
          <button
            onClick={() => setOpenAddJobModal(true)}
            className="cursor-pointer fixed bottom-6 right-6 size-15 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center justify-center"
            aria-label="Add job"
          >
            <PlusIcon className="size-7" />
          </button>
        )}

      </div>

      <Sheet open={!!selectedJob} onOpenChange={() => setSelectedJob(undefined)}>
        {selectedJob && (
          <EditJobSheet 
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

export default BoardPage;
