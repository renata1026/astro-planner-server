/*
  Warnings:

  - You are about to drop the column `email` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Profile_email_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "email";
ALTER TABLE "Profile" DROP COLUMN "firstName";
ALTER TABLE "Profile" DROP COLUMN "lastName";
