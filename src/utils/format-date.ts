const LOCALE = "en-US";

export function formatDate(date: Date): string {
  const weekday = date.toLocaleDateString(LOCALE, { weekday: "short" });
  const month = date.toLocaleDateString(LOCALE, { month: "short" });

  return `${weekday}, ${month} ${date.getDate()}`.toUpperCase();
}
