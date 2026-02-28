"use client";

import { usePathname } from "next/navigation";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <div
      className={`flex min-h-screen flex-1 flex-col overflow-y-auto min-w-0 ${
        isLanding ? "pl-0 pt-14" : "pl-0 md:pl-18 pt-14 md:pt-0"
      }`}
    >
      {children}
    </div>
  );
};

export default MainContent;
