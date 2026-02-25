import { ReactNode } from "react";

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-6">
      {children}
    </div>
  );
};

export default PageContainer;
