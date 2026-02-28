import { XIcon } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import { SheetContent, SheetTitle } from "../ui/Sheet";
import { JobBoardEntry, JobStatus } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import { Button } from "../ui/Button";
import InlineInput from "../ui/InlineInput";
import { FieldLabel } from "../ui/Field";
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, Select } from "../ui/select";
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

  const stateRef = useRef({ title, company, location, salary, url, status, editorHtml });
  stateRef.current = { title, company, location, salary, url, status, editorHtml };

  const performSave = useCallback(async (): Promise<boolean> => {
    const { title: t, company: c, location: loc, salary: sal, url: u, status: s, editorHtml: html } = stateRef.current;

    if (!t.trim() || !c.trim()) {
      toast.error("Title and company are required");
      return false;
    }

    setLoading(true);
    try {
      let newNumber: number;
      if (s === entry.status) {
        newNumber = entry.number;
      } else {
        const entriesInNewStatus = allEntries.filter((e: JobBoardEntry) => e.status === s);
        const maxNumber = entriesInNewStatus.length > 0
          ? Math.max(...entriesInNewStatus.map((e: JobBoardEntry) => e.number))
          : 0;
        newNumber = maxNumber + 1;
      }

      const response = await updateJobBoardEntry(entry.id, t, c, loc, sal, u, html, s, newNumber);
      
      onUpdateJob(response.jobBoardEntry);
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update job");
      return false;
    } finally {
      setLoading(false);
    }
  }, [entry.id, entry.status, entry.number, allEntries, onUpdateJob]);

  const debouncedSave = useMemo(
    () => debounce(() => {
      performSave();
    }, 600),
    [performSave]
  );

  useEffect(() => {
    if (!hasUpdatedFields) return;
    debouncedSave();
    return () => debouncedSave.cancel();
  }, [title, company, location, salary, url, status, editorHtml, hasUpdatedFields, debouncedSave]);

  const handleConfirmation = async () => {
    debouncedSave.cancel();
    const success = await performSave();

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
    debouncedSave.cancel();
    const success = await performSave();

    if (success) {
      setDiscardChangesModalOpen(false);
      onClose();
    }
  }

  const STATUS_COLORS: Record<JobStatus, string> = {
    PENDING: "bg-slate-300",
    APPLIED: "bg-yellow-500",
    ASSESSMENT: "bg-cyan-500",
    INTERVIEW: "bg-indigo-500",
    OFFERED: "bg-emerald-500",
    REJECTED: "bg-red-400",
    ACCEPTED: "bg-green-600",
    ARCHIVED: "bg-black",
  };

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
      className="sm:max-w-2xl p-0 gap-0 flex flex-col border-l border-border"
    >
      <VisuallyHidden.Root>
        <SheetTitle>Edit job: {title || "Untitled"}</SheetTitle>
      </VisuallyHidden.Root>

      <div className="shrink-0 border-b border-border bg-muted/30">
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="min-w-0 flex-1 flex items-center gap-3">
            <div 
              className={`shrink-0 w-5 h-5 rounded-sm ${STATUS_COLORS[status]}`}
              title={capitalize(status.toLowerCase())}
            />
            <InlineInput
              id="title"
              type="text"
              autoComplete="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              placeholder="Job title..."
              className="text-2xl font-semibold tracking-tight bg-transparent border-b-0"
            />
          </div>

          <button
            type="button"
            onClick={handleCancelClick}
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <XIcon className="size-7" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8 overflow-y-auto flex-1 min-h-0 px-6 py-6">
        <section className="space-y-5">
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-5">
              <div className="flex flex-col gap-2">
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Company
                </FieldLabel>

                <InlineInput
                  id="company"
                  type="text"
                  autoComplete="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={loading}
                  placeholder="Company name..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Status
                </FieldLabel>

                <Select value={status} onValueChange={(v) => setStatus(v as JobStatus)} disabled={loading}>
                  <SelectTrigger className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
  
                  <SelectContent position="popper">
                    <SelectGroup>
                      {Object.values(JobStatus).map((s) => (
                        <SelectItem key={s} value={s}>
                          {capitalize(s.toLowerCase())}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Location
                </FieldLabel>

                <InlineInput
                  id="location"
                  type="text"
                  autoComplete="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                  placeholder="e.g. Remote, New York"
                />
              </div>

              <div className="flex flex-col gap-2">
                <FieldLabel className="text-xs font-medium text-muted-foreground">
                  Salary
                </FieldLabel>

                <InlineInput
                  id="salary"
                  type="text"
                  autoComplete="salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  disabled={loading}
                  placeholder="e.g. $120k - $150k"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel className="text-xs font-medium text-muted-foreground">
                URL
              </FieldLabel>

              <InlineInput
                id="url"
                type="text"
                autoComplete="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Attachments
          </h3>
          <SheetFileInputs entry={entry} />
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Description
          </h3>

          <div className="simple-editor-wrapper rounded-lg border border-border bg-background overflow-hidden">
            <SimpleMenuBar editor={editor} />
            <EditorContent editor={editor} className="min-h-[140px]" />
          </div>
        </section>
        
        <div className="flex items-center justify-end gap-3 pt-2">
          {loading && (
            <span className="text-sm text-muted-foreground animate-pulse">Saving...</span>
          )}

          <Button 
            type="button"
            variant="outline"
            onClick={handleViewClick}
          >
            View full entry
          </Button>
        </div>
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