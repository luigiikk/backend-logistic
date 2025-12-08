/*
  Warnings:

  - You are about to drop the column `supplier_id` on the `invoice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."invoice" DROP CONSTRAINT "invoice_supplier_id_fkey";

-- DropIndex
DROP INDEX "public"."invoice_supplier_id_idx";

-- AlterTable
ALTER TABLE "public"."invoice" DROP COLUMN "supplier_id";
