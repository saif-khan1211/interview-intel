import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PrepPlan } from "@/types/analysis";

export default function BehavioralCard({ plan }: { plan: PrepPlan }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Behavioral Prep</CardTitle>
        <p className="text-xs text-muted-foreground">Prepare STAR stories for these themes</p>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {plan.behavioral_focus.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-primary shrink-0 font-medium">·</span>
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
