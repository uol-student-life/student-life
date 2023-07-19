import { prisma } from "../../db";
import type { Prisma } from "@prisma/client";
import { MilestoneStatus } from "@prisma/client";

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

  const updateMilestoneData: Prisma.MilestoneUpdateInput = {};

  if (body.description) {
    updateMilestoneData.description = body.description;
  }

  if (body.status) {
    updateMilestoneData.status = body.status as MilestoneStatus;
  }

  const updatedMilestone = await prisma.milestone.update({
    where: { id },
    data: updateMilestoneData,
    include: {
      journals: true,
    },
  });

  return updatedMilestone;
});
