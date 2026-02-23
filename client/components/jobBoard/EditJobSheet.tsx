import { XIcon } from "lucide-react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { JobBoardEntry, JobStatus } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { useState, SubmitEvent } from "react";
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
  const [description] = useState<string>(entry.description ?? "");

  const [loading, setLoading] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const extensions = [TextStyleKit, StarterKit]
  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    content: description,
  });

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setLoading(true);

    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
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
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const isTitleValid = title.length > 0;
  const isCompanyValid = company.length > 0;
  const isFormValid = isTitleValid && isCompanyValid;

  return (
    <SheetContent 
      showCloseButton={false} 
      onOpenAutoFocus={(e) => e.preventDefault()} 
      className="sm:max-w-xl p-5 gap-2"
    >
      <SheetHeader className="flex flex-row justify-between items-center pb-4 border-b border-border">
        <SheetTitle>Edit Job</SheetTitle>

        <div className="cursor-pointer flex flex-col items-center justify-start hover:opacity-50" onClick={onClose}>
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

          <div className="mt-4 flex flex-col gap-2">
            <Label>Description</Label>

            <div className="simple-editor-wrapper ">
              <SimpleMenuBar editor={editor} />
              <EditorContent 
                editor={editor} 
                
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </SheetContent>
  );
};

export default EditJobSheet;