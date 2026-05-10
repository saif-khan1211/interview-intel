import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PrepPlan } from "@/types/analysis";

export default function StrengthsGapsCard({ plan }: { plan: PrepPlan }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Strengths & Gaps</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
              Strengths
            </h3>
            <ul className="flex flex-col gap-2">
              {plan.strengths.map((s) => (
                <li key={s} className="flex gap-2 text-sm text-foreground">
                  <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
              Skill Gaps
            </h3>
            <ul className="flex flex-col gap-2">
              {plan.skill_gaps.map((g) => (
                <li key={g} className="flex gap-2 text-sm text-foreground">
                  <span className="text-amber-500 shrink-0 mt-0.5">✗</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {plan.interviewer_concerns.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Likely Interviewer Concerns
            </h3>
            <ul className="flex flex-col gap-2">
              {plan.interviewer_concerns.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-amber-500 shrink-0 mt-0.5">·</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
