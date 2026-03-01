import { JobBoardEntry, JobStatus } from "@/lib/types";
import JobBoardCard from "./JobBoardCard";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from '@dnd-kit/abstract';
import { Card, CardContent } from "../ui/Card";
import { capitalize } from "@/lib/utils";
import { ReactNode } from "react";
import { ClockIcon, BriefcaseIcon, PhoneIcon, XCircleIcon, ArchiveIcon, FileCheckIcon, HandshakeIcon, StarIcon } from "lucide-react";

interface JobBoardColumnProps {
  status: JobStatus;
  entries: JobBoardEntry[];
  onSelectJob: (job: JobBoardEntry) => void;
  draggedEntryOriginalStatus?: Record<number, JobStatus>;
}

const JOB_STATUS_ICON: Record<JobStatus, ReactNode> = {
  PENDING: <ClockIcon className="size-4" />,
  APPLIED: <BriefcaseIcon className="size-4" />,
  ASSESSMENT: <FileCheckIcon className="size-4" />,
  INTERVIEW: <PhoneIcon className="size-4" />,
  OFFERED: <HandshakeIcon className="size-4" />,
  REJECTED: <XCircleIcon className="size-4" />,
  ACCEPTED: <StarIcon className="size-4" />,
  ARCHIVED: <ArchiveIcon className="size-4" />,
}

const JobBoardColumn = ({ status, entries, onSelectJob, draggedEntryOriginalStatus }: JobBoardColumnProps) => {
  const { ref } = useDroppable({
    id: status,
    type: 'column',
    accept: 'item',
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div ref={ref} className="flex flex-col gap-4 min-h-0 shrink-0">
      <Card className="w-[210px] min-w-[210px]">
        <CardContent className="flex justify-between items-center">
          <p className="text-sm font-medium">{capitalize(status.toLowerCase())}</p>

          {JOB_STATUS_ICON[status]}
        </CardContent>
      </Card>

      {entries.map((entry, index) => (
        <div key={entry.id}>
          <JobBoardCard
            entry={entry}
            index={index}
            onSelectJob={onSelectJob}
            displayStatus={draggedEntryOriginalStatus?.[entry.id]}
          />
        </div>
      ))}
    </div>
  );
};

export default JobBoardColumn;
