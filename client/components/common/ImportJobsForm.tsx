import { JobStatus } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import FileAttachment from "../jobBoard/FileAttachment";
import { Button } from "../ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from "../ui/Table";
import { ChangeEvent, RefObject } from "react";
import type { BulkImportEntry } from "@/api/resources/jobBoardEntries/bulkImportJobBoardEntries";

interface ImportJobsFormProps {
  file: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  previewEntries: BulkImportEntry[] | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDownload: () => void;
  onDelete: () => void;
  onPreview: () => void;
  onImport: () => void;
  onCancel: () => void;
  isImporting?: boolean;
  isPreviewing?: boolean;
}

const ImportJobsForm = ({
  file,
  fileInputRef,
  previewEntries,
  onFileChange,
  onDownload,
  onDelete,
  onPreview,
  onImport,
  onCancel,
  isImporting = false,
  isPreviewing = false,
}: ImportJobsFormProps) => (
  <div className="flex min-h-0 flex-1 flex-col">
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="space-y-5 mt-4">
        <p className="text-base text-muted-foreground leading-relaxed">
        Upload a spreadsheet (CSV, XLS, or XLSX) with your job data. Tables are detected
        automatically even if they don&apos;t start at the top.
        </p>

        <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Expected format</p>
          <code className="block w-full rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground font-mono">
            Title, Company, Location, Salary, URL, Status
          </code>

          <div className="space-y-2 mt-4">
            <p className="text-sm font-medium text-foreground">Status must be one of:</p>
            <ul className="flex flex-wrap gap-1.5">
              {Object.values(JobStatus).map((status) => (
                <li
                  key={status}
                  className="inline-flex rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {capitalize(status.toLowerCase())}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FileAttachment
        label="Spreadsheet"
        file={file}
        onUpload={onFileChange}
        onDownload={onDownload}
        onDelete={onDelete}
        fileInputRef={fileInputRef}
        accept=".xlsx,.xls,.csv"
        />

        {previewEntries !== null && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Preview — {previewEntries.length} job{previewEntries.length === 1 ? "" : "s"} to import
            </p>

            <div className="max-h-40 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/50">
                <TableHeaderRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                </TableHeaderRow>
              </TableHeader>

              <TableBody>
                {previewEntries.map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell truncate truncateTitle={entry.title}>
                      {entry.title}
                    </TableCell>
                    <TableCell truncate truncateTitle={entry.company}>
                      {entry.company}
                    </TableCell>
                    <TableCell>
                      {capitalize(entry.status.toLowerCase())}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="mt-6 flex shrink-0 justify-end gap-3">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      {previewEntries === null ? (
        <Button
          type="button"
          variant="default"
          disabled={!file || isPreviewing}
          onClick={onPreview}
        >
          {isPreviewing ? "Parsing…" : "Preview"}
        </Button>
      ) : (
        <Button
          type="button"
          variant="default"
          disabled={isImporting || previewEntries.length === 0}
          onClick={onImport}
        >
          {isImporting ? "Importing…" : `Import ${previewEntries.length} job${previewEntries.length === 1 ? "" : "s"}`}
        </Button>
      )}
    </div>
  </div>
);

export default ImportJobsForm;
