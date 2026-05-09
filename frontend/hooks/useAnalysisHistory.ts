"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { listAnalyses } from "@/lib/api";
import type { AnalysisListItem } from "@/types/analysis";

export function useAnalysisHistory() {
  const { getToken } = useAuth();
  const [data, setData] = useState<AnalysisListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const token = await getToken();
        if (!token || cancelled) return;
        const result = await listAnalyses(token);
        if (!cancelled) setData(result);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load history");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [getToken]);

  return { data, loading, error };
}
