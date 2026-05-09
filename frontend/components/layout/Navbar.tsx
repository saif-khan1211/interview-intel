"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <span>Interview Intel</span>
        </Link>

        <nav className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link href="/analyze">
                <Button size="sm">New Analysis</Button>
              </Link>
              <Link
                href="/history"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                History
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button size="sm" variant="ghost">Sign in</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
