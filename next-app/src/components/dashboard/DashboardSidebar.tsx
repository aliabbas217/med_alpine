"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Settings,
  User,
  FileText,
  NotepadText,
  ShieldQuestion,
  BrainCog,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "../LogoutButton";

type SidebarProps = {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
};

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Search",
      href: "/search",
      icon: Search,
    },
    {
      name: "Newsfeed",
      href: "/newsfeed",
      icon: NotepadText,
    },
  
    {
      name: "Case Analysis",
      href: "/caseanalysis",
      icon: BrainCog,
    },
    {
      name: "Research",
      href: "/research",
      icon: BookOpen,
    },
  ];

  const secondaryItems = [
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      name: "",
      href: "/login",
      icon: LogoutButton,
    },

  ];

  return (
    <aside className="fixed hidden h-screen w-64 flex-col border-r border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 lg:flex">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center mb-8">
        <div className="relative w-8 h-8 mr-2">
          <Image
            src="/logo.svg"
            alt="MedAlpine Logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-xl font-semibold text-teal-600 dark:text-teal-400">MedAlpine</span>
      </Link>

      {/* User info */}
      <div className="flex items-center mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <span className="text-lg font-medium text-teal-600 dark:text-teal-400">
              {user.displayName ? user.displayName[0] : "U"}
            </span>
          )}
        </div>
        <div className="ml-3 overflow-hidden">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {user.displayName || "User"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {user.email}
          </p>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              item.href === pathname
                ? "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50",
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium"
            )}
          >
            <item.icon
              className={cn(
                item.href === pathname
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300",
                "mr-3 h-5 w-5 shrink-0"
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Secondary navigation */}
      <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-700">
        <nav className="space-y-1">
          {secondaryItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                item.href === pathname
                  ? "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50",
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium"
              )}
            >
              <item.icon
                className={cn(
                  item.href === pathname
                    ? "text-teal-600 dark:text-teal-400"
                    : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300",
                  "mr-3 h-5 w-5 shrink-0"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Version info */}
      <div className="mt-6 pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>MedAlpine v1.0</p>
      </div>
    </aside>
  );
}