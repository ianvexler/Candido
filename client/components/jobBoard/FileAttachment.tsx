import { DownloadIcon, EllipsisIcon, FileIcon, TrashIcon, UploadIcon } from "lucide-react";
import { ChangeEvent, RefObject } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
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

  const cardContent = (
    <>
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
        <EllipsisIcon className="size-4 shrink-0 text-muted-foreground" />
      ) : (
        <UploadIcon className="size-4 shrink-0 text-muted-foreground" />
      )}
    </>
  );

  const cardClassName = cn(
    "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-border bg-muted/30 hover:bg-muted/50",
    className
  );

  if (hasFile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={cardClassName}>
            {cardContent}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-[140px]">
          <DropdownMenuItem className="cursor-pointer" onClick={onDownload}>
            <DownloadIcon className="size-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <UploadIcon className="size-4" />
            Replace
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => onDelete()}>
            <TrashIcon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onUpload}
        />
      </DropdownMenu>
    );
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={cardClassName}
      >
        {cardContent}
      </button>

      <input
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
