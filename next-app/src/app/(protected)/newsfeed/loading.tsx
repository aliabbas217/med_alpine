import { Skeleton } from "@/components/ui/skeleton";
import { PaperCardSkeleton } from "@/components/newsfeed/PaperCardSkeleton";

export default function Loading() {
  return (
    <>
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container flex justify-between items-center px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </header>
      
      <main className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {Array(6).fill(0).map((_, i) => (
            <PaperCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </>
  );
}