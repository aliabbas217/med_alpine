"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Menu, 
  X,
  LayoutDashboard, 
  Search, 
  BookOpen, 
  Bookmark, 
  MessageSquare,
  User,
  Settings,
  FileText,
  LogOut,
  ShieldQuestion,
  NotepadText
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/actions/auth-actions";
import { ThemeToggle } from "@/components/ThemeToggle";

type MobileNavProps = {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
};

export function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
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
      name: "QnA Chat",
      href: "/qna",
      icon: ShieldQuestion,
    },
  ];

  return (
    <>
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 lg:hidden">
        <div className="flex items-center">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 focus:outline-none"
          >
            <span className="sr-only">Open menu</span>
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/dashboard" className="flex items-center ml-3">
            <div className="relative w-6 h-6 mr-2">
              <Image
                src="/logo.svg"
                alt="MedAlpine Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">MedAlpine</span>
          </Link>
        </div>
        
        <div className="flex items-center">
          <ThemeToggle />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "User"}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
                {user.displayName ? user.displayName[0] : "U"}
              </span>
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={toggleMenu}
        />
      )}
      
      {/* Mobile sidebar drawer */}
      <div 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-3/4 max-w-xs transform overflow-auto bg-white p-6 shadow-xl transition-transform dark:bg-slate-800 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center">
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
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 focus:outline-none"
          >
            <span className="sr-only">Close menu</span>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
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
        
        <nav className="space-y-1">
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
              onClick={() => setIsOpen(false)} // Close menu when clicking a link
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
          
          {/* Logout button */}
          <button
            onClick={() => signOut()}
            className="w-full text-left text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50 group flex items-center rounded-md px-3 py-2 text-sm font-medium"
          >
            <LogOut
              className="mr-3 h-5 w-5 shrink-0 text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300"
              aria-hidden="true"
            />
            Sign Out
          </button>
        </nav>
      </div>
    </>
  );
}