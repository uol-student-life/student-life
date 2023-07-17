import { prisma } from "../../db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  if (!query.id) {
    throw createError({
      statusCode: 400,
      message: "body.milestoneId is required",
    });
  }

  const milestone = await prisma.milestone.findUnique({
    where: { id: parseInt(query.id.toString()) as number },
    include: {
      journals: true,
    },
  });

  if (!milestone) {
    throw createError({
      statusCode: 400,
      message: "Milestone not found",
    });
  }

  return milestone;
});
