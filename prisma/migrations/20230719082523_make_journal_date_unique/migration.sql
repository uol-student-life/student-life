/*
  Warnings:

  - A unique constraint covering the columns `[journalDate]` on the table `Journal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Journal_journalDate_key` ON `Journal`(`journalDate`);
