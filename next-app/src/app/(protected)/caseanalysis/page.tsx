import { Metadata } from "next";
import { CaseAnalysisForm } from "@/components/caseanalysis/CaseAnalysisForm";
import { checkUserNeedsOnboarding } from "@/actions/auth-actions";

export const metadata: Metadata = {
  title: "Case Analysis | MedAlpine",
  description: "Evidence-based medical case analysis powered by the latest research",
};

export default async function QnAPage() {
  // Check if user is logged in and has completed onboarding
  const user = await checkUserNeedsOnboarding();
  
  return (
    <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="pb-6 mb-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Medical Case Analysis
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Enter your case details to receive an evidence-based analysis supported by the latest medical research.
          </p>
        </header>
        
        <CaseAnalysisForm userId={user.uid} />
      </div>
    </div>
  );
}