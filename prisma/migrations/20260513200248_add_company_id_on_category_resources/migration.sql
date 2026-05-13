/*
  Warnings:

  - Added the required column `company_id` to the `category_resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category_resource" ADD COLUMN     "company_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "category_resource" ADD CONSTRAINT "category_resource_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
