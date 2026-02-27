"use client";

import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { ArchiveIcon, Trash2, XCircleIcon } from "lucide-react";

export const DELETE_DROPPABLE_ID = "delete" as const;
export const ARCHIVE_DROPPABLE_ID = "archive" as const;
export const REJECTED_DROPPABLE_ID = "rejected" as const;

export const ACTION_DROPPABLE_IDS = [
  DELETE_DROPPABLE_ID,
  ARCHIVE_DROPPABLE_ID,
  REJECTED_DROPPABLE_ID,
] as const;

const ZONES = [
  { id: DELETE_DROPPABLE_ID, icon: Trash2, label: "Delete job (drop here)" },
  { id: ARCHIVE_DROPPABLE_ID, icon: ArchiveIcon, label: "Archive job (drop here)" },
  { id: REJECTED_DROPPABLE_ID, icon: XCircleIcon, label: "Mark as rejected (drop here)" },
] as const;

const ActionDropZone = ({
  id,
  icon: Icon,
  label,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) => {
  const { ref, isDropTarget } = useDroppable({
    id,
    type: id,
    accept: "item",
    collisionPriority: CollisionPriority.High,
  });

  return (
    <button
      ref={ref}
      type="button"
      className={`cursor-default size-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all ${
        isDropTarget ? "scale-110 ring-2 ring-primary-foreground/50 ring-offset-2 ring-offset-background" : ""
      }`}
      aria-label={label}
    >
      <Icon className="size-6" />
    </button>
  );
};

export const ActionDropZones = () => {
  return (
    <div className="fixed bottom-6 right-6 z-9999 flex items-center gap-3">
      {ZONES.map((zone) => (
        <ActionDropZone key={zone.id} id={zone.id} icon={zone.icon} label={zone.label} />
      ))}
    </div>
  );
};
