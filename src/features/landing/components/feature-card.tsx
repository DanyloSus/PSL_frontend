import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: IconComp, title, description }: Props) {
  return (
    <div className="border-border-soft bg-card/60 rounded-md border p-5 backdrop-blur-xl">
      <div className="border-primary/30 bg-primary/10 text-primary grid size-9 place-items-center rounded-sm border">
        <IconComp className="size-4" />
      </div>
      <h3 className="text-foreground mt-4 text-[15px] font-bold">{title}</h3>
      <p className="text-muted-foreground mt-1.5 text-[13px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
