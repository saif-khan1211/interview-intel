import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PrepPlan } from "@/types/analysis";

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 75 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500";

  return (
    <div className={`text-5xl font-bold tabular-nums ${color}`}>
      {score}
      <span className="text-2xl text-muted-foreground">/100</span>
    </div>
  );
}

export default function MatchSummaryCard({
  plan,
  company,
  role,
}: {
  plan: PrepPlan;
  company: string;
  role: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Match Summary</CardTitle>
        <p className="text-xs text-muted-foreground">
          {role} at {company}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-start gap-6">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <ScoreRing score={plan.fit_score} />
          <p className="text-xs text-muted-foreground">Fit score</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{plan.match_summary}</p>
      </CardContent>
    </Card>
  );
}
