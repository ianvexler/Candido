"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/lib/images/SmallLogo.png";
import { FileTextIcon, HomeIcon, KanbanIcon, LogOutIcon, SettingsIcon, SheetIcon, ShieldIcon } from "lucide-react";
import NavbarLink from "./NavbarLink";

const navLinks = [
  { href: "/dashboard", icon: HomeIcon, label: "Dashboard" },
  { href: "/board", icon: KanbanIcon, label: "Board" },
  { href: "/sheet", icon: SheetIcon, label: "Sheet" },
];

const Navbar = () => {
  const { isAuthenticated, isAdmin, handleLogout } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 z-10 h-screen w-18 shrink-0 flex-col items-center border-r border-border bg-candido-black py-4">
        <Link href="/" className="mb-6 my-3">
          <Image src={Logo} alt="Candido" width={34} height={36} className="rounded" />
        </Link>

        <nav className="flex flex-1 flex-col gap-3">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <NavbarLink
              key={href}
              href={href}
              aria-label={label}
              label={label}
            >
              <Icon className="size-5" />
            </NavbarLink>
          ))}
        </nav>

        <div className="flex flex-col items-center justify-center gap-3">
          <NavbarLink href="/settings" label="Settings">
            <SettingsIcon className="size-5" />
          </NavbarLink>

          <NavbarLink href="/feedback" label="Feedback">
            <FileTextIcon className="size-5" />
          </NavbarLink>

          {isAdmin && (
            <NavbarLink href="/admin" label="Admin">
              <ShieldIcon className="size-5" />
            </NavbarLink>
          )}

          <button
            onClick={() => handleLogout()}
            className="cursor-pointer flex size-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Logout"
            title="Logout"
          >
            <LogOutIcon className="size-5" />
          </button>
        </div>
      </aside>

      {/* Mobile */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-10 flex items-center justify-around border-b border-border bg-candido-black py-2">
        {navLinks.map(({ href, icon: Icon, label }) => (
          <NavbarLink
            key={href}
            href={href}
            aria-label={label}
            title={label}
          >
            <Icon className="size-6" />
            <span className="text-[10px]">{label}</span>
          </NavbarLink>
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
