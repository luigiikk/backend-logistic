/*
  Warnings:

  - Added the required column `company_id` to the `client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."client" ADD COLUMN     "company_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."client" ADD CONSTRAINT "client_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
