"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "../ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

const Navbar = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-foreground">
          Workbench
        </Link>

        <ul className="flex gap-6 items-center">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            </li>
          ))}
          <Button onClick={() => handleLogout()}>Logout</Button>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
