"use client";

import { Dialog } from "radix-ui";
import { useState, useRef } from "react";
import { importJobSheet } from "@/lib/helpers/importJobSheet";
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
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setIsImporting(true);
    try {
      const count = await importJobSheet(file);
      toast.success(`Imported ${count} job${count === 1 ? "" : "s"}`);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-100 bg-black/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-101 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-10 shadow-lg"
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
                onFileChange={handleFileChange}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onImport={handleImport}
                onCancel={handleClose}
                isImporting={isImporting}
              />
            </div>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ImportJobsModal;
