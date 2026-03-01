"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/lib/images/SmallLogo.png";
import { FileTextIcon, HomeIcon, KanbanIcon, LogOutIcon, MenuIcon, SettingsIcon, SheetIcon, ShieldIcon, UploadIcon } from "lucide-react";
import NavbarLink from "./NavbarLink";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/NavigationMenu";
import ImportJobsModal from "@/components/common/ImportJobsModal";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", icon: HomeIcon, label: "Dashboard" },
  { href: "/board", icon: KanbanIcon, label: "Board" },
  { href: "/sheet", icon: SheetIcon, label: "Sheet" },
];

const Navbar = () => {
  const { isAuthenticated, isAdmin, handleLogout } = useAuth();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState("");

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
          <button
            onClick={() => setImportModalOpen(true)}
            className="cursor-pointer flex size-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Import jobs"
            title="Import jobs"
          >
            <UploadIcon className="size-5" />
          </button>

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
      <nav className="md:hidden fixed top-0 left-0 right-0 z-10 flex items-center justify-between border-b border-border bg-candido-black px-4 py-2 gap-4">
        <Link href="/" className="shrink-0">
          <Image src={Logo} alt="Candido" width={28} height={30} className="rounded" />
        </Link>

        <NavigationMenu
          className="max-w-none flex-1 justify-end"
          viewport={false}
          value={mobileMenuOpen}
          onValueChange={setMobileMenuOpen}
        >
          <NavigationMenuList className="gap-0">
            <NavigationMenuItem value="menu">
              <NavigationMenuTrigger
                hideChevron
                className="h-10 w-10 bg-transparent px-0 text-gray-400 hover:text-white"
              >
                <MenuIcon className="size-5" />
              </NavigationMenuTrigger>

              <NavigationMenuContent className="absolute right-0 left-auto top-full mt-1.5 z-50 min-w-[180px] rounded-md bg-candido-black! p-1">
                <ul className="flex flex-col">
                  {navLinks.map(({ href, icon: Icon, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMobileMenuOpen("")}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded"
                      >
                        <Icon className="size-4" />
                        {label}
                      </Link>
                    </li>
                  ))}

                  <li>
                    <button
                      onClick={() => {
                        setMobileMenuOpen("");
                        setImportModalOpen(true);
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded"
                    >
                      <UploadIcon className="size-4" />
                      Import
                    </button>
                  </li>

                  <li>
                    <Link
                      href="/settings"
                      onClick={() => setMobileMenuOpen("")}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded"
                    >
                      <SettingsIcon className="size-4" />
                      Settings
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/feedback"
                      onClick={() => setMobileMenuOpen("")}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded"
                    >
                      <FileTextIcon className="size-4" />
                      Feedback
                    </Link>
                  </li>

                  {isAdmin && (
                    <li>
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen("")}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded"
                      >
                        <ShieldIcon className="size-4" />
                        Admin
                      </Link>
                    </li>
                  )}

                  <li>
                    <button
                      onClick={() => {
                        setMobileMenuOpen("");
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded"
                    >
                      <LogOutIcon className="size-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <ImportJobsModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
