import { AxiosError, type AxiosResponse } from "axios";
import { describe, expect, it } from "vitest";

import { getLogErrorMessage } from "./log-error";

function axiosErrorWith(data: unknown): AxiosError {
  const response = {
    data,
    status: 422,
    statusText: "",
    headers: {},
    config: {}
  } as unknown as AxiosResponse;

  return new AxiosError(
    "failed",
    "ERR_BAD_REQUEST",
    undefined,
    undefined,
    response
  );
}

describe("getLogErrorMessage", () => {
  it("returns the server detail string from a 422", () => {
    const error = axiosErrorWith({
      detail: "quantity must be between 1 and 100"
    });

    expect(getLogErrorMessage(error)).toBe(
      "quantity must be between 1 and 100"
    );
  });

  it("falls back when detail is missing", () => {
    const error = axiosErrorWith({ message: "nope" });

    expect(getLogErrorMessage(error)).toBe(
      "Could not log activity. Try again."
    );
  });

  it("falls back for non-axios errors", () => {
    expect(getLogErrorMessage(new Error("boom"))).toBe(
      "Could not log activity. Try again."
    );
  });
});
