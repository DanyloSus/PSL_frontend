import { cn } from "@/utils/cn";

interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { box: "size-8", letter: "text-base", title: "text-sm" },
  md: { box: "size-10", letter: "text-xl", title: "text-base" },
  lg: { box: "size-14", letter: "text-3xl", title: "text-[22px]" }
} as const;

export function BrandMark({ size = "md", className }: Props) {
  const dims = SIZES[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "bg-primary text-primary-foreground shadow-glow grid place-items-center font-extrabold",
          dims.box,
          dims.letter
        )}
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 72%, 86% 100%, 0 100%)"
        }}
      >
        P
      </div>
      <div>
        <div
          className={cn(
            "text-foreground leading-none font-bold tracking-[3px]",
            dims.title
          )}
        >
          PSL
        </div>
        <div className="text-muted-foreground mt-1 font-mono text-[9px] tracking-[1.5px]">
          PERSONAL.STAT.LOG
        </div>
      </div>
    </div>
  );
}
