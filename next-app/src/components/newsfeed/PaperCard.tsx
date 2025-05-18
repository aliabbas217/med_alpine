"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ExternalLink, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

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
    
  // Check if content needs expand/collapse
  const needsExpand = paper.content && paper.content.length > 240;
  const displayContent = paper.content || "No abstract available";

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-xs font-normal px-1.5 py-0 h-5 bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400">
            PMC{paper.pmcid.replace(/PMC/, '')}
          </Badge>
        </div>
        <CardTitle className="text-base sm:text-lg font-semibold leading-tight text-slate-900 dark:text-white">
          {cleanTitle}
        </CardTitle>
        <CardDescription className="flex items-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <CalendarDays className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className={`text-sm text-slate-700 dark:text-slate-300 ${isExpanded ? "" : "line-clamp-4"}`}>
          {displayContent}
        </div>
        {needsExpand && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 p-0 h-auto font-medium text-xs flex items-center gap-1"
          >
            <span>{isExpanded ? "Show less" : "Read more"}</span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-end border-t border-slate-100 dark:border-slate-800 mt-auto">
        <Link href={paper.full_text_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
            <span>View Full Paper</span>
            <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}