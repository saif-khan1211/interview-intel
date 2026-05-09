import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PrepPlan } from "@/types/analysis";

export default function StrengthsGapsCard({ plan }: { plan: PrepPlan }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Strengths & Gaps</CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
            Strengths
          </h3>
          <div className="flex flex-wrap gap-2">
            {plan.strengths.map((s) => (
              <Badge key={s} variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800">
                {s}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
            Skill Gaps
          </h3>
          <div className="flex flex-wrap gap-2">
            {plan.skill_gaps.map((g) => (
              <Badge key={g} variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                {g}
              </Badge>
            ))}
          </div>
          {plan.interviewer_concerns.length > 0 && (
            <>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-2">
                Likely interviewer concerns
              </h3>
              <ul className="flex flex-col gap-1">
                {plan.interviewer_concerns.map((c) => (
                  <li key={c} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-amber-500 shrink-0">·</span>
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
