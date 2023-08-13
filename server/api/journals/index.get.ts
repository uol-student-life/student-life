import { prisma } from "../../db";
import { stripTime } from "../../utils/date";
import { startOfMonth, endOfMonth, formatISO } from "date-fns";
import type { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { month, year, ids } = getQuery(event);
  const where: Prisma.JournalWhereInput = {};

  if (month && year) {
    where.journalDate = {
      gte: formatISO(startOfMonth(new Date(year as number, month as number))),
      lte: formatISO(endOfMonth(new Date(year as number, month as number))),
    };
  }

  if (ids) {
    where.id = {
      in: (ids as string).split(",").map(Number),
    };
  }

  const journals = await prisma.journal.findMany({
    where,
    select: {
      id: true,
      journalDate: true,
      content: true,
      mood: true,
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
