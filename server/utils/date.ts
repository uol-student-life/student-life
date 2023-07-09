/**
 * Strips time from a Date object
 * @param date
 * @returns date without time
 */
export const stripTime = (date: Date) => {
  return new Date(new Date(date).toISOString().split("T")[0]);
};
