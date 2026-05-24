import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
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

import { QuantityStepper } from "./quantity-stepper";
import { activitiesQueryOptions } from "../api/list";
import { useLogActivity } from "../api/log";
import type { ActivityTemplateOut } from "../types/activity";

const TAG_NEW_ENTRY = "// NEW ENTRY";
const TAG_NO_MATCHES = "// NO MATCHES";

interface Props {
  isOpen: boolean;
  onOpenChange: (isNextOpen: boolean) => void;
}

export function LogSheet({ isOpen, onOpenChange }: Props) {
  const { data: activities } = useSuspenseQuery(activitiesQueryOptions());
  const logActivity = useLogActivity();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ActivityTemplateOut | null>(null);
  const [quantity, setQuantity] = useState(1);

  const visible = activities.filter(activity =>
    activity.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  const reset = () => {
    setQuery("");
    setSelected(null);
    setQuantity(1);
  };

  const onPick = (activity: ActivityTemplateOut) => {
    setSelected(activity);
    setQuantity(1);
  };

  const onSubmit = async () => {
    if (!selected) return;
    await logActivity.mutateAsync({
      activityTemplateId: selected.id,
      quantity: selected.input_type === "QUANTITY" ? quantity : 1
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={isNextOpen => {
        if (!isNextOpen) reset();
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
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              setSelected(null);
            }}
            placeholder="Search activities…"
            className="h-7 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="mt-3 grid max-h-[40dvh] grid-cols-2 gap-2 overflow-y-auto">
          {visible.map(activity => (
            <button
              key={activity.id}
              type="button"
              onClick={() => onPick(activity)}
              className={cn(
                "border-border-soft rounded-sm border bg-white/[0.02] p-2.5 text-left transition-colors",
                selected?.id === activity.id &&
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
                {activity.input_type === "QUANTITY" ? "QUANTIFIED" : "BINARY"}
              </div>
            </button>
          ))}
          {visible.length === 0 && (
            <p className="text-faint col-span-2 py-6 text-center font-mono text-[11px] tracking-[1px]">
              {TAG_NO_MATCHES}
            </p>
          )}
        </div>
        {selected && (
          <div className="border-border-soft mt-3 border-t pt-3">
            {selected.input_type === "QUANTITY" && (
              <QuantityStepper
                value={quantity}
                min={1}
                max={selected.effects.length ? 600 : 600}
                onChange={setQuantity}
              />
            )}
            <Button
              type="button"
              onClick={onSubmit}
              disabled={logActivity.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow mt-3 h-12 w-full text-sm font-bold tracking-[1px]"
            >
              {logActivity.isPending ? "LOGGING…" : "CONFIRM LOG"}
              {!logActivity.isPending && <ChevronRight className="size-4" />}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
