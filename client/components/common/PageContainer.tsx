import { ReactNode } from "react";

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pt-12 pb-8">
      {children}
    </div>
  );
};

export default PageContainer;
