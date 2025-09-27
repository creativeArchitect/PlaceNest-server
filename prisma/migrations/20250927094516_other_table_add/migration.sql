/*
  Warnings:

  - Added the required column `verifiedById` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifiedById` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifiedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "verifiedById" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."JobEligibility" (
    "id" TEXT NOT NULL,
    "branch" "public"."Branch",
    "minYear" "public"."Year",
    "jobId" TEXT NOT NULL,

    CONSTRAINT "JobEligibility_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Company" ADD CONSTRAINT "Company_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "public"."Coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "public"."Coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobEligibility" ADD CONSTRAINT "JobEligibility_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
