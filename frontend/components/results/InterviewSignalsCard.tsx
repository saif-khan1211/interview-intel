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
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Interview Signals — {company}</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          What candidates report about this company&apos;s interview process
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
      </CardContent>
    </Card>
  );
}
