/*
  Warnings:

  - You are about to drop the column `content` on the `Content` table. All the data in the column will be lost.
  - Added the required column `html` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lexical` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Content` DROP COLUMN `content`,
    ADD COLUMN `html` LONGBLOB NOT NULL,
    ADD COLUMN `lexical` LONGBLOB NOT NULL;
