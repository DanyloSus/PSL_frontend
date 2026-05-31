import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { activitiesQueryOptions } from "../api/list";
import { useLogActivity } from "../api/log";
import type { ActivityTemplateOut } from "../types/activity";

export const MAX_QUANTITY = 600;

export function useLogSheet(onClose: () => void) {
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

  const onQueryChange = (next: string) => {
    setQuery(next);
    setSelected(null);
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
    onClose();
  };

  return {
    query,
    visible,
    selected,
    quantity,
    isPending: logActivity.isPending,
    setQuantity,
    onQueryChange,
    onPick,
    onSubmit,
    reset
  };
}
