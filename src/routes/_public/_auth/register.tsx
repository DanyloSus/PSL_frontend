import { Link, createFileRoute } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const Route = createFileRoute("/_public/_auth/register")({
  component: RegisterPage
});

function RegisterPage() {
  return (
    <AuthCard
      tag="NEW OPERATIVE"
      title="Create your account"
      subtitle="Pick a handle. Pick a passphrase. Save your file."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold"
          >
            Sign in →
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
