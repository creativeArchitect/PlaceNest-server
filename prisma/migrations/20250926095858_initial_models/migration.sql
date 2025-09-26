-- CreateEnum
CREATE TYPE "public"."Application_Status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."Branch" AS ENUM ('CS', 'CY', 'IT', 'ME', 'ECE', 'EIC', 'EE', 'CE');

-- CreateEnum
CREATE TYPE "public"."JobStatus" AS ENUM ('ACTIVE', 'CLOSED', 'DRAFT');

-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('Internship', 'PartTime', 'FullTime', 'Contract');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('STUDENT', 'COORDINATOR', 'COMPANY');

-- CreateEnum
CREATE TYPE "public"."Year" AS ENUM ('FIRST', 'SECOND', 'THIRD', 'FOURTH');

-- CreateEnum
CREATE TYPE "public"."Application_Mode" AS ENUM ('OFFLINE', 'ONLINE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "branch" "public"."Branch",
    "year" "public"."Year",
    "cgpa" DECIMAL(3,2),
    "active_backlog" BOOLEAN,
    "backlogs" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "resumeUrl" TEXT,
    "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."Role" NOT NULL,
    "industy" TEXT,
    "description" TEXT,
    "website" TEXT,
    "founded" TEXT,
    "linkedin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" TEXT NOT NULL,
    "status" "public"."Application_Status" NOT NULL DEFAULT 'PENDING',
    "mode" "public"."Application_Mode" NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Job" (
    "id" TEXT NOT NULL,
    "type" "public"."JobType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "package" TEXT NOT NULL,
    "cgpaCutOff" DECIMAL(3,2) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "public"."JobStatus" NOT NULL DEFAULT 'ACTIVE',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_website_key" ON "public"."User"("website");

-- CreateIndex
CREATE UNIQUE INDEX "User_linkedin_key" ON "public"."User"("linkedin");

-- CreateIndex
CREATE INDEX "User_branch_year_idx" ON "public"."User"("branch", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Application_jobId_userId_key" ON "public"."Application"("jobId", "userId");

-- CreateIndex
CREATE INDEX "Job_deadline_idx" ON "public"."Job"("deadline");

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
