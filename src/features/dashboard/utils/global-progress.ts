function xpForLevel(level: number): number {
  return Math.round(100 * Math.pow(1.35, level - 1));
}

export interface GlobalProgress {
  into: number;
  need: number;
}

export function globalProgress(
  globalXp: number,
  globalLevel: number
): GlobalProgress {
  let consumed = 0;
  for (let level = 1; level < globalLevel; level++) {
    consumed += xpForLevel(level);
  }
  const need = xpForLevel(globalLevel);
  const into = Math.max(0, Math.min(need, globalXp - consumed));

  return { into, need };
}
