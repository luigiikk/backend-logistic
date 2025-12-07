/*
  Warnings:

  - You are about to drop the column `status_id` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `tax_amount` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `invoice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."invoice" DROP CONSTRAINT "invoice_status_id_fkey";

-- DropIndex
DROP INDEX "public"."invoice_status_id_idx";

-- AlterTable
ALTER TABLE "public"."invoice" DROP COLUMN "status_id",
DROP COLUMN "tax_amount",
DROP COLUMN "total_amount";
