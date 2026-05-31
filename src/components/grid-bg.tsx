import { cn } from "@/utils/cn";

export function GridBg({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 opacity-40",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(var(--border-soft) 1px, transparent 1px), linear-gradient(90deg, var(--border-soft) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage:
          "radial-gradient(80% 60% at 50% 30%, black 0%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(80% 60% at 50% 30%, black 0%, transparent 80%)"
      }}
    />
  );
}
