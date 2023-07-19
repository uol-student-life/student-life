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
  const milestone = await prisma.milestone.findUnique({ where: { id } });

  if (!milestone) {
    throw createError({
      statusCode: 404,
      message: "Milestone not found",
    });
  }

  const deleteMilestonesOnJournals = prisma.milestonesOnJournals.deleteMany({
    where: { milestoneId: id },
  });

  const removeMilestoneFromTasks = prisma.task.updateMany({
    where: { milestoneId: id },
    data: { milestoneId: null },
  });

  const deleteMilestone = prisma.milestone.delete({ where: { id } });

  await prisma.$transaction([
    deleteMilestonesOnJournals,
    removeMilestoneFromTasks,
    deleteMilestone,
  ]);

  return `Milestone ${id} deleted.`;
});
