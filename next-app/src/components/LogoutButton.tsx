"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/auth-actions";
import { useAuth } from "@/contexts/auth-context";

export function LogoutButton() {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout(); // Clear the Firebase auth state
    await signOut(); // Clear the server-side session cookie and redirect
  };
  
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