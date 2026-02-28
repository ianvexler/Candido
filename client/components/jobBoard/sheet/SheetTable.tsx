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
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
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
    <div className="mt-8 overflow-x-auto border border-border rounded-lg">
      <table className="w-full min-w-[900px] text-sm table-fixed">
        <colgroup>
          <col className="w-[2%]" />
          <col className="w-[18%]" />
          <col className="w-[11%]" />
          <col className="w-[11%]" />
          <col className="w-[13%]" />
          <col className="w-[22%]" />
          <col className="w-[15%]" />
          <col className="w-[10%]" />
        </colgroup>

        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left px-3 py-3 font-medium" aria-label="Status color" />
            <th className="text-left px-4 py-3 font-medium">Title</th>
            <th className="text-left px-4 py-3 font-medium">Company</th>
            <th className="text-left px-4 py-3 font-medium">Location</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Tags</th>
            <th className="text-left px-4 py-3 font-medium">Attachments</th>
            <th className="text-left px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              onClick={() => onSelectJob(entry)}
              className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
            >
              <td className="px-3 py-3 w-10">
                <div
                  className={`shrink-0 w-3 h-3 rounded-sm ${jobStatusColors[entry.status]}`}
                  title={entry.status.toLowerCase()}
                  aria-hidden
                />
              </td>

              <td className="px-4 py-3 font-medium min-w-0">
                <span className="block truncate" title={entry.title}>
                  {entry.title}
                </span>
              </td>

              <td className="px-4 py-3 text-muted-foreground min-w-0">
                <span className="block truncate" title={entry.company}>
                  {entry.company}
                </span>
              </td>

              <td className="px-4 py-3 text-muted-foreground min-w-0">
                <span className="block truncate" title={entry.location || undefined}>
                  {entry.location || "—"}
                </span>
              </td>

              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
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
              </td>

              <td className="px-4 py-3 text-muted-foreground min-w-0">
                <span className="block truncate" title={entry.jobBoardTags?.length ? entry.jobBoardTags.map((t) => t.name).join(", ") : undefined}>
                  {entry.jobBoardTags?.length
                    ? entry.jobBoardTags.map((t) => t.name).join(", ")
                    : "—"}
                </span>
              </td>

              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-wrap gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="xs" className="h-7 text-xs gap-1">
                        {entry.cvFilename || entry.cvOriginalFilename ? "CV" : "CV"}
                        <ChevronDownIcon className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="min-w-[120px]">
                      {(entry.cvFilename || entry.cvOriginalFilename) ? (
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
                        {entry.coverLetterFilename || entry.coverLetterOriginalFilename ? "Cover" : "Cover"}
                        <ChevronDownIcon className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[120px]">
                      {(entry.coverLetterFilename || entry.coverLetterOriginalFilename) ? (
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
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {entry.createdAt
                  ? format(new Date(entry.createdAt), "MMM d, yyyy")
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <div className="py-12 text-center text-muted-foreground text-sm">
          No applications match your filters
        </div>
      )}
    </div>
  );
};

export default SheetTable;
