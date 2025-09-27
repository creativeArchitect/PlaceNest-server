/*
  Warnings:

  - You are about to drop the column `password` on the `Coordinator` table. All the data in the column will be lost.
  - Added the required column `phone` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Company_name_industry_email_idx";

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Coordinator" DROP COLUMN "password";

-- CreateIndex
CREATE INDEX "Company_name_industry_email_phone_idx" ON "public"."Company"("name", "industry", "email", "phone");
