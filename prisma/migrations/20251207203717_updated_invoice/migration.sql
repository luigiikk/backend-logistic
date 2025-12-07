/*
  Warnings:

  - You are about to drop the column `client_id` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `recipient_id` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `status_id` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `tax_amount` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `invoice` table. All the data in the column will be lost.
  - Added the required column `company_id` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_order_id` to the `invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."invoice" DROP CONSTRAINT "invoice_client_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."invoice" DROP CONSTRAINT "invoice_recipient_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."invoice" DROP CONSTRAINT "invoice_status_id_fkey";

-- DropIndex
DROP INDEX "public"."invoice_client_id_idx";

-- DropIndex
DROP INDEX "public"."invoice_recipient_id_idx";

-- DropIndex
DROP INDEX "public"."invoice_status_id_idx";

-- AlterTable
ALTER TABLE "public"."invoice" DROP COLUMN "client_id",
DROP COLUMN "recipient_id",
DROP COLUMN "status_id",
DROP COLUMN "tax_amount",
DROP COLUMN "total_amount",
ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "purchase_order_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "invoice_purchase_order_id_idx" ON "public"."invoice"("purchase_order_id");

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
