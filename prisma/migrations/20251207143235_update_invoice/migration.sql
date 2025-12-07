/*
  Warnings:

  - You are about to drop the column `client_id` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `recipient_id` on the `invoice` table. All the data in the column will be lost.
  - Added the required column `supplier_id` to the `invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."invoice" DROP CONSTRAINT "invoice_client_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."invoice" DROP CONSTRAINT "invoice_recipient_id_fkey";

-- DropIndex
DROP INDEX "public"."invoice_client_id_idx";

-- DropIndex
DROP INDEX "public"."invoice_recipient_id_idx";

-- AlterTable
ALTER TABLE "public"."invoice" DROP COLUMN "client_id",
DROP COLUMN "recipient_id",
ADD COLUMN     "supplier_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "invoice_supplier_id_idx" ON "public"."invoice"("supplier_id");

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
