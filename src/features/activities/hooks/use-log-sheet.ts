import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { activitiesQueryOptions } from "../api/list";
import { useLogActivity } from "../api/log";
import { ActivityInputType, type ActivityTemplateOut } from "../types/activity";
import { getLogErrorMessage } from "../utils/log-error";

function isOutOfRange(
  activity: ActivityTemplateOut,
  quantity: number
): boolean {
  return quantity < activity.min_quantity || quantity > activity.max_quantity;
}

export function useLogSheet(onClose: () => void) {
  const { data: activities } = useSuspenseQuery(activitiesQueryOptions());
  const logActivity = useLogActivity();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ActivityTemplateOut | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const visible = activities.filter(activity =>
    activity.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  const isQuantity = selected?.input_type === ActivityInputType.Quantity;

  const quantityError =
    selected && isQuantity && isOutOfRange(selected, quantity)
      ? `Enter a value between ${selected.min_quantity} and ${selected.max_quantity}`
      : null;

  const reset = () => {
    setQuery("");
    setSelected(null);
    setQuantity(1);
    setSubmitError(null);
  };

  const onQueryChange = (next: string) => {
    setQuery(next);
    setSelected(null);
    setSubmitError(null);
  };

  const onPick = (activity: ActivityTemplateOut) => {
    setSelected(activity);
    setQuantity(activity.min_quantity);
    setSubmitError(null);
  };

  const onSubmit = async () => {
    if (!selected) return;
    if (isQuantity && isOutOfRange(selected, quantity)) return;

    setSubmitError(null);

    try {
      await logActivity.mutateAsync({
        activityTemplateId: selected.id,
        quantity: isQuantity ? quantity : 1
      });
      reset();
      onClose();
    } catch (error) {
      setSubmitError(getLogErrorMessage(error));
    }
  };

  return {
    query,
    visible,
    selected,
    quantity,
    quantityError,
    submitError,
    isPending: logActivity.isPending,
    setQuantity,
    onQueryChange,
    onPick,
    onSubmit,
    reset
  };
}
