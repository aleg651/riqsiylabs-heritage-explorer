import { useRouter, useRouterState, Link } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === "/") return null;

  return (
    <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 pt-5">
      <button
        type="button"
        onClick={() => router.history.back()}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retroceder
      </button>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" /> Inicio
      </Link>
    </div>
  );
}
