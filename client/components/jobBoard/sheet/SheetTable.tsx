"use client";

import { JobBoardEntry, JobStatus, jobStatusColors } from "@/lib/types";
import { format } from "date-fns";
import { UploadIcon, DownloadIcon, ChevronDownIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableColGroup,
  TableCol,
  TableHeaderRow,
  TableEmpty,
} from "@/components/ui/Table";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { capitalize } from "@/lib/utils";

interface SheetTableProps {
  entries: JobBoardEntry[];
  onSelectJob: (job: JobBoardEntry) => void;
  onStatusChange: (entry: JobBoardEntry, newStatus: JobStatus) => void;
  onCvUpload: (entry: JobBoardEntry, file: File) => Promise<void>;
  onCoverLetterUpload: (entry: JobBoardEntry, file: File) => Promise<void>;
  onCvDownload: (entry: JobBoardEntry) => void;
  onCoverLetterDownload: (entry: JobBoardEntry) => void;
}

const SheetTable = ({
  entries,
  onSelectJob,
  onStatusChange,
  onCvUpload,
  onCoverLetterUpload,
  onCvDownload,
  onCoverLetterDownload,
}: SheetTableProps) => {
  const [pendingCvEntryId, setPendingCvEntryId] = useState<number | null>(null);
  const [pendingCoverEntryId, setPendingCoverEntryId] = useState<number | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCvInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const entry = entries.find((x) => x.id === pendingCvEntryId);
    setPendingCvEntryId(null);
    if (!entry) return;
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      e.target.value = "";
      return;
    }
    await onCvUpload(entry, file);
    e.target.value = "";
  };

  const handleCoverInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const entry = entries.find((x) => x.id === pendingCoverEntryId);
    setPendingCoverEntryId(null);
    if (!entry) return;
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      e.target.value = "";
      return;
    }
    await onCoverLetterUpload(entry, file);
    e.target.value = "";
  };

  return (
    <Table
      className="mt-8"
      extra={
        <>
          <input
            ref={cvInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleCvInputChange}
          />
          <input
            ref={coverInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleCoverInputChange}
          />
          {entries.length === 0 && (
            <TableEmpty>No applications match your filters</TableEmpty>
          )}
        </>
      }
    >
        <TableColGroup>
          <TableCol className="w-[2%]" />
          <TableCol className="w-[18%]" />
          <TableCol className="w-[11%]" />
          <TableCol className="w-[11%]" />
          <TableCol className="w-[13%]" />
          <TableCol className="w-[22%]" />
          <TableCol className="w-[15%]" />
          <TableCol className="w-[10%]" />
        </TableColGroup>

        <TableHeader>
          <TableHeaderRow>
            <TableHead variant="compact" aria-label="Status color" />
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Attachments</TableHead>
            <TableHead>Date</TableHead>
          </TableHeaderRow>
        </TableHeader>

        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.id}
              onClick={() => onSelectJob(entry)}
              interactive
            >
              <TableCell className="px-3 py-3 w-10">
                <div
                  className={`shrink-0 w-3 h-3 rounded-sm ${jobStatusColors[entry.status]}`}
                  title={entry.status.toLowerCase()}
                  aria-hidden
                />
              </TableCell>

              <TableCell truncate truncateTitle={entry.title} className="font-medium">
                {entry.title}
              </TableCell>

              <TableCell truncate truncateTitle={entry.company} muted>
                {entry.company}
              </TableCell>

              <TableCell truncate truncateTitle={entry.location || undefined} muted>
                {entry.location || "—"}
              </TableCell>

              <TableCell onClick={(e) => e.stopPropagation()}>
                <Select
                  value={entry.status}
                  onValueChange={(v) => onStatusChange(entry, v as JobStatus)}
                >
                  <SelectTrigger className="h-8 w-full border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {Object.values(JobStatus).map((s) => (
                        <SelectItem key={s} value={s} className="truncate max-w-full">
                          {capitalize(s.toLowerCase())}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell
                truncate
                truncateTitle={entry.jobBoardTags?.length ? entry.jobBoardTags.map((t) => t.name).join(", ") : undefined}
                muted
              >
                {entry.jobBoardTags?.length
                  ? entry.jobBoardTags.map((t) => t.name).join(", ")
                  : "—"}
              </TableCell>

              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-wrap gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="xs" className="h-7 text-xs gap-1">
                        CV
                        <ChevronDownIcon className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="min-w-[120px]">
                      {entry.cvKey ? (
                        <>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onCvDownload(entry)}
                          >
                            <DownloadIcon className="size-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setPendingCvEntryId(entry.id);
                              cvInputRef.current?.click();
                            }}
                          >
                            <UploadIcon className="size-4" />
                            Replace
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setPendingCvEntryId(entry.id);
                            cvInputRef.current?.click();
                          }}
                        >
                          <UploadIcon className="size-4" />
                          Upload
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="xs" className="h-7 text-xs gap-1">
                        Cover
                        <ChevronDownIcon className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[120px]">
                      {entry.coverLetterKey ? (
                        <>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onCoverLetterDownload(entry)}
                          >
                            <DownloadIcon className="size-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setPendingCoverEntryId(entry.id);
                              coverInputRef.current?.click();
                            }}
                          >
                            <UploadIcon className="size-4" />
                            Replace
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setPendingCoverEntryId(entry.id);
                            coverInputRef.current?.click();
                          }}
                        >
                          <UploadIcon className="size-4" />
                          Upload
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>

              <TableCell muted>
                {entry.createdAt
                  ? format(new Date(entry.createdAt), "MMM d, yyyy")
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
    </Table>
  );
};

export default SheetTable;
