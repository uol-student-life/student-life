import { prisma } from "../../db";
import { TaskStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.description) {
    throw createError({
      statusCode: 400,
      message: "body.description is required",
    });
  }

  if (body.status && !["TODO", "DONE"].includes(body.status)) {
    body.status = "TODO";
  }

  let task: Prisma.TaskCreateInput = {
    description: body.description as string,
    dueDate: body.dueDate || null,
    status: (body.status as TaskStatus) || TaskStatus.TODO,
  };

  if (body.journalId) {
    const journal = await prisma.journal.findUnique({
      where: { id: parseInt(body.journalId) as number },
    });

    if (!journal) {
      throw createError({
        statusCode: 400,
        message: "Journal not found",
      });
    }

    task = {
      ...task,
      journal: {
        connect: {
          id: journal.id,
        },
      },
    };
  }

  if (body.milestoneId) {
    const milestone = await prisma.milestone.findUnique({
      where: { id: parseInt(body.milestoneId) as number },
      select: {
        id: true,
      },
    });

    if (!milestone) {
      throw createError({
        statusCode: 400,
        message: "Milestone not found",
      });
    }

    task = {
      ...task,
      milestone: {
        connect: {
          id: milestone.id,
        },
      },
    };
  }

  const newTask = await prisma.task.create({
    data: { ...task },
  });

  return {
    ...newTask,
  };
});
