export function timeAgo(input: string | number | Date): string {
  const target = new Date(input).getTime();
  const diff = Date.now() - target;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${Math.max(0, minutes)}M`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H`;

  return `${Math.floor(hours / 24)}D`;
}
