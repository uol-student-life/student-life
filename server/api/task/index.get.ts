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
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      journal: true,
      milestone: true,
    },
  });

  return {
    ...task,
    journalId: undefined, // remove from response
    milestoneId: undefined, // remove from response
  };
});
