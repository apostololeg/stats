/*
  Warnings:

  - You are about to drop the column `projectId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `pid` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_projectId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "projectId",
ADD COLUMN     "pid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_pid_fkey" FOREIGN KEY ("pid") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
