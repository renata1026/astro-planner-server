/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dob" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN     "gender" "Gender";
ALTER TABLE "User" ADD COLUMN     "location" STRING;
ALTER TABLE "User" ADD COLUMN     "picture" STRING;

-- DropTable
DROP TABLE "Profile";
