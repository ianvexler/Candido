import { XIcon } from "lucide-react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/Sheet";
import { JobBoardEntry, JobStatus } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { useState, SubmitEvent, useMemo } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, Select } from "../ui/select";
import { Label } from "../ui/Label";
import { updateJobBoardEntry } from "@/api/resources/jobBoardEntries/updateJobBoardEntry";
import { EditorContent, useEditor } from "@tiptap/react";
import SimpleMenuBar from "../richEditor/simpleEditor/SimpleMenuBar";
import { TextStyleKit } from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { redirect } from "next/navigation";
import ConfirmationModal from "../common/ConfirmationModal";
import SheetFileInputs from "./SheetFileInputs";

interface EditJobSheetProps {
  entry: JobBoardEntry;
  allEntries: JobBoardEntry[];
  onClose: () => void;
  onUpdateJob: (job: JobBoardEntry) => void;
}

const EditJobSheet = ({ entry, allEntries, onClose, onUpdateJob }: EditJobSheetProps) => {
  const [title, setTitle] = useState<string>(entry.title);
  const [company, setCompany] = useState<string>(entry.company);
  const [location, setLocation] = useState<string>(entry.location ?? "");
  const [salary, setSalary] = useState<string>(entry.salary ?? "");
  const [url, setUrl] = useState<string>(entry.url ?? "");
  const [status, setStatus] = useState<JobStatus>(entry.status);
  const description = entry.description ?? "";

  const [editorHtml, setEditorHtml] = useState(description);

  const [loading, setLoading] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
  const [discardChangesModalOpen, setDiscardChangesModalOpen] = useState<boolean>(false);

  const extensions = [TextStyleKit, StarterKit]
  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    content: description,
    onUpdate: ({ editor }) => {
      setEditorHtml(editor.getHTML());
    }
  });

  const hasUpdatedFields = useMemo(() => {
    return title !== entry.title ||
      company !== entry.company ||
      location !== entry.location ||
      salary !== entry.salary ||
      url !== entry.url ||
      status !== entry.status ||
      editorHtml !== description;
  }, [title, entry, company, location, salary, url, status, editorHtml, description]);

  const performSubmit = async (): Promise<boolean> => {
    setFormSubmitted(true);
    setLoading(true);

    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return false;
    }

    try {
      let newNumber: number;
      if (status === entry.status) {
        newNumber = entry.number;
      } else {
        const entriesInNewStatus = allEntries.filter((e: JobBoardEntry) => e.status === status);
        const maxNumber = entriesInNewStatus.length > 0
          ? Math.max(...entriesInNewStatus.map((e: JobBoardEntry) => e.number))
          : 0;
        newNumber = maxNumber + 1;
      }

      const editorDescription = editor?.getHTML() ?? "";
      const response = await updateJobBoardEntry(entry.id, title, company, location, salary, url, editorDescription, status, newNumber);
      
      onUpdateJob(response.jobBoardEntry);
      toast.success("Job updated successfully");
      
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update job");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const success = await performSubmit();
    if (success) {
      onClose();
    }
  };

  const handleConfirmation = async () => {
    const success = await performSubmit();

    if (success) {
      setIsConfirmationModalOpen(false);

      onClose();
      redirect(`/board/${entry.id}`);
    }
  }

  const handleConfirmationClose = () => {
    setIsConfirmationModalOpen(false);
  }

  const handleViewClick = () => {
    if (hasUpdatedFields) {
      setIsConfirmationModalOpen(true);
    } else {
      redirect(`/board/${entry.id}`);
    }
  }

  const handleCancelClick = () => {
    if (hasUpdatedFields) {
      setDiscardChangesModalOpen(true);
    } else {
      onClose();
    }
  }

  const handleDiscardChanges = () => {
    setDiscardChangesModalOpen(false);
    onClose();
  }

  const handleSaveChanges = async () => {
    const success = await performSubmit();

    if (success) {
      onClose();
    }
  }

  const isTitleValid = title.length > 0;
  const isCompanyValid = company.length > 0;
  const isFormValid = isTitleValid && isCompanyValid;

  return (
    <SheetContent 
      showCloseButton={false} 
      onOpenAutoFocus={(e) => e.preventDefault()}
      onInteractOutside={(e) => {
        e.preventDefault();
        handleCancelClick();
      }}
      onEscapeKeyDown={(e) => {
        e.preventDefault();
        handleCancelClick();
      }}
      className="sm:max-w-xl p-5 gap-2"
    >
      <SheetHeader className="flex flex-row justify-between items-center pb-4 border-b border-border">
        <SheetTitle>Edit Job</SheetTitle>

        <div className="cursor-pointer flex flex-col items-center justify-start hover:opacity-50" onClick={handleCancelClick}>
          <XIcon className="size-5" />
        </div>
      </SheetHeader>

      <div className="flex flex-col gap-4 overflow-y-auto flex-1 min-h-0 px-4 pb-4">
        <form onSubmit={onSubmit}>
          <div className="flex flex-row gap-3 mt-4">            
            <div className="flex-10 min-w-0">
              <div className="flex flex-col gap-2">
                <Label>Title*</Label>
                <Input
                  id="title"
                  type="text"
                  autoComplete="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  placeholder="Job title..."
                  className={formSubmitted && !isTitleValid ? "border-red-500" : ""}
                />
                {formSubmitted && !isTitleValid && (
                  <p className="text-sm text-red-500">Title is required</p>
                )}
              </div>
            </div>

            <div className="flex-4 min-w-0">
              <div className="flex flex-col gap-2 w-full">
                <Label>Status*</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as JobStatus)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {Object.values(JobStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {capitalize(status.toLowerCase())}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-3">            
            <div className="flex-2 min-w-0">
              <div className="flex flex-col gap-2 mt-4">
                <Label>Company*</Label>
                <Input
                  id="company"
                  type="text"
                  autoComplete="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={loading}
                  placeholder="Company name..."
                  className={formSubmitted && !isCompanyValid ? "border-red-500" : ""}
                />
                {formSubmitted && !isCompanyValid && (
                  <p className="text-sm text-red-500">Company is required</p>
                )}
              </div>
            </div>
            <div className="flex-2 min-w-0">
              <div className="flex flex-col gap-2 mt-4">
                <Label>Location</Label>
                <Input
                  id="location"
                  type="text"
                  autoComplete="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                  placeholder="Location..."
                />
              </div>
            </div>
            <div className="flex-2 min-w-0">
              <div className="flex flex-col gap-2 mt-4">
                <Label>Salary</Label>
                <Input
                  id="salary"
                  type="text"
                  autoComplete="salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  disabled={loading}
                  placeholder="Salary..."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Label>URL</Label>
            <Input
              id="url"
              type="text"
              autoComplete="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mt-4">
            <SheetFileInputs entry={entry} />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Label>Description</Label>

            <div className="simple-editor-wrapper ">
              <SimpleMenuBar editor={editor} />
              <EditorContent 
                editor={editor}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <div className="flex gap-2">
              <Button 
                className="bg-blue-500 text-white hover:bg-blue-600"
                type="button"
                onClick={handleViewClick}
              >
                View
              </Button>

              <Button type="submit" disabled={loading || !hasUpdatedFields}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirmation}
        title="Confirm"
        description="Your changes will be saved before opening the job entry."
        confirmLabel="Confirm"
      />
  
      <ConfirmationModal
        isOpen={discardChangesModalOpen}
        onConfirm={handleSaveChanges}
        onClose={handleDiscardChanges}
        title="Save or Discard Changes"
        description="Do you want to discard or save your changes?"
        confirmLabel="Save"
        cancelLabel="Discard"
      />
    </SheetContent>
  );
};

export default EditJobSheet;