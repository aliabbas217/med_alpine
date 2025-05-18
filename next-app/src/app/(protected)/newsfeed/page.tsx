import { Metadata } from "next";
import { checkUserNeedsOnboarding } from "@/actions/auth-actions";
import { fetchNewsfeedForUser } from "@/actions/newsfeed-actions";
import { getUserProfileData } from "@/actions/user-actions";
import { PaperCard } from "@/components/newsfeed/PaperCard";
import { PaperCardSkeleton } from "@/components/newsfeed/PaperCardSkeleton";
import { NewsfeedRefreshButton } from "@/components/newsfeed/NewsfeedRefresh";
import { Newspaper, Filter } from "lucide-react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Newsfeed | MedAlpine",
  description: "Your personalized medical research newsfeed",
};

export default async function NewsfeedPage() {
  // Check if user is logged in and has completed onboarding
  const user = await checkUserNeedsOnboarding();
  
  // Get user profile data
  const profileData = await getUserProfileData(user.uid);
  
  // Fetch papers based on user's field
  const papers = await fetchNewsfeedForUser(user.uid);

  // Determine the field name to display
  const fieldMap: Record<string, string> = {
    "cardiology": "Cardiology",
    "neurology": "Neurology",
    "pulmonology": "Pulmonology",
    "pediatrics": "Pediatrics",
    "orthopedics": "Orthopedics",
    "pathology": "Pathology",
  };
  
  const displayField = fieldMap[profileData.onboarding.field] || "General Medicine";

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 mb-4">
        <div className="container flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex h-9 w-9 rounded-full bg-teal-100 dark:bg-teal-900 items-center justify-center">
              <Newspaper className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Research Newsfeed</h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Filter className="h-3 w-3" />
                <span>Filtered for {displayField}</span>
              </p>
            </div>
          </div>
          <NewsfeedRefreshButton userId={user.uid} />
        </div>
      </header>
      
      <main className="container flex-1 px-4 py-2 mx-auto sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingSkeleton />}>
          {papers.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {papers.map((paper) => (
                <PaperCard key={paper.pmcid} paper={paper} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <Newspaper className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No research papers found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                We couldn't find any recent papers in your field of interest. 
                Try refreshing or changing your specialty in your profile.
              </p>
              <NewsfeedRefreshButton userId={user.uid} />
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <PaperCardSkeleton key={i} />
      ))}
    </div>
  );
}