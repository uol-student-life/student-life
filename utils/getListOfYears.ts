import { eachYearOfInterval, startOfYear, endOfYear, format } from "date-fns";

export const getListOfYears = ({
  startYear = 2020,
}: { startYear?: number } = {}) => {
  const currentYear = new Date().getFullYear();

  const years = eachYearOfInterval({
    start: startOfYear(new Date(startYear, 0)),
    end: endOfYear(new Date(currentYear, 0)),
  });

  return years.map((year) => format(year, "yyyy")).reverse();
};
