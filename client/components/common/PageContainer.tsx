import { ReactNode } from "react";

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {children}
    </div>
  );
};

export default PageContainer;
