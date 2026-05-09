import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { PrepPlan } from "@/types/analysis";

export default function TimelineCard({ plan }: { plan: PrepPlan }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">
            Estimated Timeline — {plan.estimated_total_prep_days} days
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{plan.timeline_breakdown}</p>

        {plan.what_to_ignore.length > 0 && (
          <div className="mt-6 pt-5 border-t border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              What to ignore
            </h3>
            <ul className="flex flex-col gap-1.5">
              {plan.what_to_ignore.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground line-through opacity-60">
                  <span className="no-underline not-italic opacity-100">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
