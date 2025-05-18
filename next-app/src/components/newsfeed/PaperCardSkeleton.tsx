import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PaperCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-3 space-y-2">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-1/3 mt-1" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end border-t border-slate-100 dark:border-slate-800 mt-auto">
        <Skeleton className="h-9 w-full sm:w-36" />
      </CardFooter>
    </Card>
  );
}