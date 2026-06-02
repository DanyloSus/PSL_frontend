import axios from "axios";

const FALLBACK_MESSAGE = "Could not log activity. Try again.";

export function getLogErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === "object" && "detail" in data) {
      const { detail } = data as { detail: unknown };

      if (typeof detail === "string") return detail;
    }
  }

  return FALLBACK_MESSAGE;
}
