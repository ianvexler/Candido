import { useMemo, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { JobBoardEntry, JobStatus } from "@/lib/types";

export function useBoardFilters(
  jobBoardEntries: JobBoardEntry[],
  setJobBoardEntries: React.Dispatch<React.SetStateAction<JobBoardEntry[]>>
) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showRejected, setShowRejected] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const debouncedSetSearch = useMemo(() =>
    debounce(
      ((value: string) => setSearch(value)) as (...args: unknown[]) => unknown, 300
    ), []);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchInput(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch]
  );

  const handleTagToggle = useCallback((tagName: string, checked: boolean) => {
    setTags((prev) =>
      checked ? [...prev, tagName] : prev.filter((t) => t !== tagName)
    );
  }, []);

  const handleClearTags = useCallback(() => {
    setTags([]);
  }, []);

  const handleToggleRejected = useCallback(() => {
    setShowRejected((prev) => {
      if (prev) {
        setJobBoardEntries((entries) =>
          entries.filter((e) => e.status !== JobStatus.REJECTED)
        );
      }
      return !prev;
    });
  }, [setJobBoardEntries]);

  const handleToggleArchived = useCallback(() => {
    setShowArchived((prev) => {
      if (prev) {
        setJobBoardEntries((entries) =>
          entries.filter((e) => e.status !== JobStatus.ARCHIVED)
        );
      }
      return !prev;
    });
  }, [setJobBoardEntries]);

  const filteredEntries = useMemo(() => {
    let result = jobBoardEntries;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.company.toLowerCase().includes(q)
      );
    }

    if (tags.length > 0) {
      result = result.filter((e) =>
        e.jobBoardTags?.some((t) => tags.includes(t.name))
      );
    }
    return result;
  }, [jobBoardEntries, search, tags]);

  return {
    searchInput,
    handleSearchChange,
    tags,
    handleTagToggle,
    handleClearTags,
    showRejected,
    handleToggleRejected,
    showArchived,
    handleToggleArchived,
    filteredEntries,
  };
}
