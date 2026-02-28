import { JobBoardEntry, JobStatus, jobStatusColors } from "@/lib/types";
import { Card, CardContent } from "../ui/Card";
import { useSortable } from "@dnd-kit/react/sortable";
import { useDragOperation } from "@dnd-kit/react";
import { format } from "date-fns";
import { CalendarIcon, GlobeIcon, TagIcon } from "lucide-react";
import { ACTION_DROPPABLE_IDS } from "./ActionDropZones";

interface JobBoardCardProps {
  entry: JobBoardEntry;
  index: number;
  onSelectJob: (job: JobBoardEntry) => void;
  displayStatus?: JobStatus;
}

const JobBoardCard = ({ entry, index, onSelectJob, displayStatus }: JobBoardCardProps) => {
  const { ref, isDragging } = useSortable({
    id: entry.id,
    index,
    type: "item",
    accept: "item",
    group: entry.status,
  });
  const { target } = useDragOperation();
  const isOverActionZone = isDragging && target?.id && ACTION_DROPPABLE_IDS.includes(target.id as (typeof ACTION_DROPPABLE_IDS)[number]);

  return (
    <Card
      ref={ref}
      data-dragging={isDragging}
      className={`cursor-grab active:cursor-grabbing hover:bg-accent active:bg-accent w-[210px] transition-all ${
        isOverActionZone ? "opacity-90 brightness-90" : ""
      }`}
      onClick={() => onSelectJob(entry)}
    >
      <CardContent className="px-0">
        <div className="relative">
          <div className={`absolute -left-[2px] top-0 bottom-0 w-[3px] ${jobStatusColors[displayStatus ?? entry.status]} rounded`} aria-hidden />
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

          <div className="border-t border-border pt-3 mt-4 flex justify-between items-center gap-2">
            {(entry.location || entry.createdAt) && (
              <>
                <div className="flex items-center gap-1 min-w-0 max-w-[50%]">
                  {entry.location && (
                    <>
                      <GlobeIcon className="size-4 shrink-0" strokeWidth={1} />
                      <p className="truncate">{entry.location}</p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {entry.createdAt && (
                    <>
                      <CalendarIcon className="size-4" strokeWidth={1} />
                      <p>{format(new Date(entry.createdAt), "MMM d, yyyy")}</p>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobBoardCard;