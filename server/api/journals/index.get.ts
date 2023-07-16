import { prisma } from "../../db";
import { stripTime } from "../../utils/date";
import { startOfMonth, endOfMonth, formatISO } from "date-fns";

export default defineEventHandler(async (event) => {
  const { month, year } = getQuery(event);
  const where: any = {};

  if (month && year) {
    where.journalDate = {
      gte: formatISO(startOfMonth(new Date(year as number, month as number))),
      lte: formatISO(endOfMonth(new Date(year as number, month as number))),
    };
  }

  const journals = await prisma.journal.findMany({
    where,
    select: {
      id: true,
      journalDate: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      journalDate: "desc",
    },
  });

  return journals.map((journal) => ({
    ...journal,
    journalDate: stripTime(journal.journalDate),
    html: journal?.content.html.toString("utf8"),
    lexical: journal?.content.lexical.toString("utf8"),
  }));
});
