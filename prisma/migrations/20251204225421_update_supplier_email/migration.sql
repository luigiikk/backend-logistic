/*
  Warnings:

  - You are about to drop the column `category` on the `supplier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `supplier` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."supplier" DROP COLUMN "category";

-- CreateIndex
CREATE UNIQUE INDEX "supplier_email_key" ON "public"."supplier"("email");
