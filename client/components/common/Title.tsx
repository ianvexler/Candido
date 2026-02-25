import { ReactNode } from "react";

const Title = ({ children }: { children: ReactNode }) => {
  return <h1 className="text-4xl font-bold tracking-tight">{children}</h1>;
};

export default Title;