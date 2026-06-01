import { Link, createFileRoute } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export const Route = createFileRoute("/_public/_auth/login")({
  component: LoginPage
});

function LoginPage() {
  return (
    <AuthCard
      tag="SESSION RESUME"
      title="Welcome back"
      subtitle="Authenticate to resume your save file."
      footer={
        <>
          New operative?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold"
          >
            Create profile →
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
