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
  });

  if (!task) {
    throw createError({
      statusCode: 404,
      message: "Task not found",
    });
  }

  await prisma.task.delete({
    where: { id },
  });

  return `Task ${id} deleted.`;
});
