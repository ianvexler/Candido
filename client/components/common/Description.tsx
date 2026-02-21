import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface SubtitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

const Description = ({ children, className, ...props }: SubtitleProps) => {
  const classes = cn("text-base font-light text-muted-foreground", className);
  
  return <h2 className={classes} {...props}>{children}</h2>;
};

export default Description;