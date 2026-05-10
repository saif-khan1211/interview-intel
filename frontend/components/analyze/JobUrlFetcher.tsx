"use client";

import { useState } from "react";
import { Loader2, Link } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractJobPosting } from "@/lib/api";

interface ExtractedJob {
  company_name: string;
  role_title: string;
  jd_text: string;
}

interface Props {
  onExtracted: (data: ExtractedJob) => void;
}

export default function JobUrlFetcher({ onExtracted }: Props) {
  const { getToken } = useAuth();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = (() => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  })();

  const handleFetch = async () => {
    if (!isValidUrl || loading) return;
    setError(null);
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const result = await extractJobPosting(url, token);
      onExtracted(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch job details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="url"
            placeholder="https://boards.greenhouse.io/company/jobs/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          type="button"
          onClick={handleFetch}
          disabled={!isValidUrl || loading}
          variant="outline"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              Fetching...
            </>
          ) : (
            "Fetch details"
          )}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Works with Greenhouse, Lever, Workday, and most company career pages.
        LinkedIn is not supported — paste the description manually instead.
      </p>
    </div>
  );
}
