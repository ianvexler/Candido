import { updateJobBoardEntry } from "@/api/resources/jobBoardEntries/updateJobBoardEntry";
import SimpleMenuBar from "@/components/richEditor/simpleEditor/SimpleMenuBar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, Select } from "@/components/ui/select";
import { JobBoardEntry, JobStatus } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, SubmitEvent, useMemo } from "react";
import toast from "react-hot-toast";

interface MainEntryFormProps {
  entry: JobBoardEntry;
  onUpdateEntry: (entry: JobBoardEntry) => void;
}

const MainEntryForm = ({ entry, onUpdateEntry }: MainEntryFormProps) => {
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

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setFormSubmitted(true);
    setLoading(true);

    if (!isFormValid) {
      return;
    }

    try {
      const response = await updateJobBoardEntry(entry.id, title, company, location, salary, url, editor?.getHTML() ?? "", status, entry.number);
      toast.success("Job updated successfully");

      onUpdateEntry(response.jobBoardEntry);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isTitleValid = title.length > 0;
  const isCompanyValid = company.length > 0;
  const isFormValid = isTitleValid && isCompanyValid;

  return (
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
              {editor && (
                <>
                  <SimpleMenuBar editor={editor} />
                  <EditorContent 
                    editor={editor}
                    className="min-h-[100px]"
                  />
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading || !hasUpdatedFields}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
  );
};

export default MainEntryForm;