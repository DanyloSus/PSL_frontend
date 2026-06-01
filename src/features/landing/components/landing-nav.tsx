import { Link } from "@tanstack/react-router";

import { BrandMark } from "@/components/brand-mark";

export function LandingNav() {
  return (
    <header className="flex items-center justify-between">
      <BrandMark size="sm" />
      <Link
        to="/login"
        className="border-border-soft text-muted-foreground hover:text-foreground hover:border-border rounded-sm border px-4 py-2 font-mono text-[11px] font-semibold tracking-[1.5px] transition-colors"
      >
        SIGN IN
      </Link>
    </header>
  );
}
