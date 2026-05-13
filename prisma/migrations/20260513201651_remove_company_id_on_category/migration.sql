/*
  Warnings:

  - You are about to drop the column `company_id` on the `category_resource` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "category_resource" DROP CONSTRAINT "category_resource_company_id_fkey";

-- AlterTable
ALTER TABLE "category_resource" DROP COLUMN "company_id";
