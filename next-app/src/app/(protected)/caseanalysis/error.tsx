"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex items-center justify-center min-h-[60vh] px-4 py-16 mx-auto text-center sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Error Loading Case Analysis
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          We encountered an issue while loading the case analysis tool. This might be due to a network error or the API being unavailable.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => reset()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}