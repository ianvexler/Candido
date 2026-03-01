import { Dialog } from "radix-ui";
import { Button } from "../ui/Button";
import { useState, useRef } from "react";
import { importJobSheet } from "@/lib/helpers/importJobSheet";
import toast from "react-hot-toast";
import { updateCurrentUser } from "@/api/resources/users/updateCurrentUser";
import ImportJobsForm from "./ImportJobsForm";

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetupModal = ({ isOpen, onClose }: SetupModalProps) => {
  const [stage, setStage] = useState<"intro" | "import">("intro");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = async () => {
    try {
      await updateCurrentUser(true);
    } catch (error) {
      console.error(error);
    }
    onClose();
  };
  
  const handleImportApplications = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      const count = await importJobSheet(file);
      toast.success(`Imported ${count} job${count === 1 ? "" : "s"}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to import job applications");
    }

    handleClose();
  };

  const handleYesSetup = () => {
    setStage("import");
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-100 bg-black/50" />

        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-101 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-10 shadow-lg"
          onPointerDownOutside={handleClose}
          onEscapeKeyDown={handleClose}
        >
          {stage === "intro" ? (
            <>
              <Dialog.Title asChild>
                <h2 className="text-2xl font-semibold text-center mb-4">
                  Welcome to Candido
                </h2>
              </Dialog.Title>

              <Dialog.Description asChild>
                <div className="space-y-4 text-center">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Track your applications, CVs, and cover letters in one place.
                  </p>
                  <p className="text-sm text-muted-foreground/90">
                    Do you have job data in a spreadsheet? Import it to get started quickly.
                  </p>
                </div>
              </Dialog.Description>

              <div className="mt-8 flex justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose}>
                  I&apos;ll do it later
                </Button>
                <Button type="button" variant="default" onClick={handleYesSetup}>
                  Let&apos;s get started
                </Button>
              </div>
            </>
          ) : (
            <>
              <Dialog.Title asChild>
                <h2 className="text-2xl font-semibold">Import your job applications</h2>
              </Dialog.Title>

              <Dialog.Description asChild>
                <div>
                  <ImportJobsForm
                    file={file}
                    fileInputRef={fileInputRef}
                    onFileChange={handleFileChange}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onImport={handleImportApplications}
                    onCancel={handleClose}
                  />
                </div>
              </Dialog.Description>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SetupModal;