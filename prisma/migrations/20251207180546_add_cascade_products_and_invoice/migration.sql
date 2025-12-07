/*
  Warnings:

  - You are about to drop the column `company_id` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_order_id` on the `invoice` table. All the data in the column will be lost.
  - Added the required column `status_id` to the `invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."invoice" DROP CONSTRAINT "invoice_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."invoice" DROP CONSTRAINT "invoice_purchase_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_order_id_fkey";

-- DropIndex
DROP INDEX "public"."invoice_purchase_order_id_idx";

-- AlterTable
ALTER TABLE "public"."invoice" DROP COLUMN "company_id",
DROP COLUMN "purchase_order_id",
ADD COLUMN     "client_id" INTEGER,
ADD COLUMN     "recipient_id" INTEGER,
ADD COLUMN     "status_id" INTEGER NOT NULL,
ADD COLUMN     "tax_amount" DOUBLE PRECISION,
ADD COLUMN     "total_amount" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "invoice_client_id_idx" ON "public"."invoice"("client_id");

-- CreateIndex
CREATE INDEX "invoice_status_id_idx" ON "public"."invoice"("status_id");

-- CreateIndex
CREATE INDEX "invoice_recipient_id_idx" ON "public"."invoice"("recipient_id");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."Recipient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
