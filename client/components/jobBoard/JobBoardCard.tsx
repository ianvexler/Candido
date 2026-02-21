import { JobBoardEntry } from "@/lib/types";
import { Card, CardContent } from "../ui/Card";
import { useSortable } from "@dnd-kit/react/sortable";

interface JobBoardCardProps {
  entry: JobBoardEntry;
  index: number;
}

const JobBoardCard = ({ entry, index }: JobBoardCardProps) => {
  const {ref, isDragging} = useSortable({
    id: entry.id,
    index,
    type: "item",
    accept: "item",
    group: entry.status,
  });

  return (
    <Card ref={ref} data-dragging={isDragging} className="cursor-grab active:cursor-grabbing hover:bg-accent active:bg-accent">
      <CardContent>
        <h3 className="text-lg font-bold">{entry.title}</h3>
        <p className="text-sm text-gray-500">{entry.company}</p>
      </CardContent>
    </Card>
  );
};

export default JobBoardCard;