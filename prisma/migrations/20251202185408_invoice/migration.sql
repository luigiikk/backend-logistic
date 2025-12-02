/*
  Warnings:

  - A unique constraint covering the columns `[invoice_number]` on the table `invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."invoice" ADD COLUMN     "recipient_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "invoice_invoice_number_key" ON "public"."invoice"("invoice_number");

-- CreateIndex
CREATE INDEX "invoice_recipient_id_idx" ON "public"."invoice"("recipient_id");

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."Recipient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
