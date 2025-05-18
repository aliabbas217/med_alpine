import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="pb-6 mb-6 border-b border-slate-200 dark:border-slate-700">
          <Skeleton className="h-9 w-64 mb-3" />
          <Skeleton className="h-5 w-full max-w-lg" />
        </header>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-24 mb-1.5" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-5 w-32 mb-1.5" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-5 w-36 mb-1.5" />
            <Skeleton className="h-20 w-full" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-5 w-40 mb-1.5" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-5 w-48 mb-1.5" />
            <div className="flex flex-wrap gap-2 mt-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>
          
          <Skeleton className="h-10 w-36 mt-6" />
        </div>
      </div>
    </div>
  );
}