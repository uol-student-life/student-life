import { prisma } from "../../db";
import type { Prisma } from "@prisma/client";

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
      html: Buffer.from(body.html, "utf8"),
      lexical: Buffer.from(body.lexical, "utf8"),
    },
  });

  let updateJournalData: Prisma.JournalUpdateInput = {
    updatedAt: new Date(),
  };

  if (body.mood !== undefined) {
    updateJournalData.mood = body.mood;
  }

  const updateJournal = await prisma.journal.update({
    where: { id: existingJournal.id },
    data: updateJournalData,
  });

  const journal = await prisma.journal.findUnique({
    where: { id: updateJournal.id },
    select: {
      id: true,
      content: true,
      mood: true,
      journalDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    ...journal,
    content: undefined, // remove content from response
    html: journal?.content.html.toString("utf8"),
    lexical: journal?.content.lexical.toString("utf8"),
  };
});
