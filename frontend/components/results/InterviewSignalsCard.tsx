import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio } from "lucide-react";
import type { PrepPlan } from "@/types/analysis";

export default function InterviewSignalsCard({
  plan,
  company,
}: {
  plan: PrepPlan;
  company: string;
}) {
  const sources = plan.glassdoor_sources ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Interview Signals — {company}</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Sourced from Glassdoor interview reviews
        </p>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {plan.interview_signals.map((signal) => (
            <li key={signal} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-primary shrink-0 font-medium">·</span>
              {signal}
            </li>
          ))}
        </ul>

        {sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Sources
            </p>
            {sources.map((url, i) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline truncate"
              >
                Glassdoor review {i + 1}
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
