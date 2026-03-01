"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";

const JobsRefreshContext = createContext<{ refreshTrigger: number; refresh: () => void } | null>(null);

export const JobsRefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const refresh = useCallback(() => setRefreshTrigger((t) => t + 1), []);

  return (
    <JobsRefreshContext.Provider value={{ refreshTrigger, refresh }}>
      {children}
    </JobsRefreshContext.Provider>
  );
};

export const useJobsRefresh = () => {
  const context = useContext(JobsRefreshContext);

  if (!context) {
    throw new Error("useJobsRefresh must be used within JobsRefreshProvider");
  }
  return context;
};
