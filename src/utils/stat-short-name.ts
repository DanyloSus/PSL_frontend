const SHORT_NAME_LENGTH = 3;

export function statShortName(key: string): string {
  return key.toUpperCase().slice(0, SHORT_NAME_LENGTH);
}
