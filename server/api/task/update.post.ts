import { prisma } from "../../db";
import type { Prisma, TaskStatus } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const body = (await readBody(event)) || {};

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

  if (!task) {
    throw createError({
      statusCode: 404,
      message: "Task not found",
    });
  }

  let taskUpdate: Prisma.TaskUpdateInput = {
    description: task.description,
  };

  if (body.description && task.description !== body.description)
    taskUpdate.description = body.description;

  if ((body.status as TaskStatus) && task.status !== body.status)
    taskUpdate.status = body.status as TaskStatus;

  if (body.dueDate !== undefined && task.dueDate !== body.dueDate)
    taskUpdate.dueDate = body.dueDate;

  if (body.journalId !== undefined && task.journalId !== body.journalId) {
    if (body.journalId === null) {
      taskUpdate = {
        ...taskUpdate,
        journal: {
          disconnect: true,
        },
      };
    } else {
      const newJournal = await prisma.journal.findUnique({
        where: { id: parseInt(body.journalId) as number },
      });

      if (!newJournal) {
        throw createError({
          statusCode: 400,
          message: "Journal not found",
        });
      }

      taskUpdate.journal = {
        connect: {
          id: newJournal.id,
        },
      };
    }
  }

  if (body.milestoneId && task.milestoneId !== body.milestoneId) {
    if (body.milestoneId === null) {
      taskUpdate = {
        ...taskUpdate,
        milestone: {
          disconnect: true,
        },
      };
    } else {
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

      taskUpdate.milestone = {
        connect: {
          id: milestone.id,
        },
      };
    }
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { ...taskUpdate },
    include: {
      journal: true,
      milestone: true,
    },
  });

  return {
    ...updatedTask,
    journalId: undefined, // remove from response
    milestoneId: undefined, // remove from response
  };
});
