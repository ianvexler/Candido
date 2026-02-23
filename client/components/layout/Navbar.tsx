"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "../ui/Button";
import Image from "next/image";
import MainLogo from '@/lib/images/MainLogo.png'
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/jobBoard", label: "Job Board" },
];

const Navbar = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header
      className={`border-b border-border bg-[#222222] transition-shadow duration-200 ${
        hasScrolled ? "shadow-md" : ""
      }`}
    >
      <nav className="mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="pb-1 pl-3">
          <Image src={MainLogo} alt="Candido" height={50} />
        </Link>

        <ul className="flex gap-6 items-center">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="hover:text-gray-300 transition-colors text-white"
              >
                {label}
              </Link>
            </li>
          ))}
          <Button
            onClick={() => handleLogout()}
            variant="outline"
            className="border-gray-300 bg-white text-black hover:bg-gray-200"
          >
            Logout
          </Button>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
