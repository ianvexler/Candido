"use client";

import { usePathname } from "next/navigation";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isBoard = pathname === "/board";

  return (
    <div
      className={`flex flex-1 flex-col min-w-0 ${
        isLanding ? "pl-0 pt-0 min-h-screen overflow-y-auto" : "pl-0 md:pl-18 pt-14 md:pt-0"
      } ${
        isBoard ? "h-screen overflow-hidden" : "min-h-screen overflow-y-auto"
      }`}
    >
      {children}
    </div>
  );
};

export default MainContent;
