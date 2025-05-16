import { Metadata } from "next";
import { checkUserNeedsOnboarding } from "@/actions/auth-actions";
import { fetchNewsfeedForUser } from "@/actions/newsfeed-actions";
import { getUserProfileData } from "@/actions/user-actions";
import { PaperCard } from "@/components/newsfeed/PaperCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { NewsfeedRefreshButton } from "@/components/newsfeed/NewsfeedRefresh";

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
    "general": "General Medicine",
    "emergency": "Emergency Medicine"
  };
  
  const displayField = fieldMap[profileData.onboarding.field] || "General Medicine";

  return (
    <>
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container flex justify-between items-center px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Research Newsfeed</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Latest research papers in {displayField}
            </p>
          </div>
          <NewsfeedRefreshButton userId={user.uid} />
        </div>
      </header>
      
      <main className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
        {papers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {papers.map((paper) => (
              <PaperCard key={paper.pmcid} paper={paper} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No research papers found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We couldn't find any recent papers in your field of interest. 
              Try refreshing or changing your specialty in your profile.
            </p>
            <NewsfeedRefreshButton userId={user.uid} />
          </div>
        )}
      </main>
    </>
  );
}