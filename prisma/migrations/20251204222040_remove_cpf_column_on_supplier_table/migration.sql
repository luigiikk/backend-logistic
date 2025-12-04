/*
  Warnings:

  - You are about to drop the column `CPF` on the `supplier` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."supplier_CPF_key";

-- AlterTable
ALTER TABLE "public"."supplier" DROP COLUMN "CPF";
