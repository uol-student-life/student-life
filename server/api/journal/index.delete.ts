import { prisma } from "../../db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  if (!query.id) {
    throw createError({
      statusCode: 400,
      message: "Missing required parameter: id",
    });
  }

  const id = parseInt(query.id.toString());

  const journal = await prisma.journal.findUnique({
    where: { id },
    select: {
      contentId: true,
    },
  });

  if (!journal) {
    throw createError({
      statusCode: 404,
      message: "Journal not found",
    });
  }

  const deleteJournal = prisma.journal.delete({
    where: { id },
  });

  const deleteContent = prisma.content.delete({
    where: { id: journal.contentId },
  });

  const removeJournalFromTasks = prisma.task.updateMany({
    where: { journalId: id },
    data: { journalId: null },
  });

  const removeJournalFromMilestones = prisma.milestonesOnJournals.deleteMany({
    where: { journalId: id },
  });

  await prisma.$transaction([
    removeJournalFromMilestones,
    removeJournalFromTasks,
    deleteJournal,
    deleteContent,
  ]);

  return `Journal ${id} deleted.`;
});
