"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { fetchNewsfeedForUser } from "@/actions/newsfeed-actions";

type NewsfeedRefreshButtonProps = {
  userId: string;
};

export function NewsfeedRefreshButton({ userId }: NewsfeedRefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchNewsfeedForUser(userId);
      router.refresh(); // Refresh the page to show new data
    } catch (error) {
      console.error("Error refreshing newsfeed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="flex items-center gap-1.5"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
      <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
    </Button>
  );
}