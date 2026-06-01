const LOCALE = "en-US";

export function formatTime(date: Date): string {
  return date.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}
