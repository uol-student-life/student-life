import { prisma } from "../../db";
import { TaskStatus } from "@prisma/client";
import type { FilterInput } from "~/types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const filter: FilterInput = body || {};

  const tasks = await prisma.task.findMany({
    where:
      {
        description: {
          contains: filter?.filters?.description || "",
        },
        status: {
          equals: (filter?.filters?.status as TaskStatus) || undefined,
        },
        dueDate: {
          equals: filter?.filters?.dueDate || undefined,
        },
        journalId: {
          equals:
            (parseInt(filter?.filters?.journalId || "") as number) || undefined,
        },
        milestoneId: {
          equals: parseInt(filter?.filters?.milestoneId || "") || undefined,
        },
      } || undefined,
    orderBy:
      {
        status: filter?.sort?.status || undefined,
        dueDate: filter?.sort?.dueDate || undefined,
        journalId: filter?.sort?.journalId || undefined,
        milestoneId: filter?.sort?.milestoneId || undefined,
        createdAt: filter?.sort?.createdAt || undefined,
        updatedAt: filter?.sort?.updatedAt || undefined,
      } || undefined,
    include: {
      journal: true,
      milestone: true,
    },
  });

  return tasks.map((task) => ({
    ...task,
    journalId: undefined,
    milestoneId: undefined,
  }));
});
