import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 pt-12 pb-8", className)}>
      {children}
    </div>
  );
};

export default PageContainer;
