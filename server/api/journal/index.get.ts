import { prisma } from "../../db";
import type { Prisma } from "@prisma/client";
import { stripTime } from "../../utils/date";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const where: Prisma.JournalWhereUniqueInput = {};

  if (!query.id && !query.journalDate) {
    throw createError({
      statusCode: 400,
      message: "Missing required parameter: id or journalDate",
    });
  }

  if (query.id) {
    where.id = parseInt(query.id.toString());
  }

  if (query.journalDate) {
    where.journalDate = stripTime(new Date(query.journalDate as string));
  }

  const journal = await prisma.journal.findUnique({
    where,
    select: {
      id: true,
      content: true,
      mood: true,
      journalDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!journal) {
    throw createError({
      statusCode: 404,
      message: "Journal not found",
    });
  }

  return {
    ...journal,
    content: undefined, // remove content from response
    html: journal?.content.html.toString("utf8"),
    lexical: journal?.content.lexical.toString("utf8"),
  };
});
