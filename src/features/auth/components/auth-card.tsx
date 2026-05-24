import type { ReactNode } from "react";

import { BrandMark } from "@/components/brand-mark";
import { CornerFrame } from "@/components/corner-frame";
import { cn } from "@/utils/cn";

interface Props {
  tag: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
}

export function AuthCard({
  tag,
  title,
  subtitle,
  children,
  footer,
  className
}: Props) {
  return (
    <CornerFrame
      size={12}
      className={cn(
        "bg-card border-border w-full rounded-md border px-7 py-9 backdrop-blur-xl",
        className
      )}
    >
      <BrandMark size="lg" />
      <div className="mt-7 space-y-2">
        <p className="text-primary font-mono text-[10px] tracking-[2px]">
          {`// ${tag}`}
        </p>
        <h1 className="text-foreground text-[26px] leading-tight font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground text-[13px]">{subtitle}</p>
      </div>
      <div className="mt-6 space-y-4">{children}</div>
      <div className="border-border-soft text-muted-foreground mt-6 border-t pt-5 text-center text-[13px]">
        {footer}
      </div>
    </CornerFrame>
  );
}
