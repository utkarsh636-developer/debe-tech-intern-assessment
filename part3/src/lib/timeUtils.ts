export function toUtcIsoString(date: Date): string {
  return date.toISOString();
}

export function isWithinTwoHourLockout(date: Date): boolean {
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

  const lockoutCutoffMs = Date.now() + TWO_HOURS_MS;

  return date.getTime() < lockoutCutoffMs;
}

export function formatLocalDateTime(utcIsoString: string): string {
  const date = new Date(utcIsoString);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function getMinSelectableDate(): Date {
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
  return new Date(Date.now() + TWO_HOURS_MS);
}
