import { JobStatus } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import FileAttachment from "../jobBoard/FileAttachment";
import { Button } from "../ui/Button";
import { ChangeEvent, RefObject } from "react";

interface ImportJobsFormProps {
  file: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDownload: () => void;
  onDelete: () => void;
  onImport: () => void;
  onCancel: () => void;
  isImporting?: boolean;
}

const ImportJobsForm = ({
  file,
  fileInputRef,
  onFileChange,
  onDownload,
  onDelete,
  onImport,
  onCancel,
  isImporting = false,
}: ImportJobsFormProps) => (
  <>
    <div className="space-y-5 mt-4">
      <p className="text-base text-muted-foreground leading-relaxed">
        Upload a spreadsheet (CSV, XLS, or XLSX) with your job data.
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
    </div>

    <div className="mt-8 flex justify-end gap-3">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        type="button"
        variant="default"
        disabled={!file || isImporting}
        onClick={onImport}
      >
        {isImporting ? "Importing…" : "Import"}
      </Button>
    </div>
  </>
);

export default ImportJobsForm;
