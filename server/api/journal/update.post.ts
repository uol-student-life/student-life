import { prisma } from "../../db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const body = await readBody(event);

  if (!query.id) {
    throw createError({
      statusCode: 400,
      message: "Missing required parameter: id",
    });
  }

  const existingJournal = await prisma.journal.findUnique({
    where: {
      id: parseInt(query.id.toString()),
    },
    select: {
      id: true,
      contentId: true,
      content: true,
      journalDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!existingJournal) {
    throw createError({
      statusCode: 404,
      message: "Journal not found",
    });
  }

  const updateContent = await prisma.content.update({
    where: { id: existingJournal.contentId },
    data: {
      content: Buffer.from(body.content, "utf8"),
    },
  });

  const updateJournal = await prisma.journal.update({
    where: { id: existingJournal.id },
    data: {
      contentId: updateContent.id,
      updatedAt: new Date(),
    },
  });

  const journal = await prisma.journal.findUnique({
    where: { id: updateJournal.id },
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
