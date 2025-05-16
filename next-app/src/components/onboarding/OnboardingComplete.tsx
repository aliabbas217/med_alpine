import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function OnboardingComplete() {
  return (
    <motion.div 
      className="py-8 text-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="mx-auto mb-6 w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-300">
        <CheckCircle className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Complete!</h2>
      <p className="mt-2 mb-6 text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
        Thank you for sharing your information. We're preparing your personalized research experience.
      </p>
      <div className="max-w-md mx-auto p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg border border-teal-100 dark:border-teal-800">
        <p className="text-sm text-teal-700 dark:text-teal-300">
          Redirecting you to your personalized dashboard...
        </p>
      </div>
    </motion.div>
  );
}