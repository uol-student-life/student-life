import { prisma } from "../../db";
import { stripTime } from "../../utils/date";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const existingJournal = await prisma.journal.findFirst({
    where: {
      journalDate: stripTime(body.journalDate),
    },
  });

  if (existingJournal) {
    throw createError({
      statusCode: 400,
      message: "Journal already exists for this date",
    });
  }

  const newContent = await prisma.content.create({
    data: {
      content: Buffer.from(body.content, "utf8"),
    },
  });

  const newJournal = await prisma.journal.create({
    data: {
      contentId: newContent.id,
      journalDate: stripTime(body.journalDate),
    },
  });

  const journal = await prisma.journal.findUnique({
    where: { id: newJournal.id },
    select: {
      id: true,
      content: true,
      journalDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    ...journal,
    content: journal?.content.content.toString("utf8"),
  };
});
