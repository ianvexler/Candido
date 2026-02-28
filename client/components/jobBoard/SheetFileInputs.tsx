import { JobBoardEntry } from "@/lib/types";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { getFileUpload } from "@/api/resources/uploads/getFileUpload";
import toast from "react-hot-toast";
import { uploadCVJobBoardEntry } from "@/api/resources/jobBoardEntries/uploadCVJobBoardEntry";
import { uploadCoverLetterJobBoardEntry } from "@/api/resources/jobBoardEntries/uploadCoverLetterJobBoardEntry";
import FileAttachment from "./FileAttachment";

interface SheetFileInputsProps {
  entry: JobBoardEntry;
}

const SheetFileInputs = ({ entry }: SheetFileInputsProps) => {
  const initialCVFilename = entry.cvFilename ?? null;
  const initialCVDisplayName = entry.cvOriginalFilename ?? entry.cvFilename ?? null;
  const initialCoverLetterFilename = entry.coverLetterFilename ?? null;
  const initialCoverLetterDisplayName = entry.coverLetterOriginalFilename ?? entry.coverLetterFilename ?? null;

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const cvFileInput = useRef<HTMLInputElement>(null);
  const coverLetterFileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!initialCVFilename) {
      return;
    }

    getFileUpload(initialCVFilename).then((response) => {
      setCvFile(new File([response], initialCVDisplayName ?? initialCVFilename));
    });
  }, [initialCVFilename, initialCVDisplayName]);

  useEffect(() => {
    if (!initialCoverLetterFilename) {
      return;
    }

    getFileUpload(initialCoverLetterFilename).then((response) => {
      setCoverLetterFile(new File([response], initialCoverLetterDisplayName ?? initialCoverLetterFilename));
    });
  }, [initialCoverLetterFilename, initialCoverLetterDisplayName]);

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

    e.target.value = "";
  };

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
    e.target.value = "";
  };

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

  const handleDelete = async (file: File | null) => {
    if (!file) {
      return;
    }

    setCvFile(null);
    setCoverLetterFile(null);

    try {
      await uploadCoverLetterJobBoardEntry(entry.id, undefined, undefined);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete file");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <FileAttachment
        label="CV"
        file={cvFile}
        onUpload={handleCvUpload}
        onDownload={() => handleDownload(cvFile)}
        onDelete={() => handleDelete(cvFile)}
        fileInputRef={cvFileInput}
      />
      <FileAttachment
        label="Cover Letter"
        file={coverLetterFile}
        onUpload={handleCoverLetterUpload}
        onDownload={() => handleDownload(coverLetterFile)}
        onDelete={() => handleDelete(coverLetterFile)}
        fileInputRef={coverLetterFileInput}
      />
    </div>
  );
};

export default SheetFileInputs;