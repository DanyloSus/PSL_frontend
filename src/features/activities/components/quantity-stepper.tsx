import { cn } from "@/utils/cn";

interface Props {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  onChange: (next: number) => void;
}

const STEPS = [-5, -1, 1, 5];

export function QuantityStepper({
  value,
  min = 0,
  max = 600,
  unit,
  onChange
}: Props) {
  const clamp = (next: number) => Math.max(min, Math.min(max, next));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground font-mono text-[10px] tracking-[1px]">
          AMOUNT
        </span>
        <span className="text-primary text-[18px] font-bold">
          {value}
          {unit && (
            <span className="text-muted-foreground ml-1 text-[11px]">
              {unit}
            </span>
          )}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {STEPS.map(step => (
          <button
            key={step}
            type="button"
            onClick={() => onChange(clamp(value + step))}
            className={cn(
              "border-border-soft text-foreground h-8 min-w-8 rounded-sm border px-2 font-mono text-[11px] font-semibold"
            )}
          >
            {step > 0 ? `+${step}` : step}
          </button>
        ))}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={event => onChange(Number(event.target.value))}
          className="accent-primary flex-1"
        />
      </div>
    </div>
  );
}
