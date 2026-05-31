import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

interface Props {
  children: ReactNode;
  className?: string;
  size?: number;
  inset?: number;
}

const CORNERS = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
] as const;

export function CornerFrame({
  children,
  className,
  size = 10,
  inset = 6
}: Props) {
  return (
    <div className={cn("relative", className)}>
      {CORNERS.map(corner => {
        const isTop = corner.startsWith("top");
        const isLeft = corner.endsWith("left");

        return (
          <span
            key={corner}
            aria-hidden
            className="border-primary pointer-events-none absolute"
            style={{
              width: size,
              height: size,
              top: isTop ? inset : undefined,
              bottom: isTop ? undefined : inset,
              left: isLeft ? inset : undefined,
              right: isLeft ? undefined : inset,
              borderTopWidth: isTop ? 1 : 0,
              borderBottomWidth: isTop ? 0 : 1,
              borderLeftWidth: isLeft ? 1 : 0,
              borderRightWidth: isLeft ? 0 : 1
            }}
          />
        );
      })}
      {children}
    </div>
  );
}
