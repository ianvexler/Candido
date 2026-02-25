import { JobBoardEntry } from "@/lib/types";
import { DownloadIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { getFileUpload } from "@/api/resources/uploads/getFileUpload";
import toast from "react-hot-toast";
import { uploadCVJobBoardEntry } from "@/api/resources/jobBoardEntries/uploadCVJobBoardEntry";
import { uploadCoverLetterJobBoardEntry } from "@/api/resources/jobBoardEntries/uploadCoverLetterJobBoardEntry";

interface SheetFileInputsProps {
  entry: JobBoardEntry;
}

const SheetFileInputs = ({ entry }: SheetFileInputsProps) => {
  const initialCVFile = entry.cvFilename ?? null;
  const initialCoverLetterFile = entry.coverLetterFilename ?? null;

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const cvFileInput = useRef<HTMLInputElement>(null);
  const coverLetterFileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!initialCVFile) {
      return;
    }

    getFileUpload(initialCVFile).then((response) => {
      setCvFile(new File([response], initialCVFile));
    });
  }, [initialCVFile]);

  useEffect(() => {
    if (!initialCoverLetterFile) {
      return;
    }

    getFileUpload(initialCoverLetterFile).then((response) => {
      setCoverLetterFile(new File([response], initialCoverLetterFile));
    });
  }, [initialCoverLetterFile]);

  const handleCvUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file");
      return;
    }

    try {
      await uploadCVJobBoardEntry(entry.id, undefined, file);
      setCvFile(file);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload CV");
    }
  }

  const handleCoverLetterUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file");
      return;
    }

    try {
      await uploadCoverLetterJobBoardEntry(entry.id, undefined, file);
      setCoverLetterFile(file);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload cover letter");
    }
  }

  const handleDownload = (file: File | null) => {
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

  return (
    <div className="flex gap-2">
      {cvFile ? (
        <Button 
          type="button"
          variant="outline" 
          className="gap-1" 
          onClick={() => handleDownload(cvFile)}
        >
          Download CV
          <DownloadIcon className="size-4" />
        </Button>
      ) : (
        <Button 
          type="button"
          className="gap-1" 
          onClick={() => cvFileInput.current?.click()}
        >
          Upload CV
          <PlusIcon className="size-4" />
        </Button>
      )}

      {coverLetterFile ? (
        <Button
          type="button"
          variant="outline" 
          className="gap-1" 
          onClick={() => handleDownload(coverLetterFile)}
        >
          Download Cover Letter
          <DownloadIcon className="size-4" />
        </Button>
      ) : (
        <Button 
          type="button"
          className="gap-1" 
          onClick={() => coverLetterFileInput.current?.click()}
        >
          Upload Cover Letter
          <PlusIcon className="size-4" />
        </Button>
      )}

      <input type="file" ref={coverLetterFileInput} className="hidden" onChange={handleCoverLetterUpload} />
      <input type="file" ref={cvFileInput} className="hidden" onChange={handleCvUpload} />
    </div>
  );
};

export default SheetFileInputs;