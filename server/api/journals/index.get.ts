import { prisma } from "../../db";
import { stripTime } from "../../utils/date";

export default defineEventHandler(async (event) => {
  const journals = await prisma.journal.findMany({
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
