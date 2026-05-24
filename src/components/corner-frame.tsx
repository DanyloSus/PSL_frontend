import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

interface Props {
  children: ReactNode;
  className?: string;
  size?: number;
  inset?: number;
}

interface Corner {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  bt: boolean;
  bb: boolean;
  bl: boolean;
  br: boolean;
}

export function CornerFrame({
  children,
  className,
  size = 10,
  inset = 6
}: Props) {
  const corners: Corner[] = [
    { top: inset, left: inset, bt: true, bl: true, bb: false, br: false },
    { top: inset, right: inset, bt: true, br: true, bb: false, bl: false },
    { bottom: inset, left: inset, bb: true, bl: true, bt: false, br: false },
    { bottom: inset, right: inset, bb: true, br: true, bt: false, bl: false }
  ];

  return (
    <div className={cn("relative", className)}>
      {corners.map((corner, index) => (
        <span
          key={index}
          aria-hidden
          className="border-primary pointer-events-none absolute"
          style={{
            width: size,
            height: size,
            top: corner.top,
            left: corner.left,
            right: corner.right,
            bottom: corner.bottom,
            borderTopWidth: corner.bt ? 1 : 0,
            borderBottomWidth: corner.bb ? 1 : 0,
            borderLeftWidth: corner.bl ? 1 : 0,
            borderRightWidth: corner.br ? 1 : 0
          }}
        />
      ))}
      {children}
    </div>
  );
}
