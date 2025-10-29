/*
  Warnings:

  - Added the required column `company_id` to the `status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."status" ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "is_default" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."status" ADD CONSTRAINT "status_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
