"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "../ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/jobBoard", label: "Job Board" },
];

const Navbar = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex items-center justify-end px-6 py-4">
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
