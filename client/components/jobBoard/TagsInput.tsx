import { JobBoardEntry } from "@/lib/types";
import { useState, useMemo, KeyboardEvent } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";

interface TagsInputProps {
  allEntries: JobBoardEntry[];
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagsInput = ({ allEntries, tags, onTagsChange }: TagsInputProps) => {
  const allTags = useMemo(() => {
    const fromEntries = allEntries.flatMap(
      (e) => e.jobBoardTags?.map((t) => t.name) ?? []
    );
    return [...new Set([...fromEntries, ...tags])].sort();
  }, [allEntries, tags]);

  const [newTagInput, setNewTagInput] = useState("");

  const handleTagToggle = (tagName: string, checked: boolean) => {
    onTagsChange(
      checked ? [...tags, tagName] : tags.filter((t) => t !== tagName)
    );
  };

  const handleAddNewTag = () => {
    const name = newTagInput.trim();
    if (name && !tags.includes(name)) {
      onTagsChange([...tags, name]);
      setNewTagInput("");
    }
  };

  const handleNewTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewTag();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50",
            tags.length > 0 ? "gap-2" : "text-muted-foreground"
          )}
        >
          {tags.length > 0 ? (
            <span className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </span>
          ) : (
            "Add tags..."
          )}

          {tags.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {tags.length} selected
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[200px] max-h-60 overflow-y-auto">
        <div className="flex gap-2 p-2 border-b border-border">
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={handleNewTagKeyDown}
            placeholder="Add new tag..."
            className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />

          <button
            type="button"
            onClick={handleAddNewTag}
            disabled={!newTagInput.trim()}
            className="rounded-md bg-primary px-2 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            Add
          </button>
        </div>

        {allTags.length === 0 && tags.length === 0 ? (
          <div className="px-2 py-3 text-sm text-muted-foreground">
            No tags yet. Type above to create one.
          </div>
        ) : (
          <>
            {allTags.map((tagName) => (
              <DropdownMenuCheckboxItem
                key={tagName}
                checked={tags.includes(tagName)}
                onCheckedChange={(checked) =>
                  handleTagToggle(tagName, checked === true)
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
                  onClick={() => onTagsChange([])}
                  className="text-muted-foreground"
                >
                  Clear all
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TagsInput;
