import { prisma } from "../../db";
import { TaskStatus, MilestoneStatus } from "@prisma/client";
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

  if (body.status && !["INPROGRESS", "COMPLETED"].includes(body.status)) {
    body.status = "INPROGRESS";
  }

  let createMilestone: Prisma.MilestoneCreateInput = {
    description: body.description,
    status: (body.status as MilestoneStatus) || MilestoneStatus.INPROGRESS,
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

    createMilestone.tasks = {
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

    createMilestone.tasks = {
      create: createTask,
    };
  }

  const newMilestone = await prisma.milestone.create({
    data: createMilestone,
  });

  if (body.to?.journalId) {
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

    await prisma.milestonesOnJournals.create({
      data: {
        journalId: journal.id,
        milestoneId: newMilestone.id,
      },
    });
  }

  const milestone = await prisma.milestone.findUnique({
    where: { id: newMilestone.id },
    include: {
      journals: true,
      tasks: true,
    },
  });

  return milestone;
});
