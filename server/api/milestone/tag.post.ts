import { prisma } from "../../db";
import type { Prisma } from "@prisma/client";
import { TaskStatus } from "@prisma/client";
import { MilestoneTagInput } from "~/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const body: MilestoneTagInput = await readBody(event);

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

  if (body.to?.journalId) {
    const journal = await prisma.journal.findUnique({
      where: { id: parseInt(body.to.journalId as string) as number },
    });

    if (!journal) {
      throw createError({
        statusCode: 404,
        message: "Journal not found",
      });
    }

    try {
      await prisma.milestonesOnJournals.create({
        data: {
          journal: {
            connect: {
              id: journal.id,
            },
          },
          milestone: {
            connect: {
              id: milestone.id,
            },
          },
        },
      });
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error;
      }
    }
  }

  if (body.create?.task && body.to?.taskId) {
    throw createError({
      statusCode: 400,
      message: "Cannot create and tag task at the same time",
    });
  }

  if (body.to?.taskId) {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(body.to.taskId as string) as number },
    });

    if (!task) {
      throw createError({
        statusCode: 404,
        message: "Task not found",
      });
    }

    updateMilestone.tasks = {
      connect: {
        id: task.id,
      },
    };
  }

  if (body.create?.task && !body.create.task.description) {
    throw createError({
      statusCode: 400,
      message: "Task description is required",
    });
  }

  if (body.create?.task) {
    let dueDate: Date | null = null;
    if (body.create?.task.dueDate) {
      dueDate = new Date(body.create?.task.dueDate);
    }

    let createTask: Prisma.TaskCreateInput = {
      description: body.create?.task.description as string,
      dueDate: dueDate,
      status: (body.create?.task.status as TaskStatus) || TaskStatus.TODO,
    };

    if (body.to?.journalId) {
      createTask.journal = {
        connect: {
          id: parseInt(body.to.journalId as string) as number,
        },
      };
    }

    updateMilestone.tasks = {
      create: createTask,
    };
  }

  const updatedMilestone = await prisma.milestone.update({
    where: { id },
    data: updateMilestone,
    include: {
      journals: true,
      tasks: true,
    },
  });

  return updatedMilestone;
});
