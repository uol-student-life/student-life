import { startOfWeek, subWeeks, format, addDays } from "date-fns";

export const getWeekLabels = () => {
  const currentDate = new Date();
  const currentWeekStart = startOfWeek(currentDate);

  const previousWeekStart = startOfWeek(subWeeks(currentWeekStart, 1));

  const daysInPreviousWeek = [];
  for (let i = 0; i <= 6; i++) {
    const day = addDays(previousWeekStart, i);
    const label = format(day, "E");
    daysInPreviousWeek.push(label);
  }

  return daysInPreviousWeek;
};
