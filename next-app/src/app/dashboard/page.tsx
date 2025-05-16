import { Metadata } from "next";
import { LogoutButton } from "@/components/LogoutButton";
import Image from "next/image";
import { checkUserNeedsOnboarding } from "@/actions/auth-actions";


export const metadata: Metadata = {
  title: "Dashboard | MedAlpine",
  description: "Your personalized medical research dashboard",
};

export default async function DashboardPage() {

  const user = await checkUserNeedsOnboarding();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header with navigation and logout */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6 lg:px-8">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="relative w-8 h-8 mr-2">
              <Image
                src="/logo.svg"
                alt="MedAlpine Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-teal-600 dark:text-teal-400">MedAlpine</span>
          </div>
          
          {/* User info and logout */}
          <div className="flex items-center gap-4">
            <div className="hidden text-sm text-slate-600 dark:text-slate-300 md:block">
              {user.email}
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Welcome, {user.displayName || "Doctor"}</h1>
        <p className="mb-4 text-slate-600 dark:text-slate-400">Your personalized dashboard is loading...</p>
        
        {/* Dashboard content */}
        <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow">
            <h2 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">Recent Research Papers</h2>
            <p className="text-slate-600 dark:text-slate-400">Your personalized research feed is being generated...</p>
          </div>
          
          <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow">
            <h2 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">AI Research Assistant</h2>
            <p className="text-slate-600 dark:text-slate-400">Ask questions about medical research and get evidence-based answers.</p>
          </div>
          
          <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow">
            <h2 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">Your Bookmarks</h2>
            <p className="text-slate-600 dark:text-slate-400">You haven't saved any research papers yet.</p>
          </div>
        </div>
      </main>
    </div>
  );
}