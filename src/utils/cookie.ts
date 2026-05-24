export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${encodeURIComponent(name)}=`;
  const found = document.cookie.split("; ").find(row => row.startsWith(prefix));

  return found ? decodeURIComponent(found.slice(prefix.length)) : null;
}
