import { checkUserNeedsOnboarding } from "@/actions/auth-actions";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is logged in and has completed onboarding
  const user = await checkUserNeedsOnboarding();
  
  if (!user) {
    redirect("/login");
  }

  // Create a properly typed user object for the components
  const typedUser = {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile navigation - shown on small screens */}
      <MobileNav user={typedUser} />
      
      {/* Main layout with sidebar and content */}
      <div className="flex">
        {/* Sidebar - hidden on small screens */}
        <DashboardSidebar user={typedUser} />
        
        {/* Main content area */}
        <main className="flex-1 pl-0 lg:pl-64">
          <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
          <ThemeToggle />
          <LogoutButton variant="header" />
        </div>
          
          {children}
        </main>
      </div>
    </div>
  );
}