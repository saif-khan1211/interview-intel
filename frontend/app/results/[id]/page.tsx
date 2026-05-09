"use client";

import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnalysisProgress from "@/components/results/AnalysisProgress";
import ResultsLayout from "@/components/results/ResultsLayout";
import { useAnalysisStatus } from "@/hooks/useAnalysisStatus";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const analysisId = parseInt(id, 10);

  const { data, fetchError } = useAnalysisStatus(analysisId);

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{fetchError}</p>
        <Button variant="outline" onClick={() => router.push("/analyze")}>
          Try again
        </Button>
      </div>
    );
  }

  if (!data || data.status === "pending" || data.status === "processing") {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <AnalysisProgress company={data?.company_name} />
      </div>
    );
  }

  if (data.status === "failed") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <h2 className="font-semibold text-foreground">Analysis failed</h2>
        <p className="text-sm text-muted-foreground">
          {data.error_message || "Something went wrong generating your prep plan."}
        </p>
        <Button variant="outline" onClick={() => router.push("/analyze")}>
          Try again
        </Button>
      </div>
    );
  }

  if (!data.result) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/history">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            History
          </Button>
        </Link>
        <div className="flex-1" />
        {data.from_cache && (
          <span className="text-xs text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
            Cached result
          </span>
        )}
      </div>

      <ResultsLayout
        plan={data.result}
        company={data.company_name}
        role={data.role_title}
      />
    </div>
  );
}
