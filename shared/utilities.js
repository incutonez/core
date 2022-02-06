export function inDateRange({ date, start, end }) {
  return date <= end && date >= start;
}