import { useEffect, SubmitEvent, useState } from "react";
import Modal from "react-modal";
import Title from "../common/Title";
import Description from "../common/Description";
import { XIcon } from "lucide-react";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { JobBoardEntry, JobStatus } from "@/lib/types";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { capitalize } from "@/lib/utils";
import { createJobBoardEntry } from "@/api/resources/jobBoardEntries/createJobBoardEntry";
import toast from "react-hot-toast";

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: JobBoardEntry) => void;
}

const AddJobModal = ({isOpen, onClose, onAddJob}: AddJobModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [status, setStatus] = useState<JobStatus>(JobStatus.PENDING);
  const [description] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);

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
      const response = await createJobBoardEntry(title, company, location, salary, url, status, description);
      console.log(response);
      onAddJob(response.jobBoardEntry);

      toast.success("Job added successfully");
      onClose();
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        content: {
          position: "relative",
          margin: 0,
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        },
      }}
      className="bg-background w-full xl:w-2/3 max-w-2xl"
    >
      <div className="p-8">
        <div className="flex flex-row items-center justify-between">
          <div>
            <Title>Add Job</Title>
            <Description>Add a new job to your job board</Description>
          </div>
          
          <div className="cursor-pointer flex flex-col items-center justify-start hover:opacity-50" onClick={onClose}>
            <XIcon className="size-6" />
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="flex flex-row gap-3 mt-4">            
            <div className="flex-3 min-w-0">
              <div className="flex flex-col gap-1">
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

            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-1 w-full">
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
              <div className="flex flex-col gap-1 mt-4">
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
              <div className="flex flex-col gap-1 mt-4">
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
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-1 mt-4">
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

          <div className="flex flex-col gap-1 mt-4">
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

          <Button type="submit" disabled={loading} className="mt-4">
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default AddJobModal;