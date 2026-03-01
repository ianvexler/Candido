import { XIcon } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import { SheetContent, SheetTitle } from "../ui/Sheet";
import { JobBoardEntry, JobStatus, jobStatusColors } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import InlineInput from "../ui/InlineInput";
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, Select } from "../ui/select";
import { createJobBoardEntry } from "@/api/resources/jobBoardEntries/createJobBoardEntry";
import { updateJobBoardEntry } from "@/api/resources/jobBoardEntries/updateJobBoardEntry";
import { EditorContent, useEditor } from "@tiptap/react";
import SimpleMenuBar from "../richEditor/simpleEditor/SimpleMenuBar";
import { TextStyleKit } from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/navigation";
import ConfirmationModal from "../common/ConfirmationModal";
import SheetFileInputs from "./sheet/SheetFileInputs";
import TagsInput from "./TagsInput";
import { Button } from "../ui/Button";

type JobFormSheetProps =
  | {
      mode: "create";
      entry: null;
      allEntries: JobBoardEntry[];
      onClose: () => void;
      onAddJob: (job: JobBoardEntry) => void;
    }
  | {
      mode: "edit";
      entry: JobBoardEntry;
      allEntries: JobBoardEntry[];
      onClose: () => void;
      onUpdateJob: (job: JobBoardEntry) => void;
    };

const defaultValues = {
  title: "",
  company: "",
  location: "",
  salary: "",
  url: "",
  status: JobStatus.PENDING as JobStatus,
  description: "",
  tags: [] as string[],
};

const isEditorContentEmpty = (html: string) =>
  !html || html === "<p></p>" || html === "<p><br></p>" || html.replace(/<[^>]*>/g, "").trim() === "";

const JobFormSheet = (props: JobFormSheetProps) => {
  const router = useRouter();
  const isCreate = props.mode === "create";

  const entry = props.entry;
  const initialTitle = entry?.title ?? defaultValues.title;
  const initialCompany = entry?.company ?? defaultValues.company;
  const initialLocation = entry?.location ?? defaultValues.location;
  const initialSalary = entry?.salary ?? defaultValues.salary;
  const initialUrl = entry?.url ?? defaultValues.url;
  const initialStatus = entry?.status ?? defaultValues.status;
  const initialDescription = entry?.description ?? defaultValues.description;
  const initialTags = entry?.jobBoardTags?.map((t) => t.name) ?? defaultValues.tags;

  const [title, setTitle] = useState<string>(initialTitle);
  const [company, setCompany] = useState<string>(initialCompany);
  const [location, setLocation] = useState<string>(initialLocation);
  const [salary, setSalary] = useState<string>(initialSalary);
  const [url, setUrl] = useState<string>(initialUrl);
  const [status, setStatus] = useState<JobStatus>(initialStatus);
  const [editorHtml, setEditorHtml] = useState(initialDescription);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [loading, setLoading] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
  const [discardChangesModalOpen, setDiscardChangesModalOpen] = useState<boolean>(false);

  const isTitleValid = title.trim().length > 0;
  const isCompanyValid = company.trim().length > 0;

  const extensions = [TextStyleKit, StarterKit];
  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    content: initialDescription,
    onUpdate: ({ editor }) => {
      setEditorHtml(editor.getHTML());
    },
  });

  useEffect(() => {
    if (isCreate) {
      return;
    }

    editor?.commands.setContent(initialDescription);
  }, [isCreate, entry, editor?.commands, initialDescription]);

  const hasUpdatedFields = useMemo(() => {
    if (isCreate) {
      return title.trim() !== "" || company.trim() !== "";
    }

    const entryTagNames = entry!.jobBoardTags?.map((t) => t.name) ?? [];
    const tagsChanged =
      tags.length !== entryTagNames.length ||
      tags.some((t) => !entryTagNames.includes(t)) ||
      entryTagNames.some((t) => !tags.includes(t));

    return (
      title !== entry!.title ||
      company !== entry!.company ||
      location !== (entry!.location ?? "") ||
      salary !== (entry!.salary ?? "") ||
      url !== (entry!.url ?? "") ||
      status !== entry!.status ||
      editorHtml !== initialDescription ||
      tagsChanged
    );
  }, [isCreate, entry, title, company, location, salary, url, status, editorHtml, initialDescription, tags]);

  const stateRef = useRef({ title, company, location, salary, url, status, editorHtml, tags });
  stateRef.current = { title, company, location, salary, url, status, editorHtml, tags };

  const performCreate = useCallback(async (): Promise<boolean> => {
    const { title: t, company: c, location: loc, salary: sal, url: u, status: s, editorHtml: html } =
      stateRef.current;

    if (!t.trim() || !c.trim()) {
      setFormSubmitted(true);
      return false;
    }

    setLoading(true);
    try {
      const response = await createJobBoardEntry(t, c, loc, sal, u, s, html);
      if (props.mode === "create") {
        props.onAddJob(response.jobBoardEntry);
      }
      
      toast.success("Job added successfully");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to add job");

      return false;
    } finally {
      setLoading(false);
    }
  }, [props]);

  const performUpdate = useCallback(async (): Promise<boolean> => {
    if (isCreate || !entry) return false;
    const { title: title, company: company, location: location, salary: salary, url: url, status: status, editorHtml: editorHtml, tags: tags } =
      stateRef.current;

    if (!title.trim() || !company.trim()) {
      setFormSubmitted(true);
      return false;
    }

    setLoading(true);
    try {
      let newNumber: number = entry.number;
      if (status === entry.status) {
        newNumber = entry.number;
      } else {
        const entriesInNewStatus = props.allEntries.filter((e: JobBoardEntry) => e.status === status);
        const maxNumber =
          entriesInNewStatus.length > 0
            ? Math.max(...entriesInNewStatus.map((e: JobBoardEntry) => e.number))
            : 0;
        newNumber = maxNumber + 1;
      }

      const response = await updateJobBoardEntry(
        entry.id,
        title,
        company,
        location,
        salary,
        url,
        editorHtml,
        status,
        newNumber,
        tags
      );

      props.onUpdateJob(response.jobBoardEntry);
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update job");
      return false;
    } finally {
      setLoading(false);
    }
  }, [isCreate, entry, props]);

  const performSave = isCreate ? performCreate : performUpdate;

  const debouncedSave = useMemo(
    () =>
      debounce(() => {
        if (!isCreate) performSave();
      }, 600),
    [performSave, isCreate]
  );

  useEffect(() => {
    if (isCreate || !hasUpdatedFields) {
      return;
    }

    debouncedSave();

    return () => {
      debouncedSave.cancel();
    };
  }, [isCreate, title, company, location, salary, url, status, editorHtml, tags, hasUpdatedFields, debouncedSave]);

  const handleConfirmation = async () => {
    if (isCreate) {
      return;
    }

    debouncedSave.cancel();
    const success = await performSave();

    if (success) {
      setIsConfirmationModalOpen(false);
      props.onClose();
      router.push(`/board/${entry!.id}`);
    }
  };

  const handleConfirmationClose = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleViewClick = () => {
    if (isCreate) {
      return;
    }

    if (hasUpdatedFields) {
      setIsConfirmationModalOpen(true);
    } else {
      router.push(`/board/${entry!.id}`);
    }
  };

  const isCreateFormEqualToDefaults =
    title.trim() === defaultValues.title &&
    company.trim() === defaultValues.company &&
    location.trim() === defaultValues.location &&
    salary.trim() === defaultValues.salary &&
    url.trim() === defaultValues.url &&
    status === defaultValues.status &&
    isEditorContentEmpty(editorHtml);

  const handleCancelClick = () => {
    if (isCreate) {
      if (!isCreateFormEqualToDefaults) {
        setDiscardChangesModalOpen(true);
      } else {
        props.onClose();
      }

    } else if (hasUpdatedFields) {
      setDiscardChangesModalOpen(true);
    } else {
      props.onClose();
    }
  };

  const handleDiscardChanges = () => {
    setDiscardChangesModalOpen(false);
    props.onClose();
  };

  const handleSaveChanges = async () => {
    debouncedSave.cancel();
    const success = await performSave();

    if (success) {
      setDiscardChangesModalOpen(false);
      props.onClose();
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const success = await performCreate();
    if (success) props.onClose();
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
        <SheetTitle>{isCreate ? "Create job" : `Edit job: ${title || "Untitled"}`}</SheetTitle>
      </VisuallyHidden.Root>

      <div className="shrink-0 border-b border-border bg-muted/30">
        <div className="flex items-start justify-between gap-4 px-6 py-5">
          <div className="min-w-0 flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-3 pt-1">
              <div
                className={`shrink-0 w-5 h-5 rounded-sm ${jobStatusColors[status]}`}
                title={status.toLowerCase()}
              />

              <InlineInput
                id="title"
                type="text"
                autoComplete="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                placeholder="Job title..."
                className={`text-2xl font-semibold tracking-tight bg-transparent border-b-0 ${formSubmitted && !isTitleValid ? "border-b-2! border-red-500!" : ""}`}
              />
            </div>
            {formSubmitted && !isTitleValid && (
              <p className="text-xs text-red-500 ml-8">Title is required</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleCancelClick}
            className="cursor-pointer shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <XIcon className="size-5" />
          </button>
        </div>
      </div>

      <form
        onSubmit={handleCreateSubmit}
        className="flex flex-col gap-6 overflow-y-auto flex-1 min-h-0 px-6 py-6"
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Company
              </h3>

              <div className="flex flex-col gap-1">
                <InlineInput
                  id="company"
                  type="text"
                  autoComplete="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={loading}
                  placeholder="Company name..."
                  className={formSubmitted && !isCompanyValid ? "border-red-500!" : ""}
                />
                {formSubmitted && !isCompanyValid && (
                  <p className="text-xs text-red-500">Company is required</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </h3>

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
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Location
              </h3>

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
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Salary
              </h3>

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
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              URL
            </h3>

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

        {!isCreate && entry && (
          <>
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Attachments
              </h3>

              <SheetFileInputs entry={entry} />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tags
              </h3>

              <TagsInput
                allEntries={props.allEntries}
                tags={tags}
                onTagsChange={setTags}
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Description
          </h3>

          <div className="simple-editor-wrapper rounded-lg border border-border bg-background overflow-hidden">
            <SimpleMenuBar editor={editor} />
            <EditorContent editor={editor} className="min-h-[140px]" />
          </div>
        </div>

        <div className="flex justify-end">
          {isCreate ? (
            <Button type="submit" disabled={loading} className="w-fit">
              {loading ? "Creating..." : "Create"}
            </Button>
          ) : (
            <div className="hidden">
              <Button type="button" variant="outline" onClick={handleViewClick}>
                View full entry
              </Button>
            </div>
          )}
        </div>
      </form>

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
        title={isCreate ? "Discard new job?" : "Save or Discard Changes"}
        description={
          isCreate
            ? "Do you want to discard or add this job?"
            : "Do you want to discard or save your changes?"
        }
        confirmLabel={isCreate ? "Create" : "Update"}
        cancelLabel="Discard"
      />
    </SheetContent>
  );
};

export default JobFormSheet;
