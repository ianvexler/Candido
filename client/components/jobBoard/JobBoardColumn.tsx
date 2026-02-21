import { JobBoardEntry, JobStatus } from "@/lib/types";
import JobBoardCard from "./JobBoardCard";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from '@dnd-kit/abstract';

interface JobBoardColumnProps {
  status: JobStatus;
  entries: JobBoardEntry[];
  onSelectJob: (job: JobBoardEntry) => void;
}

const JobBoardColumn = ({ status, entries, onSelectJob }: JobBoardColumnProps) => {
  const { ref } = useDroppable({
    id: status,
    type: 'column',
    accept: 'item',
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div ref={ref} className="flex flex-col gap-4 flex-[0_0_300px] min-h-0">
      <h2 className="font-bold">{status}</h2>

      {entries.map((entry, index) => (
        <div key={entry.id}>
          <JobBoardCard entry={entry} index={index} onSelectJob={onSelectJob} />
        </div>
      ))}
    </div>
  );
};

export default JobBoardColumn;