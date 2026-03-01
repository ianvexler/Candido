"use client";

import { JobBoardEntry, JobStatus } from "@/lib/types";
import { useMemo } from "react";
import { SearchIcon, TagIcon, XIcon, FilterIcon } from "lucide-react";
import { FieldLabel } from "@/components/ui/Field";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { capitalize, cn } from "@/lib/utils";

interface BoardFiltersProps {
  jobBoardEntries: JobBoardEntry[];
  searchInput: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tags: string[];
  onTagToggle: (tagName: string, checked: boolean) => void;
  onClearTags: () => void;
  showRejected: boolean;
  onToggleRejected: () => void;
  showArchived: boolean;
  onToggleArchived: () => void;

  statusFilter?: JobStatus[];
  onStatusFilterToggle?: (status: JobStatus, checked: boolean) => void;
  onClearStatusFilter?: () => void;
}

const BoardFilters = ({
  jobBoardEntries,
  searchInput,
  onSearchChange,
  tags,
  onTagToggle,
  onClearTags,
  showRejected,
  onToggleRejected,
  showArchived,
  onToggleArchived,
  statusFilter,
  onStatusFilterToggle,
  onClearStatusFilter,
}: BoardFiltersProps) => {
  const showStatusFilter = statusFilter !== undefined && onStatusFilterToggle !== undefined && onClearStatusFilter !== undefined;
  const allTags = useMemo(() => [
    ...new Set(
      jobBoardEntries.flatMap((e) =>
        e.jobBoardTags?.map((t) => t.name) ?? []
      )
    ),
  ].sort(), [jobBoardEntries]);

  return (
    <div className="flex flex-col text-lg min-w-0 w-full">
      <div className="flex items-center gap-1 border-b border-border pb-1 mb-3 px-3">
        <FieldLabel>Filters</FieldLabel>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-3">
        <div className="flex items-center gap-1 min-w-0 w-full sm:w-auto sm:flex-initial sm:min-w-[200px]">
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <SearchIcon />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search..."
              value={searchInput}
              onChange={onSearchChange}
            />
          </InputGroup>
        </div>

        {showStatusFilter && (
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={cn(
                    "px-3 sm:px-4 flex w-24 sm:w-32 shrink-0",
                    tags.length > 0 ? "justify-between" : "justify-center"
                  )}
                  variant="outline"
                >
                  <div className="flex items-center gap-1">
                    <FilterIcon className="size-4" />
                    Status
                  </div>
                  {(statusFilter?.length ?? 0) > 0 && (
                    <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded">
                      {statusFilter!.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="min-w-40">
                {Object.values(JobStatus).map((s) => (
                  <DropdownMenuCheckboxItem
                    key={s}
                    checked={statusFilter!.includes(s)}
                    onCheckedChange={(checked) =>
                      onStatusFilterToggle!(s, checked === true)
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    {capitalize(s.toLowerCase())}
                  </DropdownMenuCheckboxItem>
                ))}

                {(statusFilter?.length ?? 0) > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={onClearStatusFilter}
                      className="text-muted-foreground"
                    >
                      <XIcon className="size-4" />
                      Clear All
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={cn(
                  "px-3 sm:px-4 flex w-20 sm:w-28 shrink-0",
                  tags.length > 0 ? "justify-between" : "justify-center"
                )}
                variant="outline"
              >
                <div className="flex items-center gap-1">
                  <TagIcon className="size-4" />
                  Tags
                </div>

                {tags.length > 0 && (
                  <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded">
                    {tags.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-40 max-h-[250px] overflow-y-auto">
              {allTags.length === 0 ? (
                <div className="px-2 py-3 text-sm text-muted-foreground">
                  No tags yet
                </div>
              ) : (
                <>
                  {allTags.map((tagName) => (
                    <DropdownMenuCheckboxItem
                      key={tagName}
                      checked={tags.includes(tagName)}
                      onCheckedChange={(checked) =>
                        onTagToggle(tagName, checked === true)
                      }
                      onSelect={(e) => e.preventDefault()}
                    >
                      {tagName}
                    </DropdownMenuCheckboxItem>
                  ))}

                  {tags.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={onClearTags}
                        className="text-muted-foreground"
                      >
                        <XIcon className="size-4" />
                        Clear All
                      </DropdownMenuItem>
                    </>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 sm:ml-5">
          <button
            onClick={onToggleRejected}
            className={cn(
              "cursor-pointer px-3 py-1.5 rounded-md text-sm transition-colors",
              showRejected
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            Rejected
          </button>

          <button
            onClick={onToggleArchived}
            className={cn(
              "cursor-pointer px-3 py-1.5 rounded-md text-sm transition-colors",
              showArchived
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            Archived
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardFilters;
