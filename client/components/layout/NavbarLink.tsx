import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

interface NavbarLinkProps extends LinkProps, PropsWithChildren {
  label?: string;
  title?: string;
  href: string;
}

const NavbarLink = ({ href, children, label, title, ...props }: NavbarLinkProps) => {
  const pathname = usePathname();
  const tooltip = title ?? label ?? "";

  const linkClass = (path: string) =>
    pathname === path || (path !== "/" && pathname.startsWith(path))
    ? "bg-white/10 text-white"
    : "text-gray-400 hover:bg-white/5 hover:text-white";
  
  return (
    <Link href={href} title={tooltip} className={`flex size-12 items-center justify-center rounded-lg transition-colors ${linkClass(href)}`} {...props}>
      {children}
    </Link>
  );
};

export default NavbarLink;