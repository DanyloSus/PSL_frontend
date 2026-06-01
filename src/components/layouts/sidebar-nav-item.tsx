import { Link, type LinkProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface Props {
  to: LinkProps["to"];
  label: string;
  icon: LucideIcon;
}

export function SidebarNavItem({ to, label, icon: IconComp }: Props) {
  return (
    <Link
      to={to}
      activeProps={{
        className:
          "border-primary bg-primary/10 text-primary [&_.nav-dot]:opacity-100"
      }}
      inactiveProps={{
        className:
          "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
      }}
      className="group flex items-center gap-2.5 rounded-sm border px-3 py-2 text-[13px] font-semibold transition-colors"
    >
      <IconComp className="size-4" />
      <span className="flex-1">{label}</span>
      <span className="nav-dot text-primary text-[10px] opacity-0 transition-opacity">
        ●
      </span>
    </Link>
  );
}
