import { auth } from "@clerk/nextjs/server";
import { ArrowRight, CheckCircle, Target, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Target,
    title: "Evidence-backed priorities",
    description:
      "Know exactly what topics matter for your specific company and role, ranked by signal strength.",
  },
  {
    icon: Zap,
    title: "No analysis paralysis",
    description:
      "We tell you what to study AND what to ignore. Stop wasting prep time on irrelevant topics.",
  },
  {
    icon: CheckCircle,
    title: "Role-specific resources",
    description:
      "Curated LeetCode patterns, system design topics, and behavioral themes — nothing generic.",
  },
];

export default async function LandingPage() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-16">
      <div className="flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground border border-border rounded-full px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Free during beta
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight max-w-2xl">
          Know exactly what to study for your next interview
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
          Upload your resume, paste the job description — get a focused, evidence-backed prep plan in 60 seconds. Built for software engineers who don&apos;t have time to guess.
        </p>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <Link href="/analyze">
              <Button size="lg" className="gap-2">
                Start a new analysis <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Get started free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          3 free analyses · No credit card required
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 w-full text-left">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card"
          >
            <Icon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
