/*
  Warnings:

  - You are about to drop the column `contact` on the `supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."supplier" DROP COLUMN "contact",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "number" INTEGER,
ADD COLUMN     "phone" TEXT;
