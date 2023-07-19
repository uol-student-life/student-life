import { prisma } from "../../db";
import type { MilestoneFilterInput } from "~/types";
import { MilestoneStatus } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const filter: MilestoneFilterInput = body || {};

  const milestones = await prisma.milestone.findMany({
    where: {
      description: {
        contains: (filter.filters?.description as string) || undefined,
      },
      status: {
        equals: (filter.filters?.status as MilestoneStatus) || undefined,
      },
      journals: {
        some: {
          journalId: {
            equals:
              (parseInt(filter.filters?.journalId as string) as number) ||
              undefined,
          },
        },
      },
    },
    orderBy: {
      createdAt: filter.sort?.createdAt || undefined,
      updatedAt: filter.sort?.updatedAt || undefined,
    },
    include: {
      tasks: true,
      journals: true,
    },
  });

  return milestones.map((milestone) => ({
    ...milestone,
  }));
});
