/*
  Warnings:

  - Added the required column `company_id` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_order_id` to the `invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."invoice" ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "purchase_order_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "invoice_purchase_order_id_idx" ON "public"."invoice"("purchase_order_id");

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
