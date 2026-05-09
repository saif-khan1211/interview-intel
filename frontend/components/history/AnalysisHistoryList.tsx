"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";

const statusColor: Record<string, string> = {
  completed: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200",
  processing: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200",
  pending: "bg-muted text-muted-foreground border-border",
  failed: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200",
};

export default function AnalysisHistoryList() {
  const { data, loading, error } = useAnalysisHistory();

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <BrainCircuit className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No analyses yet.</p>
        <Link
          href="/analyze"
          className="text-sm text-primary hover:underline underline-offset-4"
        >
          Start your first analysis →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => (
        <Link
          key={item.id}
          href={item.status === "completed" ? `/results/${item.id}` : "#"}
          className={`group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors ${
            item.status !== "completed" ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-foreground truncate">
                {item.role_title}
              </span>
              <span className="text-xs text-muted-foreground">at {item.company_name}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="secondary" className={statusColor[item.status] || ""}>
                {item.status}
              </Badge>
              {item.fit_score !== null && (
                <span className="text-xs text-muted-foreground">
                  {item.fit_score}/100 fit
                </span>
              )}
              {item.from_cache && (
                <span className="text-xs text-muted-foreground">· cached</span>
              )}
              <span className="text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          {item.status === "completed" && (
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          )}
        </Link>
      ))}
    </div>
  );
}
