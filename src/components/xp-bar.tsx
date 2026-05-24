import { useEffect, useState } from "react";

import { cn } from "@/utils/cn";

interface Props {
  value: number;
  max: number;
  height?: number;
  isSegmented?: boolean;
  className?: string;
}

export function XpBar({
  value,
  max,
  height = 8,
  isSegmented = true,
  className
}: Props) {
  const safeMax = Math.max(1, max);
  const target = Math.max(0, Math.min(100, (value / safeMax) * 100));
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPct(target));

    return () => cancelAnimationFrame(id);
  }, [target]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-sm border bg-white/5",
        className
      )}
      style={{ height }}
    >
      <div
        className="absolute inset-y-0 left-0 transition-[width] duration-700 ease-out"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, var(--acid), var(--acid-2))",
          boxShadow: "0 0 10px rgba(214, 255, 0, 0.55)"
        }}
      >
        <span
          aria-hidden
          className="animate-sweep pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background:
              "linear-gradient(90deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)"
          }}
        />
      </div>
      {isSegmented && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 calc(10% - 1px), var(--background) calc(10% - 1px) 10%)"
          }}
        />
      )}
    </div>
  );
}
