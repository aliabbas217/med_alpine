"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ExternalLink, BookOpen } from "lucide-react";

type PaperCardProps = {
  paper: {
    pmcid: string;
    title: string;
    publication_date: string;
    last_updated: string;
    content: string;
    full_text_url: string;
  };
};

export function PaperCard({ paper }: PaperCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format publication date
  const formattedDate = new Date(paper.publication_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Clean up title by removing trailing punctuation and handling HTML entities
  const cleanTitle = paper.title
    .replace(/[,.;:!?]$/, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold leading-tight text-slate-900 dark:text-white">
          {cleanTitle}
        </CardTitle>
        <CardDescription className="flex items-center mt-1.5 text-slate-500 dark:text-slate-400">
          <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
          Published {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={isExpanded ? "" : "line-clamp-4"}>
          <p className="text-slate-700 dark:text-slate-300">
            {paper.content || "No abstract available"}
          </p>
        </div>
        {paper.content && paper.content.length > 300 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 p-0 h-auto font-medium"
          >
            {isExpanded ? "Show less" : "Read more"}
          </Button>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-end">
        <Link href={paper.full_text_url} target="_blank" rel="noopener noreferrer">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>View Full Paper</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}