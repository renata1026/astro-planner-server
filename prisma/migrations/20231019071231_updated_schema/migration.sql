/*
  Warnings:

  - You are about to drop the column `dob` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dob";
ALTER TABLE "User" DROP COLUMN "gender";
ALTER TABLE "User" DROP COLUMN "picture";
ALTER TABLE "User" ADD COLUMN     "profileImage" STRING;

-- DropEnum
DROP TYPE "Gender";
