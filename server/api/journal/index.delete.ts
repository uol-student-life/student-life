import { prisma } from "../../db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  if (!query.id) {
    throw createError({
      statusCode: 400,
      message: "Missing required parameter: id",
    });
  }

  const id = parseInt(query.id.toString());

  const journal = await prisma.journal.findUnique({
    where: { id },
    select: {
      contentId: true,
    },
  });

  if (!journal) {
    throw createError({
      statusCode: 404,
      message: "Journal not found",
    });
  }

  const deleteJournal = await prisma.journal.delete({
    where: { id },
  });

  const deleteContent = await prisma.content.delete({
    where: { id: journal.contentId },
  });

  return `Journal ${id} deleted.`;
});
