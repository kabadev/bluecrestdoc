"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Folder,
  Wallet,
  SendHorizontal,
  Folders,
  FolderX,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useAppContext } from "@/contexts/app-context";
import { useUser } from "@clerk/nextjs";

const navigation = [
  { name: "Dashboard", roles: ["admin"], href: "/", icon: Home },
  {
    name: "Academic Records",
    roles: ["admin", "academic"],
    href: "/academic-records",
    icon: Building2,
  },
  {
    name: "HR Records",
    roles: ["admin", "hr"],
    href: "/hr",
    icon: SendHorizontal,
  },
  {
    name: "Financial Records",
    roles: ["admin", "finance"],
    href: "/financial-records",
    icon: Folder,
  },
  {
    name: "Student Records",
    roles: ["admin", "student"],
    href: "/student-records",
    icon: Wallet,
  },
  {
    name: "Other Documents",
    roles: ["admin"],
    href: "/other-documents",
    icon: FolderX,
  },
  { name: "Personal (Coming soon)", roles: ["*"], href: "#", icon: Folders },
  { name: "Users", roles: ["admin"], href: "/users", icon: Users2 },
];

export function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();
  const { isSidebarOpen } = useAppContext();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Assume you store the role in user.publicMetadata.role or user.unsafeMetadata.role
  const userRole = (
    user?.publicMetadata?.role ||
    user?.unsafeMetadata?.role ||
    ""
  ).toString();

  // Only include nav items that match the user's role OR are marked with "*"
  const filteredNavigation = useMemo(() => {
    return navigation.filter(
      (item) => item.roles.includes("*") || item.roles.includes(userRole)
    );
  }, [userRole]);

  const NavItem = ({ item }: any) => (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-primary text-white"
              : "text-muted-foreground hover:bg-primary hover:text-white",
            isSidebarOpen && "justify-center px-2"
          )}
        >
          <item.icon className={cn("h-4 w-4", !isSidebarOpen && "mr-3")} />
          {!isSidebarOpen && <span>{item.name}</span>}
        </Link>
      </TooltipTrigger>
      {isSidebarOpen && (
        <TooltipContent side="right" className="flex items-center gap-4">
          {item.name}
        </TooltipContent>
      )}
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="fixed h-screen bg-gradient-to-br from-primary/30 to-secondary top-0 border-r">
        <div
          className={cn(
            "fixed inset-y-0 z-20 flex flex-col transition-all duration-300 ease-in-out lg:static",
            isSidebarOpen ? "w-[72px]" : "w-72",
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="border-b border-border">
            <div
              className={cn(
                "flex h-16 items-center gap-2 px-4",
                isSidebarOpen && "justify-center px-2"
              )}
            >
              {!isSidebarOpen && (
                <Link
                  href="/"
                  className="flex gap-2 items-center font-semibold"
                >
                  <img
                    src="/logo.jpg"
                    className="h-14 w-14 rounded-full"
                    alt="Logo"
                  />
                  <span className="text-lg">DashDoc</span>
                </Link>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {filteredNavigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
