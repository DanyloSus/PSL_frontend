import { cn } from "@/utils/cn";

export function Scanlines({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-[5] mix-blend-overlay",
        className
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)"
      }}
    />
  );
}
