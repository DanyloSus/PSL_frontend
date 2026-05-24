import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard")({
  component: DashboardPage
});

function DashboardPage() {
  return (
    <div className="p-8">
      <p className="text-muted-foreground font-mono text-xs tracking-[2px]">
        DASHBOARD PLACEHOLDER
      </p>
    </div>
  );
}
