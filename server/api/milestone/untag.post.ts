import { prisma } from "../../db";
import type { Prisma } from "@prisma/client";
import type { MilestoneUntagInput } from "~/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const body: MilestoneUntagInput = await readBody(event);

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

  let updateMilestone: Prisma.MilestoneUpdateInput = {};
  let needRemoveMilestoneFromJournal = false;

  if (body.from?.taskId) {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(body.from.taskId as string) as number },
      include: {
        milestone: true,
      },
    });

    if (!task) {
      throw createError({
        statusCode: 404,
        message: "Task not found",
      });
    }

    if (!task.milestone || task.milestone.id !== id) {
      throw createError({
        statusCode: 404,
        message: "Task is not linked to this milestone",
      });
    }

    updateMilestone = {
      tasks: {
        disconnect: {
          id: task.id,
        },
      },
    };
  }

  if (body.from?.journalId) {
    const journal = await prisma.journal.findUnique({
      where: { id: parseInt(body.from.journalId as string) as number },
    });

    if (!journal) {
      throw createError({
        statusCode: 404,
        message: "Journal not found",
      });
    }

    const existSuchLink = await prisma.milestonesOnJournals.findUnique({
      where: {
        journalId_milestoneId: {
          journalId: journal.id,
          milestoneId: id,
        },
      },
    });

    if (!existSuchLink) {
      throw createError({
        statusCode: 404,
        message: "No such link between milestone and journal",
      });
    }

    needRemoveMilestoneFromJournal = true;
  }

  const updatedMilestone = prisma.milestone.update({
    where: { id },
    data: updateMilestone,
    include: {
      journals: true,
      tasks: true,
    },
  });

  const removeMilestoneFromJournal = prisma.milestonesOnJournals.delete({
    where: {
      journalId_milestoneId: {
        journalId: parseInt(body.from?.journalId as string) as number,
        milestoneId: id,
      },
    },
  });

  await prisma.$transaction(
    [
      needRemoveMilestoneFromJournal ? removeMilestoneFromJournal : null,
      updatedMilestone,
    ].filter(Boolean) as any[]
  );

  return await prisma.milestone.findUnique({
    where: { id },
    include: {
      journals: true,
      tasks: true,
    },
  });
});
