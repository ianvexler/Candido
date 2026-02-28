"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/lib/images/SmallLogo.png";
import { HomeIcon, KanbanIcon, LogOutIcon, SheetIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/board", icon: KanbanIcon, label: "Board" },
  { href: "/sheet", icon: SheetIcon, label: "Sheet" },
];

const Navbar = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return null;
  }

  const linkClass = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href))
      ? "bg-white/10 text-white"
      : "text-gray-400 hover:bg-white/5 hover:text-white";

  return (
    <>
      {/* Desktop: left sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 z-10 h-screen w-18 shrink-0 flex-col items-center border-r border-border bg-candido-black py-4">
        <Link href="/" className="mb-6 my-3">
          <Image src={Logo} alt="Candido" width={34} height={36} className="rounded" />
        </Link>

        <nav className="flex flex-1 flex-col gap-3">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex size-12 items-center justify-center rounded-lg transition-colors ${linkClass(href)}`}
              aria-label={label}
              title={label}
            >
              <Icon className="size-5" />
            </Link>
          ))}
        </nav>

        <button
          onClick={() => handleLogout()}
          className="cursor-pointer flex size-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Logout"
          title="Logout"
        >
          <LogOutIcon className="size-5" />
        </button>
      </aside>

      {/* Mobile: top nav */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-10 flex items-center justify-around border-b border-border bg-candido-black py-2">
        {navLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-6 rounded-lg transition-colors min-w-[64px] ${linkClass(href)}`}
            aria-label={label}
            title={label}
          >
            <Icon className="size-6" />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
        <button
          onClick={() => handleLogout()}
          className="flex flex-col items-center justify-center gap-1 py-2 px-6 rounded-lg transition-colors min-w-[64px] text-gray-400 hover:bg-white/5 hover:text-white"
          aria-label="Logout"
          title="Logout"
        >
          <LogOutIcon className="size-6" />
          <span className="text-[10px]">Logout</span>
        </button>
      </nav>
    </>
  );
};

export default Navbar;
