import { prisma } from "../../db";
import { stripTime } from "../../utils/date";
import {
  startOfMonth,
  endOfMonth,
  formatISO,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";
import type { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { month, year, ids, week } = getQuery(event);
  const where: Prisma.JournalWhereInput = {};

  if (month && year) {
    where.journalDate = {
      gte: formatISO(startOfMonth(new Date(year as number, month as number))),
      lte: formatISO(endOfMonth(new Date(year as number, month as number))),
    };
  } else if (month) {
    where.journalDate = {
      gte: formatISO(
        startOfMonth(new Date(new Date().getFullYear(), month as number))
      ),
      lte: formatISO(
        endOfMonth(new Date(new Date().getFullYear(), month as number))
      ),
    };
  } else if (year) {
    where.journalDate = {
      gte: formatISO(startOfMonth(new Date(year as number, 0))),
      lte: formatISO(endOfMonth(new Date(year as number, 11))),
    };
  }

  if (week) {
    // get journals for the last week
    const lastWeekStart = startOfWeek(subWeeks(new Date(), 1));
    const lastWeekEnd = endOfWeek(subWeeks(new Date(), 1));
    where.journalDate = {
      gte: formatISO(lastWeekStart),
      lte: formatISO(lastWeekEnd),
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
