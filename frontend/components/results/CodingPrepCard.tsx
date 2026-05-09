import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { PrepPlan } from "@/types/analysis";

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800",
  Medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  Hard: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
};

export default function CodingPrepCard({ plan }: { plan: PrepPlan }) {
  const { patterns } = plan.coding_prep;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Coding Prep</CardTitle>
        <p className="text-xs text-muted-foreground">LeetCode patterns ranked by priority</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {patterns.map((pattern) => (
          <div key={pattern.name} className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">{pattern.name}</h3>
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border overflow-hidden">
              {pattern.problems.map((p) => (
                <a
                  key={p.url}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors group"
                >
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {p.title}
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <Badge variant="secondary" className={difficultyColor[p.difficulty] || ""}>
                    {p.difficulty}
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
