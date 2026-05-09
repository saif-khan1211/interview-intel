import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PrepPlan } from "@/types/analysis";

export default function SystemDesignCard({ plan }: { plan: PrepPlan }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">System Design Prep</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {plan.system_design_topics.map((topic) => (
            <li key={topic} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-primary shrink-0 font-medium">·</span>
              {topic}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
