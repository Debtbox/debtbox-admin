export function formatDate(
  locale: string,
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(dateString);
  return date.toLocaleString(locale, options);
}
