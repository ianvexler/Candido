"use client";

import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { ArchiveIcon, StarIcon, Trash2, XCircleIcon } from "lucide-react";

export const DELETE_DROPPABLE_ID = "delete" as const;
export const ARCHIVE_DROPPABLE_ID = "archive" as const;
export const REJECTED_DROPPABLE_ID = "rejected" as const;
export const ACCEPTED_DROPPABLE_ID = "accepted" as const;

export const ACTION_DROPPABLE_IDS = [
  DELETE_DROPPABLE_ID,
  ARCHIVE_DROPPABLE_ID,
  REJECTED_DROPPABLE_ID,
  ACCEPTED_DROPPABLE_ID,
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
  size = "md",
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  size?: "md" | "lg";
}) => {
  const { ref, isDropTarget } = useDroppable({
    id,
    type: id,
    accept: "item",
    collisionPriority: CollisionPriority.High,
  });

  const sizeClasses = size === "lg" ? "size-20" : "size-12";
  const iconClasses = size === "lg" ? "size-10" : "size-6";

  return (
    <button
      ref={ref}
      type="button"
      className={`cursor-default ${sizeClasses} rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all ${
        isDropTarget ? "scale-110 ring-2 ring-primary-foreground/50 ring-offset-2 ring-offset-background" : ""
      }`}
      aria-label={label}
    >
      <Icon className={iconClasses} />
    </button>
  );
};

interface ActionDropZonesProps {
  showAcceptedZone?: boolean;
}

export const ActionDropZones = ({ showAcceptedZone = false }: ActionDropZonesProps) => {
  return (
    <>
      <div className="fixed bottom-6 right-6 z-9999 flex items-center gap-3">
        {ZONES.map((zone) => (
          <ActionDropZone key={zone.id} id={zone.id} icon={zone.icon} label={zone.label} />
        ))}
      </div>

      {showAcceptedZone && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-9999">
          <ActionDropZone
            id={ACCEPTED_DROPPABLE_ID}
            icon={StarIcon}
            label="Mark as accepted (drop here)"
            size="lg"
          />
        </div>
      )}
    </>
  );
};
