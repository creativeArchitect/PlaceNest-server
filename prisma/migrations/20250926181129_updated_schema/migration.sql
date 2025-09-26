/*
  Warnings:

  - You are about to drop the column `userId` on the `Application` table. All the data in the column will be lost.
  - The `status` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `position` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `active_backlog` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `backlogs` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `branch` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cgpa` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `founded` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `industy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileCompleted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jobId,studentId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `mode` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `role` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ApplicationMode" AS ENUM ('OFFLINE', 'ONLINE');

-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_jobId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Job" DROP CONSTRAINT "Job_companyId_fkey";

-- DropIndex
DROP INDEX "public"."Application_jobId_userId_key";

-- DropIndex
DROP INDEX "public"."Job_deadline_idx";

-- DropIndex
DROP INDEX "public"."User_branch_year_idx";

-- DropIndex
DROP INDEX "public"."User_linkedin_key";

-- DropIndex
DROP INDEX "public"."User_website_key";

-- AlterTable
ALTER TABLE "public"."Application" DROP COLUMN "userId",
ADD COLUMN     "studentId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "mode",
ADD COLUMN     "mode" "public"."ApplicationMode" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Job" DROP COLUMN "position",
ADD COLUMN     "role" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "active_backlog",
DROP COLUMN "backlogs",
DROP COLUMN "branch",
DROP COLUMN "cgpa",
DROP COLUMN "description",
DROP COLUMN "founded",
DROP COLUMN "industy",
DROP COLUMN "isVerified",
DROP COLUMN "linkedin",
DROP COLUMN "profileCompleted",
DROP COLUMN "resumeUrl",
DROP COLUMN "website",
DROP COLUMN "year";

-- DropEnum
DROP TYPE "public"."Application_Mode";

-- DropEnum
DROP TYPE "public"."Application_Status";

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "founded" TEXT NOT NULL,
    "linkedin" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "branch" "public"."Branch",
    "year" "public"."Year",
    "cgpa" DECIMAL(3,2),
    "activeBacklog" BOOLEAN,
    "backlogs" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "resumeUrl" TEXT,
    "profileCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Coordinator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "branch" "public"."Branch",
    "year" "public"."Year",
    "cgpa" DECIMAL(3,2),
    "activeBacklog" BOOLEAN,
    "backlogs" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "resumeUrl" TEXT,
    "profileCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Coordinator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Company_name_industry_email_idx" ON "public"."Company"("name", "industry", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "public"."Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_phone_key" ON "public"."Student"("phone");

-- CreateIndex
CREATE INDEX "Student_branch_year_phone_email_idx" ON "public"."Student"("branch", "year", "phone", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Coordinator_email_key" ON "public"."Coordinator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Coordinator_phone_key" ON "public"."Coordinator"("phone");

-- CreateIndex
CREATE INDEX "Coordinator_branch_year_phone_email_idx" ON "public"."Coordinator"("branch", "year", "phone", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Application_jobId_studentId_key" ON "public"."Application"("jobId", "studentId");

-- CreateIndex
CREATE INDEX "Job_status_deadline_companyId_idx" ON "public"."Job"("status", "deadline", "companyId");

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
