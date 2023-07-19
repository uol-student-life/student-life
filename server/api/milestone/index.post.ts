import { prisma } from "../../db";
import { TaskStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { MilestoneCreateInput } from "~/types";

export default defineEventHandler(async (event) => {
  const body: MilestoneCreateInput = await readBody(event);

  if (!body.description) {
    throw createError({
      statusCode: 400,
      message: "body.description is required",
    });
  }

  if (!body.to?.journalId) {
    throw createError({
      statusCode: 400,
      message: "body.journalId is required",
    });
  }

  const journal = await prisma.journal.findUnique({
    where: { id: parseInt(body.to.journalId as string) as number },
    select: { id: true },
  });

  if (!journal) {
    throw createError({
      statusCode: 400,
      message: "Journal not found",
    });
  }

  let createMilestone: Prisma.MilestonesOnJournalsCreateInput = {
    journal: {
      connect: { id: journal.id },
    },
    milestone: {
      create: {
        description: body.description,
      },
    },
  };

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

    createMilestone.milestone.create!.tasks = {
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

    createMilestone.milestone.create!.tasks = {
      create: createTask,
    };
  }

  const newMilestoneOnJournal = await prisma.milestonesOnJournals.create({
    data: createMilestone,
  });

  const newMilestone = prisma.milestone.findUnique({
    where: { id: newMilestoneOnJournal.milestoneId },
    include: {
      journals: true,
      tasks: true,
    },
  });

  return newMilestone;
});
