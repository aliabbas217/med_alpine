import { Metadata } from "next";
import Image from "next/image";
import { Brain, BookOpen, UserPlus, TrendingUp, Mails } from "lucide-react";
import { getCurrentUser } from "@/actions/auth-actions";

export const metadata: Metadata = {
  title: "Dashboard | MedAlpine",
  description: "Your personalized medical research dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  // Sample stats and papers - in a real app you'd fetch this from your database
  const stats = [
    { name: "Research Papers Read", value: "0", icon: BookOpen },
    { name: "AI Interactions", value: "0", icon: Brain },
    { name: "Days Active", value: "1", icon: TrendingUp },
    { name: "Specialty Network", value: "0", icon: UserPlus },
  ];

  const recentPapers = [
    {
      id: 1,
      title: "Advances in Neurosurgical Techniques for Epilepsy Treatment",
      journal: "Journal of Neurosurgery",
      date: "May 2023",
      authors: "Chen et al.",
      saved: true,
      category: "Neurology",
    },
    {
      id: 2,
      title: "The Impact of AI on Early Cancer Detection",
      journal: "Oncology Research",
      date: "April 2023",
      authors: "Johnson et al.",
      saved: false,
      category: "Oncology",
    },
    {
      id: 3,
      title: "Novel Approaches to Managing Chronic Pain in Elderly Patients",
      journal: "Pain Medicine Journal",
      date: "June 2023",
      authors: "Rodriguez et al.",
      saved: true,
      category: "Pain Management",
    },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome back, {user?.displayName || "Doctor"}
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.name} 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mr-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Personalized research section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Personalized Research Feed</h2>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-center py-16">
              <div className="text-center max-w-sm">
                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  We're personalizing your research feed
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Our AI is analyzing your preferences to curate relevant medical research papers for you. Check back soon!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sample research papers section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Trending in Medical Research</h2>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentPapers.map((paper) => (
                <li key={paper.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium text-slate-900 dark:text-white">
                        {paper.title}
                      </h3>
                      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {paper.authors} • {paper.journal} • {paper.date}
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
                          {paper.category}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                      title={paper.saved ? "Remove from saved" : "Save paper"}
                    >
                      {paper.saved ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-teal-500 dark:fill-teal-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" stroke="currentColor" fill="none">
                          <path fillRule="evenodd" d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <button className="text-sm text-teal-600 dark:text-teal-400 font-medium hover:text-teal-700 dark:hover:text-teal-300">
                View all trending papers →
              </button>
            </div>
          </div>
        </section>

        {/* AI Assistant section */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Medical AI Assistant</h2>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 mb-4 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300">
                <Mails className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Ask your Medical Research Assistant
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-md">
                Get evidence-based answers to your medical questions, summaries of research papers, or help with clinical decisions.
              </p>
              <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium transition-colors">
                Start a conversation
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}