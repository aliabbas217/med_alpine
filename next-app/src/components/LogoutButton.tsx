"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/auth-actions";
import { useAuth } from "@/contexts/auth-context";
import { LogOut } from "lucide-react";

type LogoutButtonProps = {
  variant?: "outline" | "sidebar" | "header";
};

export function LogoutButton({ variant = "outline" }: LogoutButtonProps) {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout(); // Clear the Firebase auth state
    await signOut(); // Clear the server-side session cookie and redirect
  };
  
  if (variant === "sidebar") {
    return (
      <button
        onClick={handleLogout}
        className="w-full text-left text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50 group flex items-center rounded-md px-3 py-2 text-sm font-medium"
      >
        <LogOut
          className="mr-3 h-5 w-5 shrink-0 text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300"
          aria-hidden="true"
        />
        Sign Out
      </button>
    );
  }

  if (variant === "header") {
    return (
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span>Sign Out</span>
      </Button>
    );
  }
  
  return (
    <Button 
      onClick={handleLogout} 
      variant="outline"
      className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/20"
    >
      Sign Out
    </Button>
  );
}