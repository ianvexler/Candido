import { DownloadIcon, FileIcon, TrashIcon, UploadIcon } from "lucide-react";
import { ChangeEvent, RefObject, useId } from "react";
import { cn } from "@/lib/utils";

interface FileAttachmentProps {
  label: string;
  file: File | null;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onDownload: () => void;
  onDelete: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  accept?: string;
  className?: string;
}

const FileAttachment = ({
  className,
  label,
  file,
  onUpload,
  onDownload,
  onDelete,
  fileInputRef,
  accept = "application/pdf",
}: FileAttachmentProps) => {
  const hasFile = !!file;
  const fileInputId = useId();

  const cardClassName = cn(
    "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-border bg-muted/30 hover:bg-muted/50",
    className
  );

  return (
    <div className="w-full">
      <label
        htmlFor={fileInputId}
        className={cardClassName}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <FileIcon className="size-4 text-muted-foreground" />
          </div>
  
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">{label}</p>
            {hasFile ? (
              <p className="truncate text-xs text-muted-foreground">{file.name}</p>
            ) : (
              <p className="text-xs text-muted-foreground">No file attached</p>
            )}
          </div>
        </div>
      
        {hasFile ? (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Download"
            >
              <DownloadIcon className="size-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Delete"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        ) : (
          <UploadIcon className="size-4 shrink-0 text-muted-foreground" />
        )}
      </label>
      <input
        id={fileInputId}
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onUpload}
      />
    </div>
  );
};

export default FileAttachment;
