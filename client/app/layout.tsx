import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import MainContent from "@/components/layout/MainContent";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/Tooltip";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Candido",
  description: "Track your job applications",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${geistMono.variable} font-sans flex min-h-screen flex-col antialiased`}>
        <AuthProvider>
          <TooltipProvider>
            <div className="flex min-h-screen flex-1">
              <Navbar />

              <MainContent>
                <main className="flex-1 flex flex-col min-h-0">
                  <div className="flex-1 min-h-0 flex flex-col">{children}</div>
                </main>

                <footer className="border-t border-border bg-background">
                  <div className="mx-auto max-w-6xl px-6 py-6">
                    <p className="text-center text-sm text-muted-foreground">
                      © {new Date().getFullYear()} Candido
                    </p>
                  </div>
                </footer>
              </MainContent>
            </div>
          </TooltipProvider>
          
          <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
