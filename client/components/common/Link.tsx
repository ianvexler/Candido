import { ReactNode } from "react";
import Link, { LinkProps } from "next/link";
import { cn } from "@/lib/utils";

interface LinkComponentProps extends LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const LinkComponent = ({ href, children, className = "", ...props }: LinkComponentProps) => {
  const classes = cn("text-primary underline hover:text-primary/60", className);

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
};

export default LinkComponent;