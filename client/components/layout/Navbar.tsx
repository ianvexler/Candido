"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/lib/images/SmallLogo.png";
import { HomeIcon, KanbanIcon, LogOutIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/board", icon: KanbanIcon, label: "Board" },
];

const Navbar = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <aside className="fixed left-0 top-0 z-10 flex h-screen w-18 shrink-0 flex-col items-center border-r border-border bg-candido-black py-4 mr-16">
      <Link href="/" className="mb-6 my-3">
        <Image src={Logo} alt="Candido" width={34} height={36} className="rounded" />
      </Link>

      <nav className="flex flex-1 flex-col gap-2">
        {navLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
              pathname === href || (href !== "/" && pathname.startsWith(href))
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
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
  );
};

export default Navbar;
