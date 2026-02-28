import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/layout/footer";
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
  description: "A Next.js app with Express API",
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

              <div className="flex min-h-screen flex-1 flex-col overflow-y-auto pl-0 md:pl-18 pt-14 md:pt-0 min-w-0">
                <main className="flex-1 flex flex-col min-h-0">
                  <div className="flex-1 min-h-0 flex flex-col">{children}</div>
                </main>
                <Footer />
              </div>
            </div>
          </TooltipProvider>
          
          <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
