import { useSuspenseQuery } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLogSheet } from "./use-log-sheet";
import { ActivityInputType, type ActivityTemplateOut } from "../types/activity";

vi.mock("@tanstack/react-query", async importOriginal => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();

  return { ...actual, useSuspenseQuery: vi.fn() };
});

vi.mock("../api/list", () => ({
  activitiesQueryOptions: () => ({})
}));

const mutateAsync = vi.fn();

vi.mock("../api/log", () => ({
  useLogActivity: () => ({ mutateAsync, isPending: false })
}));

vi.mock("../utils/log-error", () => ({
  getLogErrorMessage: () => "server says no"
}));

const QUANTITY_TEMPLATE: ActivityTemplateOut = {
  id: "q1",
  title: "Workout",
  description: "",
  input_type: ActivityInputType.Quantity,
  is_enabled: true,
  min_quantity: 5,
  max_quantity: 50,
  effects: []
};

const BINARY_TEMPLATE: ActivityTemplateOut = {
  id: "b1",
  title: "Meditate",
  description: "",
  input_type: ActivityInputType.Binary,
  is_enabled: true,
  min_quantity: 1,
  max_quantity: 1,
  effects: []
};

beforeEach(() => {
  mutateAsync.mockReset();
  mutateAsync.mockResolvedValue(undefined);
  vi.mocked(useSuspenseQuery).mockReturnValue({
    data: [QUANTITY_TEMPLATE, BINARY_TEMPLATE]
  } as unknown as ReturnType<typeof useSuspenseQuery>);
});

describe("useLogSheet", () => {
  it("defaults quantity to the template min on pick", () => {
    const { result } = renderHook(() => useLogSheet(vi.fn()));

    act(() => result.current.onPick(QUANTITY_TEMPLATE));

    expect(result.current.quantity).toBe(5);
    expect(result.current.quantityError).toBeNull();
  });

  it("flags an out-of-range quantity and blocks submission", async () => {
    const { result } = renderHook(() => useLogSheet(vi.fn()));

    act(() => result.current.onPick(QUANTITY_TEMPLATE));
    act(() => result.current.setQuantity(99));

    expect(result.current.quantityError).toBe("Enter a value between 5 and 50");

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("logs a binary template with quantity 1", async () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useLogSheet(onClose));

    act(() => result.current.onPick(BINARY_TEMPLATE));

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mutateAsync).toHaveBeenCalledWith({
      activityTemplateId: "b1",
      quantity: 1
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("surfaces a server error message on rejection", async () => {
    mutateAsync.mockRejectedValue(new Error("422"));
    const { result } = renderHook(() => useLogSheet(vi.fn()));

    act(() => result.current.onPick(QUANTITY_TEMPLATE));
    act(() => result.current.setQuantity(10));

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() =>
      expect(result.current.submitError).toBe("server says no")
    );
  });
});
