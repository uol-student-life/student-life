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

  const id = parseInt(query.id.toString());
  const milestone = await prisma.milestone.findUnique({ where: { id } });

  if (!milestone) {
    throw createError({
      statusCode: 404,
      message: "Milestone not found",
    });
  }

  const updatedMilestone = await prisma.milestone.update({
    where: { id },
    data: {
      description: body.description,
    },
    include: {
      journals: true,
    },
  });

  return updatedMilestone;
});
