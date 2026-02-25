import { JobBoardEntry, JobStatus } from "@/lib/types";
import { Card, CardContent } from "../ui/Card";
import { useSortable } from "@dnd-kit/react/sortable";
import { format } from "date-fns";
import { CalendarIcon, GlobeIcon, TagIcon } from "lucide-react";

interface JobBoardCardProps {
  entry: JobBoardEntry;
  index: number;
  onSelectJob: (job: JobBoardEntry) => void;
}

const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  PENDING: "bg-slate-300",
  APPLIED: "bg-yellow-500",
  ASSESSMENT: "bg-cyan-500",
  INTERVIEW: "bg-indigo-500",
  OFFERED: "bg-emerald-500",
  REJECTED: "bg-red-400",
  ACCEPTED: "bg-green-500",
  ARCHIVED: "bg-black",
}

const JobBoardCard = ({ entry, index, onSelectJob }: JobBoardCardProps) => {
  const { ref, isDragging } = useSortable({
    id: entry.id,
    index,
    type: "item",
    accept: "item",
    group: entry.status,
  });

  return (
    <Card
      ref={ref}
      data-dragging={isDragging}
      className="cursor-grab active:cursor-grabbing hover:bg-accent active:bg-accent w-[210px]"
      onClick={() => onSelectJob(entry)}
    >
      <CardContent className="px-0">
        <div className="relative">
          <div className={`absolute -left-[2px] top-0 bottom-0 w-[3px] ${JOB_STATUS_COLORS[entry.status]} rounded`} aria-hidden />
          <div className="px-4">
            <p className="text-sm font-medium">{entry.title}</p>
            <p className="text-xs text-gray-500">{entry.company}</p>
          </div>
        </div>

        <div className="px-4 text-xs mt-4">
          {entry.jobBoardTags?.length > 0 && (
            <div className="flex items-center gap-1 my-2">
              <TagIcon className="size-4" strokeWidth={1} />
              <p>{entry.jobBoardTags.map((tag) => tag.name).join(", ")}</p>
            </div>
          )}

          {/* {entry.jobBoardTags?.length > 0 && (
            <div className="flex items-center gap-1 overflow-hidden">
              {entry.jobBoardTags.map((tag) => (
                <Badge key={tag.id} className="text-2xs" variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )} */}

          <div className="border-t border-border pt-3 mt-4 flex justify-between items-center">
            {entry.location && (
              <div className="flex items-center gap-1">
                <GlobeIcon className="size-4" strokeWidth={1} />
                <p>{entry.location}</p>
              </div>
            )}

            {entry.createdAt && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4" strokeWidth={1} />
                <p>{format(new Date(entry.createdAt), "MMM d, yyyy")}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobBoardCard;