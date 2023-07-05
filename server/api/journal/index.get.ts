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
      id: true,
      content: true,
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
    content: journal?.content.content.toString("utf8"),
  };
});
