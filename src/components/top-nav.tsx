"use client";
import { ThemeToggle } from "./theme-toggle";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/contexts/settings-context";

import { Button } from "@/components/ui/button";
import React from "react";
import { PanelLeft } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import { UserButton } from "@clerk/nextjs";

export function TopNav() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const { settings } = useSettings();
  const { isSidebarOpen, toggleSidebar } = useAppContext();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/50 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="hidden md:block">
          <nav className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={`ml-auto h-8 w-8 ${isSidebarOpen && "ml-0"}`}
              onClick={() => toggleSidebar()}
            >
              <PanelLeft
                className={`
                    "h-4 w-4 transition-transform",
                    ${isSidebarOpen && "rotate-180"}
                  `}
              />
              <span className="sr-only">
                {isSidebarOpen ? "Expand" : "Collapse"} Sidebar
              </span>
            </Button>
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={segment}>
                <span className="text-muted-foreground">/</span>
                <Link
                  href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                  className="text-sm font-medium"
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
