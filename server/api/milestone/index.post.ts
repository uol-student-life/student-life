import { prisma } from "../../db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.description) {
    throw createError({
      statusCode: 400,
      message: "body.description is required",
    });
  }

  if (!body.journalId) {
    throw createError({
      statusCode: 400,
      message: "body.journalId is required",
    });
  }

  const journal = await prisma.journal.findUnique({
    where: { id: parseInt(body.journalId) as number },
    select: { id: true },
  });

  if (!journal) {
    throw createError({
      statusCode: 400,
      message: "Journal not found",
    });
  }

  const newMilestoneOnJournal = await prisma.milestonesOnJournals.create({
    data: {
      journal: {
        connect: { id: journal.id },
      },
      milestone: {
        create: {
          description: body.description,
        },
      },
    },
  });

  const newMilestone = prisma.milestone.findUnique({
    where: { id: newMilestoneOnJournal.milestoneId },
    include: {
      journals: true,
    },
  });

  return newMilestone;
});
