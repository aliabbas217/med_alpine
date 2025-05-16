import { Metadata } from "next";
import { checkUserNeedsOnboarding } from "@/actions/auth-actions";

export const metadata: Metadata = {
  title: "Search | MedAlpine",
  description: "Search for medical research papers",
};

export default async function SearchPage() {
  await checkUserNeedsOnboarding();

  return (
    <>
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Search</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Find relevant medical research papers
          </p>
        </div>
      </header>

      <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8 shadow-sm">
          <div className="text-center py-16">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Search functionality coming soon
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We're working on building a powerful search system for medical research papers
            </p>
          </div>
        </div>
      </div>
    </>
  );
}