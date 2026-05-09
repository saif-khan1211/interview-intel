"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getAnalysis } from "@/lib/api";
import type { AnalysisStatusResponse } from "@/types/analysis";

export function useAnalysisStatus(analysisId: number) {
  const { getToken } = useAuth();
  const [data, setData] = useState<AnalysisStatusResponse | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    let cancelled = false;

    const poll = async () => {
      try {
        const token = await getToken();
        if (!token || cancelled) return;
        const result = await getAnalysis(analysisId, token);
        if (!cancelled) {
          setData(result);
          if (result.status === "completed" || result.status === "failed") {
            clearInterval(intervalId);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : "Failed to fetch status");
        }
      }
    };

    poll();
    intervalId = setInterval(poll, 3000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [analysisId, getToken]);

  return { data, fetchError };
}
