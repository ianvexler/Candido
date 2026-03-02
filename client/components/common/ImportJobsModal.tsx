"use client";

import { Dialog } from "radix-ui";
import { useState, useRef } from "react";
import { parseJobSheet } from "@/lib/helpers/importJobSheet";
import { bulkImportJobBoardEntries } from "@/api/resources/jobBoardEntries/bulkImportJobBoardEntries";
import ImportJobsForm from "./ImportJobsForm";
import toast from "react-hot-toast";
import { useJobsRefresh } from "@/contexts/JobsRefreshContext";

interface ImportJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportJobsModal = ({ isOpen, onClose }: ImportJobsModalProps) => {
  const { refresh } = useJobsRefresh();
  const [file, setFile] = useState<File | null>(null);
  const [previewEntries, setPreviewEntries] = useState<Awaited<ReturnType<typeof parseJobSheet>> | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePreview = async () => {
    if (!file) {
      return;
    }
    setIsPreviewing(true);
    setPreviewEntries(null);

    try {
      const entries = await parseJobSheet(file);
      setPreviewEntries(entries);

      if (entries.length === 0) {
        toast.error("No valid job entries found in spreadsheet");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to parse spreadsheet");
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleImport = async () => {
    if (!previewEntries || previewEntries.length === 0) return;

    setIsImporting(true);
    try {
      await bulkImportJobBoardEntries(previewEntries);
      toast.success(`Imported ${previewEntries.length} job${previewEntries.length === 1 ? "" : "s"}`);

      refresh();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to import job applications");
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewEntries(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewEntries(null);
    }
  };

  const handleDownload = () => {
    if (!file) {
      return;
    }
  
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    setFile(null);
    setPreviewEntries(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-100 bg-black/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-101 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-10 shadow-lg"
          onPointerDownOutside={handleClose}
          onEscapeKeyDown={handleClose}
        >
          <Dialog.Title asChild>
            <h2 className="text-2xl font-semibold">Import job applications</h2>
          </Dialog.Title>

          <Dialog.Description asChild>
            <div>
              <ImportJobsForm
                file={file}
                fileInputRef={fileInputRef}
                previewEntries={previewEntries}
                onFileChange={handleFileChange}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onPreview={handlePreview}
                onImport={handleImport}
                onCancel={handleClose}
                isImporting={isImporting}
                isPreviewing={isPreviewing}
              />
            </div>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ImportJobsModal;
