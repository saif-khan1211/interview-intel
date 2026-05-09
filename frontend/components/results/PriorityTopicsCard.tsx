import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PrepPlan, PriorityTopic } from "@/types/analysis";

function TopicList({ topics }: { topics: PriorityTopic[] }) {
  if (!topics.length) return <p className="text-sm text-muted-foreground">None identified.</p>;
  return (
    <div className="flex flex-col gap-3">
      {topics.map((t) => (
        <div key={t.topic} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground">{t.topic}</span>
            <span className="text-xs text-muted-foreground shrink-0">{t.estimated_hours}h</span>
          </div>
          <p className="text-xs text-muted-foreground">{t.why}</p>
        </div>
      ))}
    </div>
  );
}

export default function PriorityTopicsCard({ plan }: { plan: PrepPlan }) {
  const totalHigh = plan.high_priority_topics.reduce((s, t) => s + t.estimated_hours, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Study Priorities</CardTitle>
          <Badge variant="outline">{plan.estimated_total_prep_days} days total</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="high">
          <TabsList className="mb-4">
            <TabsTrigger value="high">
              High <span className="ml-1 text-xs text-muted-foreground">({plan.high_priority_topics.length})</span>
            </TabsTrigger>
            <TabsTrigger value="medium">
              Medium <span className="ml-1 text-xs text-muted-foreground">({plan.medium_priority_topics.length})</span>
            </TabsTrigger>
            <TabsTrigger value="low">
              Low <span className="ml-1 text-xs text-muted-foreground">({plan.low_priority_topics.length})</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="high"><TopicList topics={plan.high_priority_topics} /></TabsContent>
          <TabsContent value="medium"><TopicList topics={plan.medium_priority_topics} /></TabsContent>
          <TabsContent value="low"><TopicList topics={plan.low_priority_topics} /></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
