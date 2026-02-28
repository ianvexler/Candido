import { uploadCoverLetterJobBoardEntry } from "@/api/resources/jobBoardEntries/uploadCoverLetterJobBoardEntry";
import { uploadCVJobBoardEntry } from "@/api/resources/jobBoardEntries/uploadCVJobBoardEntry";
import { getFileUpload } from "@/api/resources/uploads/getFileUpload";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/Empty";
import { JobBoardEntry } from "@/lib/types";
import { EllipsisIcon, FileIcon, Loader, PlusIcon, UploadIcon } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface EntryDocCardProps {
  type: "CV" | "Cover Letter";
  entry: JobBoardEntry;
  onUpdateEntry: (entry: JobBoardEntry) => void;
}
const EntryDocCard = ({ type, entry, onUpdateEntry }: EntryDocCardProps) => {
  const initialDocText = type === "CV" ? entry.cvText : entry.coverLetterText;
  const initialDocKey = type === "CV" ? entry.cvKey : entry.coverLetterKey;
  const initialDocDisplayName = type === "CV" ? entry.cvFilename : entry.coverLetterFilename;

  const [docText, setDocText] = useState<string | undefined>(initialDocText);
  const [docFile, setDocFile] = useState<File | undefined>();

  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const fileInput = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!initialDocKey) {
      return;
    }

    setLoadingFile(true);
    getFileUpload(initialDocKey).then((response) => {
      setDocFile(new File([response], initialDocDisplayName ?? (type === "CV" ? "cv.pdf" : "cover-letter.pdf")));
    }).finally(() => {
      setLoadingFile(false);
    });
  }, [initialDocKey, initialDocDisplayName]);

  const handleCreate = () => {
    setDocText('');
    setDocFile(undefined);
  }

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0].type !== "application/pdf") {
      toast.error("Please upload a valid PDF file");
      return;
    }

    setDocText(undefined);
    setDocFile(e.target.files?.[0]);
  }

  const handleSave = async () => {
    setSaving(true);

    try {
      if (type === "CV") {
        const response = await uploadCVJobBoardEntry(entry.id, docText, docFile);
        const updated = response.jobBoardEntry;
        
        onUpdateEntry({
          ...entry,
          cvText: updated.cvText,
          cvKey: updated.cvKey,
          cvFilename: updated.cvFilename,
        });
      } else {
        const response = await uploadCoverLetterJobBoardEntry(entry.id, docText, docFile);
        const updated = response.jobBoardEntry;
        
        onUpdateEntry({
          ...entry,
          coverLetterText: updated.coverLetterText,
          coverLetterKey: updated.coverLetterKey,
          coverLetterFilename: updated.coverLetterFilename,
        });
      }

      toast.success(`Saved ${type} successfully`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to save ${type}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      {(!docText && docText !== '') && (!docFile) ? (
        <>
          {saving ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader size="md" />
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileIcon className="size-4" />
                </EmptyMedia>

                <EmptyTitle>No {type} Found</EmptyTitle>
                <EmptyDescription>
                  Please create or upload one to get started.
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent className="flex-row justify-center gap-3">
                <Button className="gap-1" onClick={handleCreate}>
                  Create
                  <PlusIcon className="size-4" />
                </Button>

                <Button 
                  variant="outline" 
                  className="gap-1" 
                  onClick={() => fileInput.current?.click()}
                >
                  Import
                  <UploadIcon className="size-4" />
                </Button>
                <input type="file" ref={fileInput} className="hidden" onChange={handleUpload} />
              </EmptyContent>
            </Empty>
          )}
        </>
      ) : (
        <div className="px-5">
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-1">
                  <EllipsisIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <UploadIcon className="size-4" />
                    Upload a {docFile ? 'new ' : ''}PDF
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <PlusIcon className="size-4" />
                    Create {docText ? 'a' : 'new'} {type}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {docText && (
            <CardContent>
              <p>{docText}</p>
            </CardContent>
          )}
          {docFile && (
            <CardContent>
              {loadingFile ? (
                <Loader size="md" />
              ) : (
                <p>{docFile.name}</p>
              )}
            </CardContent>
          )}

          <Button onClick={handleSave}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </Card>
  )
}

export default EntryDocCard;