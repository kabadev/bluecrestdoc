"use client";

import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/settings-context";
import type React from "react";

import { useAppContext } from "@/contexts/app-context";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useAppContext();

  return (
    <SettingsProvider>
      <TooltipProvider delayDuration={0}>
        <div className="min-h-screen flex">
          <Sidebar />
          <div
            className={`flex-1 bg-gradient-to-tl via-secondary from-primary/30 to-secondary transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "md:ml-8" : "md:ml-72"
            }  `}
          >
            <TopNav />
            <div className="container mx-auto p-6 max-w-7xl ">
              <main className="w-full">{children}</main>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </SettingsProvider>
  );
}
