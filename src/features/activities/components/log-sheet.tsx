import { ChevronRight, Search } from "lucide-react";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/ui/sheet";
import { cn } from "@/utils/cn";

import { EffectPreview } from "./effect-preview";
import { QuantityStepper } from "./quantity-stepper";
import { useLogSheet } from "../hooks/use-log-sheet";
import { ActivityInputType } from "../types/activity";

const TAG_NEW_ENTRY = "// NEW ENTRY";
const TAG_NO_MATCHES = "// NO MATCHES";

const INPUT_TYPE_LABEL: Record<ActivityInputType, string> = {
  [ActivityInputType.Binary]: "BINARY",
  [ActivityInputType.Quantity]: "QUANTIFIED"
};

interface Props {
  isOpen: boolean;
  onOpenChange: (isNextOpen: boolean) => void;
  statShortById: Map<string, string>;
}

export function LogSheet({ isOpen, onOpenChange, statShortById }: Props) {
  const sheet = useLogSheet(() => onOpenChange(false));

  return (
    <Sheet
      open={isOpen}
      onOpenChange={isNextOpen => {
        if (!isNextOpen) sheet.reset();
        onOpenChange(isNextOpen);
      }}
    >
      <SheetContent
        side="bottom"
        className="bg-popover border-border h-[85dvh] rounded-t-xl border-t px-4 pt-3 pb-6"
      >
        <SheetHeader className="px-0 text-left">
          <p className="text-muted-foreground font-mono text-[9px] tracking-[1.5px]">
            {TAG_NEW_ENTRY}
          </p>
          <SheetTitle className="text-foreground text-[20px] font-bold">
            Log activity
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-[13px]">
            Pick what you did. XP applies instantly.
          </SheetDescription>
        </SheetHeader>
        <div className="border-border-soft mt-3 flex items-center gap-2 rounded-sm border bg-white/[0.03] px-3 py-2">
          <Search className="text-muted-foreground size-4" />
          <Input
            value={sheet.query}
            onChange={event => sheet.onQueryChange(event.target.value)}
            placeholder="Search activities…"
            className="h-7 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="mt-3 grid max-h-[40dvh] grid-cols-2 gap-2 overflow-y-auto">
          {sheet.visible.map(activity => (
            <button
              key={activity.id}
              type="button"
              onClick={() => sheet.onPick(activity)}
              className={cn(
                "border-border-soft rounded-sm border bg-white/[0.02] p-2.5 text-left transition-colors",
                sheet.selected?.id === activity.id &&
                  "border-primary shadow-[0_0_14px_rgba(214,255,0,0.4)]"
              )}
            >
              <div className="text-acid-2 font-mono text-[9px] tracking-[1px]">
                + LOG
              </div>
              <div className="text-foreground mt-1 text-[13px] leading-tight font-semibold">
                {activity.title}
              </div>
              <div className="text-muted-foreground mt-1 font-mono text-[10px]">
                {INPUT_TYPE_LABEL[activity.input_type]}
              </div>
              <EffectPreview
                effects={activity.effects}
                statShortById={statShortById}
              />
            </button>
          ))}
          {sheet.visible.length === 0 && (
            <p className="text-faint col-span-2 py-6 text-center font-mono text-[11px] tracking-[1px]">
              {TAG_NO_MATCHES}
            </p>
          )}
        </div>
        {sheet.selected && (
          <div className="border-border-soft mt-3 border-t pt-3">
            {sheet.selected.input_type === ActivityInputType.Quantity && (
              <>
                <QuantityStepper
                  value={sheet.quantity}
                  min={sheet.selected.min_quantity}
                  max={sheet.selected.max_quantity}
                  onChange={sheet.setQuantity}
                />
                {sheet.quantityError && (
                  <p
                    role="alert"
                    aria-live="assertive"
                    className="text-danger mt-2 font-mono text-[11px] tracking-[0.5px]"
                  >
                    {sheet.quantityError}
                  </p>
                )}
              </>
            )}
            {sheet.submitError && (
              <p
                role="alert"
                aria-live="assertive"
                className="border-destructive/40 bg-destructive/10 text-destructive mt-3 rounded-sm border px-3 py-2 font-mono text-[11px] tracking-[0.5px]"
              >
                {sheet.submitError}
              </p>
            )}
            <Button
              type="button"
              onClick={sheet.onSubmit}
              disabled={sheet.isPending || Boolean(sheet.quantityError)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow mt-3 h-12 w-full text-sm font-bold tracking-[1px]"
            >
              {sheet.isPending ? "LOGGING…" : "CONFIRM LOG"}
              {!sheet.isPending && <ChevronRight className="size-4" />}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
