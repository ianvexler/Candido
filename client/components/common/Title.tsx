import { ReactNode } from "react";

const Title = ({ children }: { children: ReactNode }) => {
  return <h1 className="text-3xl font-bold">{children}</h1>;
};

export default Title;